import { ChatMessage, ChatMessageType } from "@/types/chat";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import remarkGfm from "remark-gfm";

export default function ChatBlock(props: { message?: ChatMessage, loading?: boolean, cursor?: boolean }) {

    const { message, loading, cursor } = props;
    const cursorText = cursor ? (message?.message?.length || 0) % 2 === 0 ? "|" : "" : "";

    return (
        <div className={`flex gap-6 p-6 ${message?.messageType === ChatMessageType.USER ? "bg-black/5" : ""}`}>
            <div className="w-8 text-2xl shrink-0 text-center">
                {message?.messageType === ChatMessageType.USER && !loading ? "👤" : <>
                    <img src="/ayushma.svg" alt="Logo" className="w-full" />
                </>}
            </div>
            <div>
                {loading ? "Loading..." :
                    <ReactMarkdown remarkPlugins={[remarkGfm]} className="markdown-render">
                        {message?.message + cursorText || ""}
                    </ReactMarkdown>
                }
            </div>
        </div>
    )
}