import { ChatMessage, ChatMessageType } from "@/types/chat";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";

export default function ChatBlock(props: { message?: ChatMessage; loading?: boolean }) {
    const { message, loading } = props;

    return (
        <>
            <div
                className={`flex gap-6 px-6 pt-6 ${message?.reference_documents && message?.reference_documents?.length > 0 ? 'pb-3' : 'pb-6'} ${
                    message?.messageType === ChatMessageType.USER ? 'bg-black/5' : ''
                }`}
            >
                <div className="w-8 text-2xl shrink-0 text-center">
                    {message?.messageType === ChatMessageType.USER && !loading ? (
                        '👤'
                    ) : (
                        <>
                            <Image src="/ayushma.svg" className="w-full" alt="Ayushma logo" width={200} height={200} />
                        </>
                    )}
                </div>
                <div>
                    {loading ? (
                        'Loading...'
                    ) : (
                        <ReactMarkdown remarkPlugins={[remarkGfm]} className="markdown-render">
                            {message?.message || ''}
                        </ReactMarkdown>
                    )}
                </div>
            </div>
            {message?.reference_documents && message?.reference_documents.length > 0 && (
                <div className="flex gap-2 pl-20 items-center pb-4">
                    <p className="font-medium mr-1 text-sm italic">References:</p>
                    {message?.reference_documents.map((doc, i) => {
                        if (doc.document_type === 1 || doc.document_type === 2)
                            return (
                                <a
                                    key={i}
                                    href={doc.document_type === 1 ? process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL?.slice(0, -5) + doc?.file : doc.text_content}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-md hover:bg-gray-300"
                                >
                                    {i + 1}. {doc.title}
                                </a>
                            );
                        else if (doc.document_type === 3)
                            return (
                                <div className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-md hover:bg-gray-300">
                                    {i + 1}. {doc.title}
                                </div>
                            );
                        else return null;
                    })}
                </div>
            )}
        </>
    );
}
