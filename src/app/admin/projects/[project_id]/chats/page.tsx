"use client";

import { Chat } from "@/types/chat";
import { Project } from "@/types/project";
import { API } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function Page({ params }: { params: { project_id: string } }) {
  const { project_id } = params;
  const chatsQuery = useQuery(["chat", project_id], () =>
    API.chat.chats(project_id)
  );
  const projectQuery = useQuery(["project", project_id], () =>
    API.projects.get(project_id)
  );
  const project: Project = projectQuery.data;

  const chats: Chat[] | undefined = chatsQuery.data?.results;

  return (
    <div>
      <h1 className="text-3xl font-bold">{project?.title}</h1>
      <h2 className="text-2xl mt-6 font-bold mb-4">Chats</h2>
      <div>
        {chats && chats.length > 0 ? (
          <div className="grid md:grid-cols-4 gap-4 mt-8">
            {chats.map((chat: Chat, i: number) => (
              <Link
                href={`/admin/projects/${project_id}/chats/${chat.external_id}`}
                key={i}
                className="border border-gray-300 hover:bg-gray-100 bg-white rounded-lg p-4"
              >
                {chat.title}
                <div className="text-sm flex gap-2 items-center mt-2 text-gray-600">
                  <i className="fa fa-user"></i>
                  {chat?.username}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex justify-center bg-white rounded-xl p-3">
            No Chats Found
          </div>
        )}
      </div>
    </div>
  );
}
