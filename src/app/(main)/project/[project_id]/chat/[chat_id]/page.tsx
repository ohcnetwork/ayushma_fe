"use client";

import ChatBar from "@/components/chatbar";
import ChatBlock from "@/components/chatblock";
import { Input } from "@/components/ui/interactive";
import { storageAtom } from "@/store";
import { Chat } from "@/types/chat";
import { API } from "@/utils/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useState } from "react";

export default function Chat(params: { params: { project_id: string, chat_id: string } }) {

    const { project_id, chat_id } = params.params;
    const [newChat, setNewChat] = useState("");
    const [storage] = useAtom(storageAtom);

    const chatQuery = useQuery(["chat", chat_id], () => API.chat.get(project_id, chat_id));
    const chat: Chat | undefined = chatQuery.data;

    const openai_key = !storage?.user?.allow_key || storage?.override_api_key ? storage?.openai_api_key : undefined

    const converseMutation = useMutation(() => API.chat.converse(project_id, chat_id, newChat, openai_key), {
        onSuccess: async () => {
            chatQuery.refetch();
            setNewChat("");
        }
    });

    const audioConverseMutation = useMutation((params: { formdata: FormData }) => API.chat.audio_converse(project_id, chat_id, params.formdata, openai_key), {
        onSuccess: async () => {
            chatQuery.refetch();
        }
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        converseMutation.mutate();
    }

    const handleAudio = async (blobUrl: string) => {
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

    return (
        <div className="h-screen flex flex-col flex-1">
            <div className="flex-1 overflow-auto">
                {chat?.chats?.map((message, i) => (
                    <ChatBlock message={message} key={i} />
                ))}
                {converseMutation.isLoading && (
                    <ChatBlock loading />
                )}
            </div>
            <div className="w-full shrink-0 p-4">
                <ChatBar
                    chat={newChat || ""}
                    onChange={(e) => setNewChat(e.target.value)}
                    onSubmit={handleSubmit}
                    onAudio={handleAudio}
                    errors={[
                        (converseMutation.error as any)?.error?.error,
                        (audioConverseMutation.error as any)?.error?.error
                    ]}
                    loading={converseMutation.isLoading || audioConverseMutation.isLoading}
                />
            </div>
        </div>
    )
}