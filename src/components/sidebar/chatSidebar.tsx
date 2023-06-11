import { Chat } from "@/types/chat";
import { API } from "@/utils/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const ChatSideBar = (props: { project_id?: string }) => {
  const { project_id } = props;
  const path = usePathname();
  const router = useRouter();

  const chatsQuery = useQuery(
    ["chats"],
    () => API.chat.list(project_id || ""),
    { enabled: !!project_id }
  );

  const deleteChatMutation = useMutation(
    (external_id: string) => API.chat.delete(project_id || "", external_id),
    {
      onSuccess: async (data, external_id) => {
        chatsQuery.refetch();
        if (path === `/project/${project_id}/chat/${external_id}`)
          router.push(`/project/${project_id}`);
      },
    }
  );

  const deleteChat = (external_id: string) => {
    if (!confirm("Are you sure you want to delete this chat?")) return;
    deleteChatMutation.mutate(external_id);
  };

  return (
    <>
      <Link
        href={project_id ? `/project/${project_id}` : "/"}
        className="border-gray-300 py-2 px-4 rounded-lg border-dashed border-2 hover:bg-gray-100 text-center"
      >
        <i className="far fa-plus" />
        &nbsp; New Chat
      </Link>
      {project_id && chatsQuery.isLoading && (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Loading Chats...
        </div>
      )}
      {project_id &&
        chatsQuery.data?.results.map((chat: Chat) => (
          <div
            key={chat.external_id}
            className="w-full group hover:bg-gray-100 border border-gray-200 rounded-lg overflow-hidden flex items-stretch justify-between"
          >
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
    </>
  );
};

export default ChatSideBar;
