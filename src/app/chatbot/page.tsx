"use client";

import Chatbot from "@/chatbot";

export default function Page() {

    return (
        <div>
            <Chatbot
                projectID="c1b1b0a0-5b0a-11eb-8e6f-2f9f5b7a1a1a"
                presetQuestions={[
                    "What is your name?",
                    "What is your age?",
                ]}
                api_url="http://localhost:8000/api/"
            />
        </div>
    )
}