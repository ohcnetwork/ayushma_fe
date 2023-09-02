import React, { useEffect, useState } from "react";
import { ChatMessage, ChatMessageType } from "@/types/chat";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";
import rehypeRaw from 'rehype-raw'
import { storageAtom } from "@/store";
import { useAtom } from "jotai";
import Stats from "./stats";

type AudioStatus = "unloaded" | "loading" | "playing" | "paused" | "stopped";

export default function ChatBlock(props: { message?: ChatMessage, loading?: boolean, autoplay?: boolean, cursor?: boolean }) {

    const [storage] = useAtom(storageAtom);
    const { message, loading, cursor, autoplay } = props;
    const cursorText = cursor ? (message?.original_message?.length || 0) % 2 === 0 ? "|" : "" : "";
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
    const [audioStatus, setAudioStatus] = useState<AudioStatus>("unloaded");
    const [percentagePlayed, setPercentagePlayed] = useState(0);


    const isCompleteLetter = (str: string) => {
        const regex = /^\p{L}$/u;
        return regex.test(str);
    }

    const chatMessage = (message?.message != message?.original_message ? message?.message : message?.original_message) + cursorText;

    const getMessageSegments = (): { highlightText: string; blackText: string } => {
        const messageLength = chatMessage.length || 0;
        const highlightLength = percentagePlayed === 100 ? 0 : Math.floor((percentagePlayed / 100) * messageLength);

        let highlightText = chatMessage.slice(0, highlightLength) || '';
        let blackText = chatMessage.slice(highlightLength) || '';

        while (highlightText && blackText && percentagePlayed < 100 && highlightText.length > 0 && !isCompleteLetter(highlightText.slice(-1))) {
            highlightText += blackText[0];
            blackText = blackText.slice(1);
        }

        return { highlightText, blackText };
    }

    const { highlightText, blackText } = getMessageSegments();


    useEffect(() => {
        if (audio) {
            const interval = setInterval(() => {
                setPercentagePlayed((audio.currentTime / audio.duration) * 100);
            }, 10);
            return () => clearInterval(interval);
        }
    }, [audio]);



    const loadAudio = async () => {
        if (message?.messageType === ChatMessageType.AYUSHMA) {
            setAudioStatus("loading");
            const audio = new Audio(message?.audio);
            setAudio(audio);
            setAudioStatus("playing");
            audio.play();
            audio.addEventListener("ended", () => {
                setAudioStatus("stopped");
            });
        }
    }

    const togglePlay = () => {
        if (audioStatus === "loading") return;
        if (audioStatus === "unloaded") loadAudio();
        if (audioStatus === "playing") { audio?.pause(); setAudioStatus("paused"); }
        else { audio?.play(); setAudioStatus("playing"); }
    }

    const stopAudio = () => {
        if (!audio) return;
        if (audioStatus === "loading" || audioStatus === "unloaded") return;
        if (audioStatus === "playing" || audioStatus === "paused") {
            audio?.pause();
            audio.currentTime = 0;
            setAudioStatus("stopped");
        }
    }

    useEffect(() => {
        if (autoplay) togglePlay();
    }, []);

    return (
        <div className={`flex flex-col gap-4 p-4 md:p-6 ${message?.messageType === ChatMessageType.USER ? "bg-gray-500/5" : ""}`}>
            <div className="flex gap-6 max-w-4xl mx-auto w-full">
                <div>

                        {message?.messageType === ChatMessageType.USER && !loading ?
                        <div className="flex items-center justify-center w-10 h-10 text-2xl shrink-0 text-center bg-[#ffc688] rounded-full">
                            <Image className="p-1.5" src="/person.svg" alt="User icon" width={100} height={100} />
                        </div> : message?.messageType === ChatMessageType.AYUSHMA && !loading ?
                        <div className="flex items-center justify-center w-10 h-10 text-2xl shrink-0 text-center rounded-full">
                        <Image className="p-0.5" src="/logo.svg" alt="Logo" width={100} height={100} /></div> :
                        <div className="flex items-center justify-center w-10 h-10 text-2xl shrink-0 text-center bg-gray-300 rounded-full">
                            <i className="fa-solid fa-circle-exclamation"></i>
                        </div>}
                </div>
                <div className="w-full pt-0.5">
                    {loading ? "Loading..." :
                        (
                            <div>
                                 {message?.messageType === ChatMessageType.SYSTEM && (
                                    <div className="relative flex flex-col gap-1">
                                        <div className="min-h-[20px] flex flex-col items-start text-red-500">
                                            <div className="py-2 px-3 border text-gray-700 rounded-md text-sm border-red-500 bg-red-500/10">
                                                {message?.message}
                                            </div>
                                        </div>
                                    </div>
                                 )}
                                {message?.messageType != ChatMessageType.SYSTEM && (<ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]} className="markdown-render">
                                    {
                                        (audioStatus === "unloaded" ?
                                            ((message?.message || message?.original_message) + cursorText || "") :
                                            `<span className="text-green-600">${highlightText}</span><span>${blackText}</span>`
                                        )
                                    }
                                </ReactMarkdown>)}
                                {message?.messageType === ChatMessageType.AYUSHMA && message?.audio && (
                                    <div className="inline-flex gap-1 mt-2">
                                        <button onClick={togglePlay} className="flex items-center justify-center text-gray-500 rounded-lg transition bg-gray-100 hover:text-gray-700 hover:bg-gray-300 p-2">
                                            {audioStatus === "playing" ? (
                                                <i className="fa-regular fa-circle-pause text-xl"></i>
                                            ) : (
                                                <i className="fa-regular fa-circle-play text-xl"></i>
                                            )}
                                        </button>
                                        {(audioStatus === "paused" || audioStatus === "playing") && <button onClick={stopAudio} className="flex items-center justify-center text-red-500 rounded-lg transition bg-gray-200 hover:text-gray-700 hover:bg-gray-300 p-2 ">
                                            <i className="fa-regular fa-circle-stop text-xl"></i>
                                        </button>}
                                    </div>
                                )}
                                {storage?.show_english && message?.message && message?.message !== message?.original_message && (
                                    <>
                                        <hr className="border-gray-300 my-4" />
                                        <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]} className="markdown-render text-sm text-gray-700">
                                            {message?.original_message || ""}
                                        </ReactMarkdown>
                                    </>
                                )}
                                {storage?.show_stats && message && (
                                    <>
                                        <hr className="border-gray-300 my-4" />
                                        <Stats message={message} />
                                    </>
                                )}
                            </div>
                        )
                    }
                </div>
            </div>
            {message?.reference_documents && message?.reference_documents.length > 0 && (
                <div className="flex flex-wrap gap-2 pl-16 items-center pb-4 max-w-4xl mx-auto w-full">
                    <p className="mr-1 text-sm italic">References:</p>
                    {message?.reference_documents.map((doc, i) => {
                        if (doc.document_type === 1 || doc.document_type === 2)
                            return (
                                <a
                                    key={i}
                                    href={doc.document_type === 1 ? doc.file : doc.text_content}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-md hover:bg-gray-300"
                                >
                                    {doc.title}
                                </a>
                            );
                        else if (doc.document_type === 3)
                            return (
                                <div className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-md hover:bg-gray-300">
                                    {doc.title}
                                </div>
                            );
                        else return null;
                    })}
                </div>
            )}
        </div>
    );
}
