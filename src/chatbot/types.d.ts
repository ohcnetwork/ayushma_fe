export declare type ChatbotProps = {
    containerClass?: string;
    buttonClass?: string;
    chatboxClass?: string;
    projectID: string;
    presetQuestions?: string[];
    api_url?: string;
    authToken?: string;
};
export declare type BaseModelType = {
    external_id: string;
    created_at: string;
    modified_at: string;
};
export declare type Chat = BaseModelType & {
    title: string;
    namespace: string;
    chats?: ChatMessage[];
};
export declare enum ChatMessageType {
    USER = 1,
    SYSTEM = 2,
    AYUSHMA = 3
}
export declare type Document = BaseModelType & {
    title: string;
    description?: string;
    document_type: number;
    text_content?: string;
    file?: string;
};
export declare type ChatMessage = BaseModelType & {
    messageType: ChatMessageType;
    message: string;
    translated_message?: string;
    reference_documents?: Document[];
    audio?: string;
    language: string;
    original_message: string;
    meta?: ChatMessageMeta;
    top_k?: number;
    temperature?: number;
};
export declare type ChatConverseStream = {
    chat: string;
    input: string;
    delta: string;
    message: string;
    stop: boolean;
    ayushma_voice?: string;
};
export declare type ChatMessageMeta = {
    reference_start?: number;
    reference_end?: number;
    response_start?: number;
    response_end?: number;
    translate_start?: number;
    translate_end?: number;
    tts_start?: number;
    tts_end?: number;
    upload_start?: number;
    upload_end?: number;
};
