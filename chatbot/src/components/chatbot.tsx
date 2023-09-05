import React, { useEffect, useState } from 'react';
import "../index.css";
import { Chat, ChatConverseStream } from '../types';
import { twMerge } from 'tailwind-merge';
import ChatBar from './chatbar';
import { API } from '../api';
import { getFormData } from '../utils';
import { useAtom } from 'jotai';
import { authTokenAtom } from '../store';
import { AyushmaProps } from '../main';
import Landing from './landing';
import ChatMain from './chatmain';

export default function Chatbot(props: AyushmaProps) {

    const [show, setShow] = useState(false);

    const { presetQuestions, projectID, authToken, api_url } = props;
    const [value, setValue] = useState("");
    const [chatMessage, setChatMessage] = useState<string>("");
    const [chat, setChat] = useState<Chat | undefined>(undefined);
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const [auth, setAuth] = useAtom(authTokenAtom);
    const [apiUrl, setApiUrl] = useState<string>(api_url || "https://ayushma.ohc.network/api/");

    const createChat = async (value: string) => {
        const chat: Chat = await API.chat.create(projectID, "New Chat");
        await getChat(chat.external_id);
        await converse(value, chat.external_id);
    }

    const converse = async (value: string, chatID: string) => {
        const fd = await getFormData(value);
        await API.chat.converse(projectID, chatID, fd, undefined, chat, streamChatMessage, 20);
    }

    const getChat = async (chatID: string) => {
        const chat = await API.chat.get(projectID, chatID);
        setChat(chat);
    }

    const streamChatMessage = async (message: ChatConverseStream, chat: Chat) => {
        if (value === "") setValue(message.input);
        setChatMessage(prevChatMessage => {
            const updatedChatMessage = prevChatMessage + message.delta;
            return updatedChatMessage;
        });
        if (message.stop) {
            console.log(chat);
            await getChat(chat?.external_id || "");
            setLoading(false);
            setValue("");
            setIsTyping(false);
            setChatMessage("");
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        if (!chat) {
            await createChat(value);
        } else {
            await converse(value, chat.external_id);
        }
    }

    useEffect(() => {
        authToken && setAuth(authToken);
    }, [authToken])

    useEffect(() => {
        auth && localStorage.setItem("ayushma-chatbot-token", auth);
    }, [auth])

    useEffect(() => {
        api_url && setApiUrl(api_url);
    }, [api_url])

    useEffect(() => {
        apiUrl && localStorage.setItem("ayushma-chatbot-api-url", apiUrl);
    }, [apiUrl])

    return (
        <div className={twMerge(`fixed bottom-10 right-10`)}>
            <button className={twMerge(`h-12 w-12 rounded-full flex items-center justify-center cursor-pointer text-white`)} onClick={() => setShow(!show)}>
                <img src="https://ayushma.ohc.network/logo.svg" alt="Ayushma" />
            </button>
            <div className={`bg-gray-100 w-[300px] h-[400px] bottom-14 transition-all absolute shadow rounded-lg right-0 overflow-hidden flex items-center flex-col justify-between ${show ? "visible opacity-100 translate-y-0" : "invisible opacity-0 translate-y-5"}`}>
                {chat ? (
                    <>
                        <div className='bg-white p-2 w-full border-b border-b-gray-200'>
                            <button
                                onClick={() => {
                                    setChat(undefined);
                                }}
                            >
                                ➕
                            </button>
                        </div>

                        <ChatMain
                            projectID={projectID}
                            chat={chat}
                            streamingMessage={chatMessage}
                            isTyping={isTyping}
                            chatMessage={value}
                        />
                    </>
                ) : (
                    <div className='bg-white h-full overflow-hidden'>
                        <Landing
                            presetQuestions={presetQuestions || []}
                            createChat={createChat}
                        />
                    </div>
                )}
                <div className='p-2 w-full bg-white border-t border-gray-200'>
                    <ChatBar
                        value={value}
                        onChange={(value) => setValue(value)}
                        onSubmit={handleSubmit}
                        placeholder='Type your message here...'
                        loading={loading}
                    />
                </div>
            </div>
        </div >
    )
}