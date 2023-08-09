import { ChatConverseStream } from "./types";
export declare type paginatedResponse<T> = {
    count: number;
    has_next: boolean;
    has_previous: boolean;
    offset: number;
    results: T[];
};
export declare const API: {
    projects: {
        list: (filters?: {
            ordering: string;
        }) => Promise<any>;
        get: (id: string) => Promise<any>;
    };
    chat: {
        create: (project_id: string, title: string, openai_api_key?: string | undefined) => Promise<any>;
        get: (project_id: string, id: string) => Promise<any>;
        converse: (project_id: string, chat_id: string, formdata: FormData, openai_api_key?: string | undefined, onMessage?: ((event: ChatConverseStream) => void) | null, delay?: number | null) => Promise<any>;
    };
};
