import { User } from "@/types/user";

export type Storage = {
    auth_token?: string,
    user?: User,
    openai_api_key?: string,
    override_api_key?: boolean,
    language?: string,
    show_stats?: boolean,
    show_english?: boolean,
    temperature?: number,
    top_k?: number,
    chatbot_token?: string,
}