"use client";

import Table from "@/components/table/Table";
import { Input } from "@/components/ui/interactive";
import { Project } from "@/types/project";
import { API } from "@/utils/api";
import { useInfiQuery } from "@/utils/hooks/useInfiQuery";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";

export default function Page({ params }: { params: { project_id: string } }) {
  const { project_id } = params;
  const limit = 10;
  const [search, setSearch] = useState("");
  const chatsListQuery = useInfiQuery(["chat", project_id], ({ pageParam = 1 }) => {
    const offset = (pageParam - 1) * limit;
    return API.chat.chats(project_id, search, limit, offset);
  });
  const projectQuery = useQuery(["project", project_id], () =>
    API.projects.get(project_id)
  );
  const project: Project = projectQuery.data;
  const chatsList: any[] = chatsListQuery.data?.pages || [];
  const columns: string[] = ["Title", "User", ""];

  useEffect(() => {chatsListQuery.refetch()}, [search])

  const chatTableBody = () => {
    if (chatsList.length > 0 && chatsList[0].count !== 0) {
      return (
        <tbody className="bg-white divide-y divide-gray-200 text-gray-700">
          {chatsList.map((chats) => {
            return chats.results.map((chat: any, index: number) => {
              return (
                <tr key={index} className="m-2">
                  <td className="px-6 py-2 ">{chat.title}</td>
                  <td className="px-6 py-2 ">{chat?.username}</td>
                  <td className="px-6 py-2 text-right">
                    <Link
                      href={`/admin/projects/${project_id}/chats/${chat.external_id}`}
                      className="font-medium text-green-600 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              );
            });
          })}
        </tbody>
      );
    } else {
      return (
        <tbody className="bg-white divide-y divide-gray-200 text-sm text-gray-700">
          <tr className="bg-white border-b border-x hover:bg-gray-50 w-full">
            <td colSpan={100} className="p-4 text-center text-gray-400">
              No chatsList found
            </td>
          </tr>
        </tbody>
      );
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">{project?.title}</h1>
      <h2 className="text-2xl mt-6 font-bold mb-4">chatsList</h2>
      <div className="w-fit">
        <Input
          type="text"
          placeholder="Search for chat"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="placeholder-gray-400"
        />
      </div>
      <div className="mt-4">
        <InfiniteScroll
          loadMore={() => {
            chatsListQuery.fetchNextPage();
          }}
          hasMore={chatsListQuery.hasNextPage ? true : false}
          useWindow={false}
        >
          <Table columns={columns} body={chatTableBody} />
        </InfiniteScroll>
      </div>
    </div>
  );
}
