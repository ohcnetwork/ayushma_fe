import { BaseModelType } from "./chat";

export type Project = BaseModelType & {
    title: string,
    description: string,
    is_default: boolean,
    prompt?: string,
}

export enum DocumentType {
    FILE = 1,
    URL = 2,
    TEXT = 3
}

export type Document = BaseModelType & {
    title: string,
    description: string,
    file: File,
    text_content: string,
    document_type: DocumentType,
}