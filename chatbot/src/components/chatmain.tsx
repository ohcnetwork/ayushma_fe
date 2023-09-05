import { Chat, ChatMessage, ChatMessageType } from "../types";
import React, { useEffect } from "react";

export default function ChatMain(props: {
    projectID: string,
    chat: Chat,
    streamingMessage: string,
    isTyping: boolean,
    chatMessage: string,
}) {

    const { projectID, chat, streamingMessage: initStreaming, isTyping, chatMessage } = props;

    const [streamingMessage, setStreamingMessage] = React.useState<string>(initStreaming);

    useEffect(() => {
        setStreamingMessage("");
    }, [chat]);

    useEffect(() => {
        setStreamingMessage(initStreaming);
    }, [initStreaming]);

    return (
        <div className="overflow-auto h-full">
            {chat?.chats?.map((message, index) => <ChatBlock key={index} message={message} />)}
            {chatMessage && (
                <ChatBlock message={{
                    message: chatMessage,
                    messageType: ChatMessageType.USER,
                }} />
            )}
            {streamingMessage && (
                <ChatBlock message={{
                    message: streamingMessage,
                    messageType: ChatMessageType.AYUSHMA,
                }} />
            )}
        </div>
    )
}

function ChatBlock(props: {
    message: Partial<ChatMessage>
}) {

    const { message } = props;

    return (
        <div className={`flex items-center w-full p-2 ${message.messageType === ChatMessageType.AYUSHMA ? "justify-start" : "justify-end"}`}>
            <div className={`px-3 text-sm py-2 border rounded-lg ${message.messageType === ChatMessageType.AYUSHMA ? "bg-white mr-4" : "bg-green-700 text-white ml-4"}`}>
                {message.message}
            </div>
        </div>
    )
}