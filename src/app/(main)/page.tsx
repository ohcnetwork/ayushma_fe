"use client";
import ChatBar from "@/components/chatbar";
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

    const converseMutation = useMutation((external_id: string) => API.chat.converse(external_id, chat, !storage.user?.allow_key || storage.override_api_key ? storage.openai_api_key : undefined));

    const newChatMutation = useMutation(() => API.chat.create(chat.slice(0, 50), "7fd7d52d73e5668b225a47d5cbb021c3", storage.openai_api_key), {
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

    const samplePrompts = [
        "How does one prepare for advanced airway management, even before the patient has arrived?",
        "How do you assess a ICU patient’s need for tracheal intubation?",
        "What are the checks one needs to perform before intubation?",
        "How do you do the initial assessment of the patient before oxygenation or ventilation?",
    ]

    return (
        <div className="flex flex-col h-screen">
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-gray-500">
                    <h1 className="font-black text-4xl text-gray-600">
                        Ayushma
                    </h1>
                    <p>
                        Your personal AI medical assistant
                    </p>
                    <h2 className="font-semibold mt-8">
                        Try asking me -
                    </h2>
                    <div className="inline-flex mt-4 flex-wrap justify-center gap-4 w-1/2">
                        {samplePrompts.map((prompt, i) => (
                            <button
                                onClick={() => {
                                    setChat(prompt)
                                    newChatMutation.mutate();
                                }}
                                className="bg-white border border-gray-200 rounded-xl p-4 w-64"
                                key={i}
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
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