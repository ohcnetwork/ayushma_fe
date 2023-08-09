import React, { useEffect, useState } from 'react';
import "../index.css";
import { Chat, ChatConverseStream, ChatbotProps } from '../types';
import { twMerge } from 'tailwind-merge';
import ChatBar from './chatbar';
import { API } from '../api';
import { getFormData } from '../utils';
import { useAtom } from 'jotai';
import { authTokenAtom } from '../store';

export default function Chatbot(props: ChatbotProps) {

    const [show, setShow] = useState(false);

    const { containerClass, buttonClass, chatboxClass, presetQuestions, projectID, authToken } = props;
    const [value, setValue] = useState("");
    const [chatMessage, setChatMessage] = useState<string>("");

    const [currentChat, setCurrentChat] = useState("");
    const [isTyping, setIsTyping] = useState<boolean>(false);

    const [auth, setAuth] = useAtom(authTokenAtom);

    const createChat = async (value: string) => {
        const chat: Chat = await API.chat.create(projectID, "New Chat");
        setCurrentChat(chat.external_id);
        converse(value);
    }

    const converse = async (value: string) => {
        const fd = await getFormData(value);
        const conv = await API.chat.converse(projectID, currentChat, fd, undefined, streamChatMessage, 20);

    }


    const streamChatMessage = async (message: ChatConverseStream) => {
        if (value === "") setValue(message.input);
        setChatMessage(prevChatMessage => {
            const updatedChatMessage = prevChatMessage + message.delta;
            return updatedChatMessage;
        });
        if (message.stop) {
            //await chatQuery.refetch();
            setValue("");
            setIsTyping(false);
            setChatMessage("");
        }
    };

    useEffect(() => {
        authToken && setAuth(authToken);
    }, [authToken])

    return (
        <div className={twMerge(`fixed bottom-10 right-10`, containerClass)}>
            <button className={twMerge(`h-12 w-12 rounded-full flex items-center justify-center cursor-pointer text-white`, buttonClass)} onClick={() => setShow(!show)}>
                <img src="https://ayushma.ohc.network/ayushma.svg" alt="Ayushma" />
            </button>
            <div className={`bg-white w-[300px] h-[400px] bottom-14 transition-all absolute shadow rounded-lg right-0 overflow-hidden flex items-center flex-col justify-between ${show ? "visible opacity-100 translate-y-0" : "invisible opacity-0 translate-y-5"}`}>
                <div>
                    <div className={`p-4 flex items-center justify-center font-black text-xl gap-2`}>
                        <div className='w-10'>
                            <img src="https://ayushma.ohc.network/ayushma.svg" alt="Ayushma" className='w-full' />
                        </div>
                        Ayushma
                    </div>
                    <div className='p-4 pt-0 text-sm'>
                        <p>
                            Hey! I am Ayushma, your digital personal health assistant. I can help you with queries regarding patient health and ICU protocols.
                        </p>
                        <br />
                        {presetQuestions && (
                            <div className='flex flex-col gap-4'>
                                {presetQuestions.map((question, index) => (
                                    <button
                                        key={index}
                                        className='rounded border border-green-600 text-green-600 p-2 px-4 block w-full hover:bg-green-600 hover:text-white'
                                        onClick={() => createChat(question)}
                                    >
                                        {question}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    {chatMessage}
                </div>
                <div className='p-2 w-full'>
                    <ChatBar
                        value={value}
                        onChange={(value) => setValue(value)}
                        onSubmit={() => {
                            if (!currentChat) {
                                createChat(value);
                            }
                        }}
                        placeholder='Type your message here...'
                    />
                </div>
            </div>
        </div >
    )
}