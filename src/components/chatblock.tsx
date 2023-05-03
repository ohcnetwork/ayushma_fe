import { ChatMessage, ChatMessageType } from "@/types/chat";

export default function ChatBlock(props: { message?: ChatMessage, loading?: boolean }) {

    const { message, loading } = props;

    return (
        <div className={`flex gap-6 p-6 ${message?.messageType === ChatMessageType.USER ? "bg-black/5" : ""}`}>
            <div className="w-8 text-2xl shrink-0 text-center">
                {message?.messageType === ChatMessageType.USER && !loading ? "👤" : <>
                    <img src="/ayushma.svg" alt="Logo" className="w-full" />
                </>}
            </div>
            <div>
                {loading ? "Loading..." : message?.message}
            </div>
        </div>
    )
}