import { Chat, ChatConverseStream } from "./types";
import { EventSourceMessage, FetchEventSourceInit, fetchEventSource } from '@microsoft/fetch-event-source';

export type paginatedResponse<T> = {
    count: number,
    has_next: boolean,
    has_previous: boolean,
    offset: number,
    results: T[],
}

type methods = "POST" | "GET" | "PATCH" | "DELETE" | "PUT";

type options = {
    base_url?: string,
    formdata?: boolean,
    external?: boolean,
    headers?: any,
    auth?: boolean,
    stream?: boolean,
}

const request = async (
    endpoint: string,
    method: methods = 'GET',
    data: any = {},
    options: options = {},
    onMessage: ((event: EventSourceMessage) => void) | null = null
) => {
    const { formdata, external, headers, auth: isAuth, stream } = options;

    const noonce = (new Date().getTime() + Math.random()).toString();
    if (formdata) data.append('noonce', noonce); else data['noonce'] = noonce;
    const base_url = (localStorage && localStorage.getItem('ayushma-chatbot-api-url')) || "https://ayushma-api.ohc.network/api/";

    let url = external ? endpoint : base_url + endpoint;
    let payload = formdata ? data : JSON.stringify(data);


    const storage = isAuth === false ? null : localStorage.getItem('ayushma-chatbot-token');
    const localToken = storage;

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

    const requestOptions = {
        method: method,
        headers: {
            Accept: 'application/json',
            ...(formdata === true
                ? {}
                : {
                    'Content-Type': 'application/json',
                }),
            Authorization: "Bearer " + localToken,
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
                        onMessage({ id: "", event: "", data: JSON.stringify({ error }) })
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

let messageBuffer: ChatConverseStream[] = [];
let intervalHandle: NodeJS.Timer | number | null = null;

function handleMessage(data: ChatConverseStream, onMessage: ((event: ChatConverseStream) => void), delay: number | null) {
    if (!delay || delay == 0) {
        onMessage(data);
        return;
    }
    messageBuffer.push(data);

    if (!intervalHandle) {
        intervalHandle = setInterval(() => {
            if (messageBuffer.length > 0) {
                const message = messageBuffer.shift();
                if (message) onMessage(message);
            } else {
                intervalHandle && clearInterval(intervalHandle);
                intervalHandle = null;
            }
        }, delay);
    }
}

export const API = {
    projects: {
        list: (filters: { ordering: string } = { ordering: "-created_at" }) => request("projects", "GET", filters),
        get: (id: string) => request(`projects/${id}`),
    },
    chat: {
        create: (project_id: string, title: string, openai_api_key?: string) => request(`projects/${project_id}/chats`, "POST", { title }, openai_api_key ? {
            headers: {
                "OpenAI-Key": openai_api_key
            }
        } : {}),
        get: (project_id: string, id: string) => request(`projects/${project_id}/chats/${id}`),
        converse: (
            project_id: string,
            chat_id: string,
            formdata: FormData,
            openai_api_key?: string,
            chat?: Chat,
            onMessage: ((event: ChatConverseStream, chat: Chat) => void) | null = null,
            delay: number | null = null,
        ) =>
            request(`projects/${project_id}/chats/${chat_id}/converse`, "POST", formdata, {
                stream: true,
                formdata: true,
                headers: openai_api_key ? {
                    "OpenAI-Key": openai_api_key
                } : {}
            }, (e) => {
                if (onMessage) {
                    const data = JSON.parse(e.data);
                    if (data.error) {
                        throw Error(data.error);
                    }
                    handleMessage(data, (e) => onMessage(e, chat as any), delay);
                }
            }),
    }
}
