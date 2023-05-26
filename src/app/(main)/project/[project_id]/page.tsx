"use client";
import ChatBar from "@/components/chatbar";
import ChatBlock from "@/components/chatblock";
import { storageAtom } from "@/store";
import { ChatConverseStream, ChatMessageType } from "@/types/chat";
import { API } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Chat(params: { params: { project_id: string } }) {

    const { project_id } = params.params;

    const [chat, setChat] = useState("");
    const router = useRouter();
    const [storage, setStorage] = useAtom(storageAtom);
    const queryClient = useQueryClient();
    const [chatMessage, setChatMessage] = useState<string>("");
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const [chatID, setChatID] = useState<string>("");
    const [language, setLanguage] = useState<string>("en");

    const openai_key = !storage?.user?.allow_key || storage?.override_api_key ? storage?.openai_api_key : undefined

    useEffect(() => {
        if (!isTyping && chatID) router.push(`/project/${project_id}/chat/${chatID}?autoplay`);
    }, [chatID, isTyping, project_id, router]);

    const streamChatMessage = async (message: ChatConverseStream) => {
        if (chat === "") setChat(message.input);
        setChatMessage(prevChatMessage => {
            const updatedChatMessage = prevChatMessage + message.delta;
            return updatedChatMessage;
        });
        if (message.stop) setIsTyping(false);
    };

    const converseMutation = useMutation((external_id: string) => API.chat.converse(project_id, external_id, chat, language, !storage.user?.allow_key || storage.override_api_key ? storage.openai_api_key : undefined, streamChatMessage, 20), {
        retry: false
    });

    const newChatMutation = useMutation((params: { type?: string, formdata?: FormData }) => API.chat.create(project_id, chat !== "" ? chat.slice(0, 50) : "new chat", storage.openai_api_key), {
        onSuccess: async (data, vars) => {
            queryClient.invalidateQueries(["chats"]);
            if (vars.type === "audio" && vars.formdata) {
                await audioConverseMutation.mutateAsync({ external_id: data.external_id, formdata: vars.formdata });
            } else {
                await converseMutation.mutateAsync(data.external_id);
            }
            setChatID(data.external_id);
        }
    })

    const audioConverseMutation = useMutation((params: { external_id: string, formdata: FormData }) => API.chat.audio_converse(project_id, params.external_id, params.formdata, openai_key, streamChatMessage, 20), {
        retry: false,
        onSuccess: async (data, vars) => {
            queryClient.invalidateQueries(["chats"]);
        }
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        setIsTyping(true);
        e.preventDefault();
        newChatMutation.mutate({});
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
        fd.append("language", language);
        await newChatMutation.mutateAsync({ type: "audio", formdata: fd });
    }

    const samplePrompts = [
        "How does one prepare for advanced airway management, even before the patient has arrived?",
        "How do you assess a ICU patient's need for tracheal intubation?",
        "What are the checks one needs to perform before intubation?",
        "How do you do the initial assessment of the patient before oxygenation or ventilation?",
    ]

    return (
        <div className="flex flex-col h-screen flex-1">
            <div className="flex-1 items-center justify-center w-full overflow-auto">
                {!chatMessage ? (<div className="text-center text-gray-500 w-full">
                    <h1 className="font-black text-4xl text-gray-600 mt-8">
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
                                    newChatMutation.mutate({});
                                }}
                                className="bg-white border border-gray-200 rounded-xl p-4 w-64"
                                key={i}
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>
                </div>) : (
                    <>
                        <ChatBlock message={{ messageType: ChatMessageType.USER, message: chat, original_message: chat, language, created_at: "", external_id: "", modified_at: "" }} />
                        <ChatBlock cursor={true} message={{ messageType: ChatMessageType.AYUSHMA, message: chatMessage, original_message: chatMessage, language, created_at: "", external_id: "", modified_at: "" }} />
                    </>)}
            </div>
            <div className="w-full shrink-0 p-4">
                <ChatBar
                    chat={chat}
                    onChange={(e) => setChat(e.target.value)}
                    onSubmit={handleSubmit}
                    onAudio={handleAudio}
                    onLangSet={(language) => setLanguage(language)}
                    errors={[(newChatMutation.error as any)?.error?.error]}
                    loading={newChatMutation.isLoading || converseMutation.isLoading || audioConverseMutation.isLoading || isTyping}
                />
            </div>
        </div>
    )
}