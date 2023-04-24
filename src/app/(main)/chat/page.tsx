"use client";
import { Input } from "@/components/ui/interactive";
import { storageAtom } from "@/store";
import { API } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Chat() {

    const [chat, setChat] = useState("");
    const router = useRouter();
    const [storage, setStorage] = useAtom(storageAtom);
    const queryClient = useQueryClient();

    const converseMutation = useMutation((external_id: string) => API.chat.converse(external_id, chat, storage.openai_api_key));

    const newChatMutation = useMutation(() => API.chat.create(chat.slice(0, 20), "7fd7d52d73e5668b225a47d5cbb021c3", storage.openai_api_key), {
        onSuccess: async (data) => {
            queryClient.invalidateQueries(["chats"]);
            await converseMutation.mutateAsync(data.external_id);
            router.push(`/chat/${data.external_id}`);

        }
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        newChatMutation.mutate();
    }

    return (
        <div className="flex flex-col h-screen">
            <div className="flex-1">

            </div>
            <div className="w-full shrink-0 p-4">
                <form onSubmit={handleSubmit}>
                    <Input
                        type="text"
                        placeholder="Chat"
                        value={chat || ""}
                        onChange={(e) => setChat(e.target.value)}
                        errors={[(newChatMutation.error as any)?.error?.error]}
                    />
                </form>
            </div>
        </div>
    )
}