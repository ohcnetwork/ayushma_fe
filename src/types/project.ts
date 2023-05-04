import { BaseModelType } from "./chat";

export type Project = BaseModelType & {
    title: string,
    description: string,
    is_default: boolean,
    prompt?: string,
}

export type Document = BaseModelType & {
    title: string,
    description: string,
    file: File,
}