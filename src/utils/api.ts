import { User } from "@/types/user";
import { Storage } from "./storage";

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
}

const request = async (endpoint: endpoint, method: methods = "GET", data: any = {}, options: options = {}) => {

    const { formdata, external, headers, auth: isAuth } = options;

    let url = external ? endpoint : (API_BASE_URL + endpoint);
    let payload: null | string = formdata ? data : JSON.stringify(data);

    if (method === "GET") {
        const requestParams = data ? `?${Object.keys(data).filter(key => data[key] !== null && data[key] !== undefined).map(key => `${key}=${data[key]}`).join("&")}` : "";
        url += requestParams;
        payload = null;
    }
    const storage: Storage = JSON.parse(localStorage.getItem("ayushma-storage") || "{}");
    const localToken = storage.auth_token;

    const auth = isAuth === false || typeof localToken === "undefined" || localToken === null ? "" : "Token " + localToken;

    //console.log("Making request to", url, "with payload", payload, "and headers", headers)

    const response = await fetch(url, {
        method: method,
        headers: {
            "Content-Type": formdata ? "multipart/form-data" : "application/json",
            Authorization: auth,
            ...headers
        },
        body: payload
    });
    try {
        const txt = await response.clone().text();
        if (txt === "") {
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

export const API = {
    user: {
        login: (email: string, password: string) => request("auth/login", "POST", { email, password }),
        me: () => request("users/me"),
        save: (details: User) => request(`users/me`, "PATCH", details),
    },
    chat: {
        list: (filters: { ordering: string } = { ordering: "-created_at" }) => request("chats", "GET", filters),
        create: (title: string, namespace: string, openai_api_key?: string) => request("chats", "POST", { title, namespace }, openai_api_key ? {
            headers: {
                "OpenAI-Key": openai_api_key
            }
        } : {}),
        get: (id: string) => request(`chats/${id}`),
        update: (id: string, title: string) => request(`chats/${id}`, "PATCH", { title }),
        delete: (id: string) => request(`chats/${id}`, "DELETE"),
        converse: (chat_id: string, text: string, openai_api_key?: string) => request(`chats/${chat_id}/converse`, "POST", { text }, openai_api_key ? {
            headers: {
                "OpenAI-Key": openai_api_key
            }
        } : {}),
    }
}