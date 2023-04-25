import { User } from "@/types/user";

export type Storage = {
    auth_token?: string,
    user?: User,
    openai_api_key?: string,
    override_api_key?: boolean,
}