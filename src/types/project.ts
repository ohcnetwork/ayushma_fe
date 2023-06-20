import { BaseModelType } from "./chat";

export type Project = BaseModelType & {
    title: string,
    description: string,
    is_default: boolean,
    prompt?: string,
    stt_engine: string,
}

export enum DocumentType {
    FILE = 1,
    URL = 2,
    TEXT = 3
}

export const STT_ENGINES = [
    { id: 'whisper', label: 'OpenAI Whisper' },
    { id: 'google', label: 'Google Speech to Text' },
]

export type Document = BaseModelType & {
    title: string,
    description: string,
    file: File,
    text_content: string,
    document_type: DocumentType,
}