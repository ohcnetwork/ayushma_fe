"use client";
import ChatBar from "@/components/chatbar";
import Petals from "@/components/petals";
import { storageAtom } from "@/store";
import { API } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Chat(params: { params: { project_id: string } }) {

    const { project_id } = params.params;

    const [chat, setChat] = useState("");
    const router = useRouter();
    const [storage, setStorage] = useAtom(storageAtom);
    const queryClient = useQueryClient();

    const converseMutation = useMutation((external_id: string) => API.chat.converse(project_id, external_id, chat, !storage.user?.allow_key || storage.override_api_key ? storage.openai_api_key : undefined));

    const newChatMutation = useMutation(() => API.chat.create(project_id, chat.slice(0, 50), storage.openai_api_key), {
        onSuccess: async (data) => {
            queryClient.invalidateQueries(["chats"]);
            await converseMutation.mutateAsync(data.external_id);
            router.push(`/project/${project_id}/chat/${data.external_id}`);
        }
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        newChatMutation.mutate();
    }

    const samplePrompts = [
        "How does one prepare for advanced airway management, even before the patient has arrived?",
        "How do you assess a ICU patient's need for tracheal intubation?",
        "What are the checks one needs to perform before intubation?",
        "How do you do the initial assessment of the patient before oxygenation or ventilation?",
    ]

    return (
        <div className="flex flex-col h-screen flex-1">
            <Petals state={{ state: "idle" }} />
            <div className="w-full shrink-0 p-4">
                <ChatBar
                    chat={chat}
                    onChange={(e) => setChat(e.target.value)}
                    onSubmit={handleSubmit}
                    errors={[(newChatMutation.error as any)?.error?.error]}
                    loading={newChatMutation.isLoading || converseMutation.isLoading}
                />
            </div>
        </div>
    )
}