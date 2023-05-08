import { User } from "@/types/user";
import { Project } from "@/types/project";
import { EventSourceMessage, FetchEventSourceInit, fetchEventSource } from '@microsoft/fetch-event-source';
import { ChatConverseStream } from "@/types/chat";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type endpoint = `${string}`;

export type paginatedResponse<T> = {
    count: number,
    has_next: boolean,
    has_previous: boolean,
    offset: number,
    results: T[],
}

type methods = "POST" | "GET" | "PATCH" | "DELETE" | "PUT";

type options = {
    formdata?: boolean,
    external?: boolean,
    headers?: any,
    auth?: boolean,
    stream?: boolean,
}

const request = async (
    endpoint: endpoint,
    method: methods = 'GET',
    data: any = {},
    options: options = {},
    onMessage: ((event: EventSourceMessage) => void) | null = null
) => {
    const { formdata, external, headers, auth: isAuth, stream } = options;

    let url = external ? endpoint : API_BASE_URL + endpoint;
    let payload = formdata ? data : JSON.stringify(data);

    if (method === 'GET') {
        const requestParams = data
            ? `?${Object.keys(data)
                .filter(key => data[key] !== null && data[key] !== undefined)
                .map(key => `${key}=${data[key]}`)
                .join('&')}`
            : '';
        url += requestParams;
        payload = null;
    }

    const storage = JSON.parse(localStorage.getItem('ayushma-storage') || '{}');
    const localToken = storage.auth_token;

    const auth =
        isAuth === false || typeof localToken === 'undefined' || localToken === null
            ? ''
            : 'Token ' + localToken;

    const requestOptions = {
        method: method,
        headers: {
            ...(formdata === true
                ? {}
                : {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }),
            Authorization: auth,
            ...headers,
        },
        body: payload,
    };

    if (stream) {
        return new Promise<void>(async (resolve, reject) => {
            const streamOptions: FetchEventSourceInit = {
                ...requestOptions,
                onmessage: (e: EventSourceMessage) => {
                    if (onMessage)
                        onMessage(e);
                },
                onerror: (error: any) => {
                    if (onMessage)
                        onMessage({ id: "", event: "", data: JSON.stringify({ error: error.message }) })
                    reject({ error });
                },
                onclose() {
                    resolve();
                },
                onopen: async (response) => {
                    if (response.ok && response.headers.get('content-type') === "text/event-stream") {
                        return; // everything's good
                    } else if (response.status >= 400 && response.status < 500 && response.status !== 429) {
                        // client-side errors are usually non-retriable:
                        throw { error: response.statusText };
                    } else {
                        throw { error: response.statusText };
                    }
                },
            };

            await fetchEventSource(url, streamOptions);
        });
    } else {
        const response = await fetch(url, requestOptions);
        try {
            const txt = await response.clone().text();
            if (txt === '') {
                return {};
            }
            const json = await response.clone().json();
            if (json && response.ok) {
                return json;
            } else {
                throw json;
            }
        } catch (error) {
            throw { error };
        }
    }
};

export const API = {
    user: {
        login: (email: string, password: string) => request("auth/login", "POST", { email, password }),
        me: () => request("users/me"),
        save: (details: User) => request(`users/me`, "PATCH", details),
        register: (creds: { email: string, password: string, username: string, full_name: string }) => request("auth/register", "POST", { ...creds }),
        forgot: (email: string) => request("auth/forgot", "POST", { email }),
        verify: (token: string, email: string) => request("auth/verify", "POST", { token, email }),
        reset: (token: string, email: string, password: string) => request("auth/reset", "POST", { token, email, password }),
    },
    projects: {
        list: () => request("projects"),
        get: (id: string) => request(`projects/${id}`),
        update: (id: string, project: Partial<Project>) => request(`projects/${id}`, "PATCH", { ...project }),
        create: (project: Partial<Project>) => request(`projects`, "POST", { ...project }),
        delete: (id: string) => request(`projects/${id}`, "DELETE"),
    },
    documents: {
        list: (project_id: string, filters: { ordering: string } = { ordering: "-created_at" }) => request(`projects/${project_id}/documents`, "GET", filters),
        create: (project_id: string, document: FormData) => request(`projects/${project_id}/documents`, "POST", document, {
            formdata: true
        }),
        get: (project_id: string, id: string) => request(`projects/${project_id}/documents/${id}`),
        edit: (project_id: string, id: string, document: FormData) => request(`projects/${project_id}/documents/${id}`, "PATCH", document, {
            formdata: true
        }),
    },
    chat: {
        list: (project_id: string, filters: { ordering: string } = { ordering: "-created_at" }) => request(`projects/${project_id}/chats`, "GET", filters),
        create: (project_id: string, title: string, openai_api_key?: string) => request(`projects/${project_id}/chats`, "POST", { title }, openai_api_key ? {
            headers: {
                "OpenAI-Key": openai_api_key
            }
        } : {}),
        get: (project_id: string, id: string) => request(`projects/${project_id}/chats/${id}`),
        update: (project_id: string, id: string, title: string) => request(`projects/${project_id}/chats/${id}`, "PATCH", { title }),
        delete: (project_id: string, id: string) => request(`projects/${project_id}/chats/${id}`, "DELETE"),
        converse: (project_id: string, chat_id: string, text: string, openai_api_key?: string, onMessage: ((event: ChatConverseStream) => void) | null = null) => request(`projects/${project_id}/chats/${chat_id}/converse`, "POST", { text }, openai_api_key ? {
            headers: {
                "OpenAI-Key": openai_api_key
            },
            stream: true
        } : {}, (e) => {
            if (onMessage) {
                const data = JSON.parse(e.data);
                if(data.error){
                    throw Error(data.error);
                }
                onMessage(data);
            }
        }),
        audio_converse: (project_id: string, chat_id: string, formdata: FormData, openai_api_key?: string) => request(`projects/${project_id}/chats/${chat_id}/audio_converse`, "POST", formdata, {
            formdata: true,
            headers: openai_api_key ? {
                "OpenAI-Key": openai_api_key
            } : {}
        }),

    }
}