"use client";

import { Chat } from "@/types/chat";
import { Project } from "@/types/project";
import { API } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function Page({
  params,
}: {
  params: { project_id: string; chat_id: string };
}) {
  const { project_id, chat_id } = params;
  const chatQuery = useQuery(["chat", project_id], () =>
    API.chat.get(project_id, chat_id)
  );

  const projectQuery = useQuery(["project", project_id], () =>
    API.projects.get(project_id)
  );
  const project: Project = projectQuery.data;

  const chats: any | undefined = chatQuery.data;

  return (
    <div>
      <h1 className="text-3xl font-bold">{project?.title}</h1>
      <h2 className="text-2xl mt-6 font-bold mb-4">Chat: {chats?.title}</h2>
      <div>
        <div className="flex flex-col gap-4 mt-8">
          {chats &&
            chats?.chats?.length > 0 ?
            chats?.chats.map((chat: any, i: number) => (
              <div key={i}>
                {chat.messageType === 1 ? (
                  <div
                    className="border border-gray-300 hover:bg-gray-100 bg-white rounded-lg p-4"
                  >
                    {chat.message}
                  </div>
                ) : (
                  <div
                    className="border border-gray-300 hover:bg-gray-100 bg-gray-200 rounded-lg p-4"
                  >
                    {chat.message}
                  </div>
                )}
              </div>
            )) : (
                <div className="flex justify-center bg-white rounded-xl p-3">No Chats Found</div>
            )}
        </div>
      </div>
    </div>
  );
}
