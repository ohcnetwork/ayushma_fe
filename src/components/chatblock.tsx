import { ChatMessage, ChatMessageType } from "@/types/chat";

export default function ChatBlock(props: { message?: ChatMessage, loading?: boolean }) {

    const { message, loading } = props;

    return (
        <div className={`flex gap-6 p-6 ${message?.messageType === ChatMessageType.USER ? "bg-black/5" : ""}`}>
            <div className="text-2xl">
                {message?.messageType === ChatMessageType.USER && !loading ? "👤" : "🤖"}
            </div>
            <div>
                {loading ? "Loading..." : message?.message}
            </div>
        </div>
    )
}