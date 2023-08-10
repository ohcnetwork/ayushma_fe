"use client";

import { useEffect } from "react"
import Chatbot from "../../../chatbot/src/components/chatbot"
import { API } from "@/utils/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { storageAtom } from "@/store";

export default function Page() {

    const [storage, setStorage] = useAtom(storageAtom);

    const temptokenMutation = useMutation(() => API.chatbot.token(), {
        onSuccess: (data) => {
            setStorage((prev) => ({
                ...prev,
                chatbot_token: data.token,
            }));
        }
    });

    useEffect(() => {
        if (storage && !storage.chatbot_token) {
            temptokenMutation.mutate();
        }
    }, [storage?.chatbot_token]);

    return (
        <div>
            <div>
                Token : {storage?.chatbot_token}
            </div>
            <button
                onClick={() => {
                    temptokenMutation.mutate();
                }}
            >
                Reset token
            </button>
            {storage?.chatbot_token && (
                <Chatbot
                    projectID="6b164e5b-1cc3-4512-a504-4c333a74d1cd"
                    authToken={storage.chatbot_token}
                    api_url={process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/"}
                    presetQuestions={[
                        "What is the patient's age?",
                        "What is your name?"
                    ]}
                />
            )}
        </div>
    )
}