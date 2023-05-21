"use client";

import ChatBar from "@/components/chatbar";
import ChatBlock from "@/components/chatblock";
import { storageAtom } from "@/store";
import { Chat, ChatConverseStream, ChatMessageType } from "@/types/chat";
import { API } from "@/utils/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Chat(params: { params: { project_id: string, chat_id: string } }) {

    const { project_id, chat_id } = params.params;
    const searchParams = useSearchParams();
    const [newChat, setNewChat] = useState("");
    const [chatMessage, setChatMessage] = useState<string>("");
    const [storage] = useAtom(storageAtom);
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const [language, setLanguage] = useState<string>("en");

    const chatQuery = useQuery(["chat", chat_id], () => API.chat.get(project_id, chat_id));
    const chat: Chat | undefined = chatQuery.data;

    const openai_key = !storage?.user?.allow_key || storage?.override_api_key ? storage?.openai_api_key : undefined
    const shouldAutoPlay = searchParams?.get("autoplay") !== null;

    useEffect(() => {
        const uri = window.location.toString();
        if (uri.indexOf("?") > 0) window.history.replaceState({}, document.title, uri.substring(0, uri.indexOf("?")));
    }, [])

    const streamChatMessage = async (message: ChatConverseStream) => {
        if (newChat === "") setNewChat(message.input);
        setChatMessage(prevChatMessage => {
            const updatedChatMessage = prevChatMessage + message.delta;
            return updatedChatMessage;
        });
        if (message.stop) setIsTyping(false);
    };

    const converseMutation = useMutation(() => API.chat.converse(project_id, chat_id, newChat, language, openai_key, streamChatMessage), {
        onSuccess: async () => {
            await chatQuery.refetch();
            setNewChat("");
            setChatMessage("");
        },
        retry: false
    });

    const audioConverseMutation = useMutation((params: { formdata: FormData }) => API.chat.audio_converse(project_id, chat_id, params.formdata, openai_key, streamChatMessage, 20), {
        onSuccess: async () => {
            await chatQuery.refetch();
            setNewChat("");
            setChatMessage("");
        },
        retry: false
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        setIsTyping(true);
        e.preventDefault();
        converseMutation.mutate();
    }

    const handleAudio = async (blobUrl: string) => {
        setIsTyping(true);
        const fd = new FormData();
        //create a file object from blob url
        await fetch(blobUrl)
            .then(res => res.blob())
            .then(blob => {
                const file = new File([blob], "audio.wav", { type: "audio/wav" });
                fd.append("audio", file);
            })
        audioConverseMutation.mutate({ formdata: fd });
    }

    const messagesContainerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (messagesContainerRef.current) {
            const container = messagesContainerRef.current;
            container.scrollTop = container.scrollHeight;
        }
    }, [chatMessage]);

    return (
        <div className="h-screen flex flex-col flex-1">
            <div className="flex-1 overflow-auto" ref={ messagesContainerRef }>
                { chat?.chats?.map((message, i) => (
                    <ChatBlock message={ message } key={ message.external_id } autoplay={ !!chatMessage && (i === (chat?.chats?.length || 0) - 1) } />
                )) }
                { chatMessage && (
                    <>
                        <ChatBlock message={ { messageType: ChatMessageType.USER, message: newChat, original_message: newChat, language, created_at: "", external_id: "", modified_at: "" } } />
                        <ChatBlock cursor={ true } message={ { messageType: ChatMessageType.AYUSHMA, message: chatMessage, original_message: chatMessage, language, created_at: "", external_id: "", modified_at: "" } } />
                    </>
                )
                }
            </div >
            <div className="w-full shrink-0 p-4">
                <ChatBar
                    chat={ newChat || "" }
                    onChange={ (e) => setNewChat(e.target.value) }
                    onSubmit={ handleSubmit }
                    onAudio={ handleAudio }
                    language={ language }
                    onLangSet={ (lang) => {
                        setLanguage(lang);
                    } }
                    errors={ [
                        (converseMutation.error as any)?.error?.error,
                        (audioConverseMutation.error as any)?.error?.error
                    ] }
                    loading={ converseMutation.isLoading || audioConverseMutation.isLoading || isTyping }
                />
            </div>
        </div >
    )
}