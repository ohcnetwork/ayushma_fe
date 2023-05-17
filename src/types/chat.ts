export type BaseModelType = {
    external_id: string,
    created_at: string,
    modified_at: string
}

export type Chat = BaseModelType & {
    title: string,
    namespace: string,
    chats?: ChatMessage[]
}

export enum ChatMessageType {
    USER = 1,
    SYSTEM = 2,
    AYUSHMA = 3
}

export type ChatMessage = BaseModelType & {
    messageType: ChatMessageType,
    message: string,
    reference_documents?: any[],
}

export type ChatConverseStream = {
    chat: string,
    input: string,
    delta: string,
    message: string,
    stop: boolean,
}