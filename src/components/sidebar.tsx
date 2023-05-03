"use client";

import { Chat } from "@/types/chat";
import { API } from "@/utils/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Input } from "./ui/interactive";
import { useState } from "react";
import { storageAtom } from "@/store";
import { useAtom } from "jotai";
import { usePathname, useRouter } from "next/navigation";

export default function SideBar(props: {
    project_id?: string;
}) {

    const { project_id } = props;

    const chatsQuery = useQuery(["chats"], () => API.chat.list(project_id || ""), { enabled: !!project_id });
    const [storage, setStorage] = useAtom(storageAtom);
    const router = useRouter();
    const path = usePathname();

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
        ...(storage?.user?.is_staff ? [{
            icon: "user-shield",
            text: "Admin",
            onclick: () => {
                router.push("/admin");
            }
        }] : []),
        {
            icon: "sign-out-alt",
            text: "Logout",
            onclick: () => setStorage({ ...storage, user: undefined, auth_token: undefined })
        }
    ]

    const deleteChatMutation = useMutation((external_id: string) => API.chat.delete(project_id || "", external_id), {
        onSuccess: async (data, external_id) => {
            chatsQuery.refetch();
            if (path === `/project/${project_id}/chat/${external_id}`) router.push(`/project/${project_id}`);
        },
    });

    const deleteChat = (external_id: string) => {
        if (!confirm("Are you sure you want to delete this chat?")) return;
        deleteChatMutation.mutate(external_id);
    }

    return (
        <div className="bg-white bg-cover bg-top w-64 shrink-0 flex flex-col justify-between border-r border-gray-300 h-screen">
            <div className="flex flex-col p-2 gap-2">
                <div className="h-6 flex gap-2 items-center my-4 justify-center">
                    <img src="/ayushma_text.svg" alt="Logo" className="h-full" />
                    <div className="text-xs">
                        Beta
                    </div>
                </div>
                <Link href={project_id ? `/project/${project_id}` : "/"} className="border-gray-300 py-2 px-4 rounded-lg border-dashed border-2 hover:bg-gray-100 text-center">
                    <i className="far fa-plus" />&nbsp; New Chat
                </Link>
                {project_id && chatsQuery.isLoading && (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                        Loading Chats...
                    </div>
                )}
                {project_id && chatsQuery.data?.results.map((chat: Chat) => (
                    <div key={chat.external_id} className="w-full group hover:bg-gray-100 border border-gray-200 rounded-lg overflow-hidden flex items-stretch justify-between">
                        <Link
                            href={`project/${project_id}/chat/${chat.external_id}`}
                            className="w-full py-2 px-4 text-left truncate"
                            title={chat.title}
                        >
                            {chat.title}
                        </Link>
                        <button
                            className="py-2 px-2 hidden group-hover:block"
                            onClick={() => deleteChat(chat.external_id)}
                        >
                            <i className="fal fa-trash-alt" />
                        </button>
                    </div>
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