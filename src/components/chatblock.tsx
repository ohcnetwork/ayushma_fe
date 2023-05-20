import { useState } from "react";
import { ChatMessage, ChatMessageType } from "@/types/chat";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";

type AudioStatus = "unloaded" | "loading" | "playing" | "paused" | "stopped";

export default function ChatBlock(props: { message?: ChatMessage, loading?: boolean }) {

    const { message, loading } = props;
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
    const [audioStatus, setAudioStatus] = useState<AudioStatus>("unloaded");

    const loadAudio = async () => {
        if (message?.messageType === ChatMessageType.AYUSHMA) {
            setAudioStatus("loading");
            const audio = new Audio(message?.ayushma_audio_url);
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

    return (
        <div className={`flex gap-6 p-6 ${message?.messageType === ChatMessageType.USER ? "bg-black/5" : ""}`}>
            <div>
                <div className="w-9 text-3xl shrink-0 text-center">
                    {message?.messageType === ChatMessageType.USER && !loading ? "👤" : <>
                        <Image src="/ayushma.svg" alt="Logo" width={100} height={100} />
                    </>}
                </div>
                {message?.messageType === ChatMessageType.AYUSHMA && (
                    <div className="flex gap-1 justify-center">
                        <button onClick={togglePlay} className="text-gray-500 hover:text-gray-700">
                            {audioStatus === "playing" ? (
                                <i className="fa-regular fa-circle-pause text-gray-700"></i>
                            ) : (
                                <i className="fa-regular fa-circle-play text-black"></i>
                            )}
                        </button>
                        {(audioStatus === "paused" || audioStatus === "playing") && <button onClick={stopAudio} className="text-gray-500 hover:text-gray-700">
                            <i className="fa-regular fa-circle-stop text-red-400"></i>
                        </button>}
                    </div>
                )}
            </div>
            <div>
                {loading ? "Loading..." :
                    <ReactMarkdown remarkPlugins={[remarkGfm]} className="markdown-render">
                        {message?.message || ""}
                    </ReactMarkdown>
                }
            </div>
        </div>
    )
}