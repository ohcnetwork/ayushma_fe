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

export default function Chat(params: { params: { chat_id: string } }) {

    const { chat_id } = params.params;
    const [newChat, setNewChat] = useState("");
    const [storage] = useAtom(storageAtom);

    const chatQuery = useQuery(["chat", chat_id], () => API.chat.get(chat_id));
    const chat: Chat | undefined = chatQuery.data;

    const converseMutation = useMutation(() => API.chat.converse(chat_id, newChat, !storage.user?.allow_key || storage.override_api_key ? storage.openai_api_key : undefined), {
        onSuccess: async () => {
            chatQuery.refetch();
            setNewChat("");
        }
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        converseMutation.mutate();
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
                    errors={[(converseMutation.error as any)?.error?.error]}
                    loading={converseMutation.isLoading}
                />
            </div>
        </div>
    )
}