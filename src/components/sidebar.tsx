"use client";

import { Chat } from "@/types/chat";
import { API } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Input } from "./ui/interactive";
import { useState } from "react";
import { storageAtom } from "@/store";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";

export default function SideBar() {
    const chatsQuery = useQuery(["chats"], () => API.chat.list());
    const [storage, setStorage] = useAtom(storageAtom);
    const router = useRouter();

    const buttons = [
        {
            icon: "user-circle",
            text: "Profile",
            onclick: () => { }
        },
        {
            icon: "cog",
            text: "Settings",
            onclick: () => {
                router.push("/settings");
            }
        },
        {
            icon: "sign-out-alt",
            text: "Logout",
            onclick: () => setStorage({ ...storage, user: undefined, auth_token: undefined })
        }
    ]

    return (
        <div className="bg-[url('/bg.png')] bg-cover bg-top backdrop-blur w-64 shrink-0 flex flex-col justify-between border-r border-gray-300">
            <div className="flex flex-col p-2 gap-2">
                <Link href="/chat" className="border-gray-300 py-2 px-4 rounded-lg border-dashed border-2 hover:bg-gray-100 text-center">
                    <i className="far fa-plus" />&nbsp; New Chat
                </Link>
                {chatsQuery.isLoading && (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                        Loading...
                    </div>
                )}
                {chatsQuery.data?.results.map((chat: Chat) => (
                    <Link key={chat.external_id} href={`/chat/${chat.external_id}`} className="w-full hover:bg-gray-100 border border-gray-200 rounded-lg py-2 px-4 text-left">
                        {chat.title}
                    </Link>
                ))}
            </div>
            <div className="p-2">
                <div className="flex gap-2">
                    {buttons.map((button, i) => (
                        <button key={i} onClick={button.onclick} className="flex-1 py-2 px-4 border flex flex-col rounded-lg items-center text-lg justify-center hover:bg-gray-100 border-gray-200">
                            <i className={`fal fa-${button.icon}`} />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}