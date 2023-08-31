"use client";

import { Chat } from "@/types/chat";
import { API } from "@/utils/api";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { CheckBox, Input } from "../ui/interactive";
import { useState, useEffect } from "react";
import { storageAtom } from "@/store";
import { useAtom } from "jotai";
import { usePathname, useRouter } from "next/navigation";
import Modal from "../modal";
import Slider from "../ui/slider";
import InfiniteScroll from "react-infinite-scroller";
import { useInfiQuery } from "@/utils/hooks/useInfiQuery";
import { useDebounce } from "@/utils/hooks/useDebounce";

export default function ChatSideBar(props: { project_id?: string }) {
  const { project_id } = props;
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 1000);
  const LIMIT = 10;
  const chatsQuery = useInfiQuery(
    ["search", debouncedSearchQuery],
    ({ pageParam = 1 }) => {
      const offset = (pageParam - 1) * LIMIT;
      return API.chat.list(
        project_id || "",
        LIMIT,
        offset,
        debouncedSearchQuery
      );
    },
    {
      enabled: !!project_id,
    }
  );

  const [storage, setStorage] = useAtom(storageAtom);
  const router = useRouter();
  const path = usePathname();
  const [settingsModal, setSettingsModal] = useState(false);

  const onSettingsClose = () => {
    setSettingsModal(false);
  };

  const buttons = [
    {
      icon: "user-circle",
      text: "Profile",
      onclick: () => {
        router.push("/profile");
      },
    },
    {
      icon: "cog",
      text: "Settings",
      onclick: () => {
        setSettingsModal(true);
      },
    },
    ...(storage?.user?.is_staff
      ? [
        {
          icon: "user-shield",
          text: "Admin",
          onclick: () => {
            router.push("/admin");
          },
        },
      ]
      : []),
    {
      icon: "sign-out-alt",
      text: "Logout",
      onclick: () =>
        setStorage({ ...storage, user: undefined, auth_token: undefined }),
    },
  ];

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
      <div className="bg-white bg-cover bg-top w-72 shrink-0 flex flex-col border-r border-gray-300 h-screen justify-between">
        <div className="flex flex-col flex-1 overflow-auto">
          <div className="flex flex-col p-3 gap-2">
            <Link
              href={project_id ? `/project/${project_id}` : "/"}
              className="cursor-pointer p-3"
            >
              <div className="flex gap-2 items-center justify-center relative">
                <img src="/logo_text.svg" alt="Logo" className="w-full h-full object-contain" />
                <div className="text-xs absolute right-1 text-gray-600 bottom-0">Beta</div>
              </div>
            </Link>
            <Link
              href={project_id ? `/project/${project_id}` : "/"}
              className="border-gray-300 py-2 px-4 rounded-lg border-dashed border-2 hover:bg-gray-100 text-center"
            >
              <i className="far fa-plus" />
              &nbsp; New Chat
            </Link>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              className="border-gray-300 py-2 px-4 rounded-lg border-2 hover:bg-gray-100"
            />
          </div>
          <div id="scrollableDiv" className="overflow-y-auto px-2">
            <InfiniteScroll
              loadMore={() => {
                chatsQuery.fetchNextPage();
              }}
              hasMore={chatsQuery.hasNextPage ? true : false}
              useWindow={false}
              threshold={10}
              loader={
                <div className={`${chatsQuery.isFetching ? "" : "hidden"} flex justify-center items-center mt-2 h-full`}>
                  <div
                    className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                    role="status"
                  >
                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                      Loading...
                    </span>
                  </div>
                </div>
              }
            >
              {project_id ? (
                chatsQuery.data?.pages.map((group, index) => (
                  <div key={index} className="flex flex-col gap-2">
                    {group.results.map((chat: Chat) => (
                      <div
                        key={chat.external_id}
                        className="w-full group hover:bg-gray-100 rounded-lg overflow-hidden flex gap-2 justify-between"
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
                  </div>
                ))):(<></>)}
            </InfiniteScroll>
          </div>
        </div>
        <div className="p-2 flex justify-around">
          <div className="flex flex-1 gap-2">
            {buttons.map((button, i) => (
              <button
                key={i}
                onClick={button.onclick}
                className="flex-1 py-2 px-4 border flex flex-col rounded-lg items-center text-lg justify-center hover:bg-gray-100 border-gray-200"
              >
                <i className={`fal fa-${button.icon}`} />
              </button>
            ))}
          </div>
        </div>
      </div>
      <Modal onClose={onSettingsClose} show={settingsModal}>
        <div>
          Your OpenAI API key
          <Input
            type="text"
            placeholder="OpenAI key"
            value={storage?.openai_api_key}
            onChange={(e) =>
              setStorage({
                ...storage,
                openai_api_key: e.target.value,
              })
            }
          />
          <br />
          <br />
          {storage?.user?.allow_key && (
            <div>
              <CheckBox
                label="Override key"
                type="checkbox"
                checked={storage?.override_api_key}
                onChange={(e) =>
                  setStorage({
                    ...storage,
                    override_api_key: e.target.checked,
                  })
                }
              />
              {storage?.override_api_key && (
                <p className="text-gray-700 text-xs">
                  Your key will be used instead of Ayushma&apos;s Key
                </p>
              )}
            </div>
          )}
          <br />
          <CheckBox
            label="Show stats for nerds"
            type="checkbox"
            checked={storage?.show_stats}
            onChange={(e) =>
              setStorage({
                ...storage,
                show_stats: e.target.checked,
              })
            }
          />
          <br />
          <CheckBox
            label="Show Original English Responses"
            type="checkbox"
            checked={storage?.show_english}
            onChange={(e) =>
              setStorage({
                ...storage,
                show_english: e.target.checked,
              })
            }
          />
          <br />
          <br />
          Chat Temperature
          <br />
          <Slider
            left="More Factual"
            right="More Creative"
            value={storage?.temperature || 0.1}
            step={0.1}
            max={1}
            onChange={(val) =>
              setStorage({
                ...storage,
                temperature: val,
              })
            }
          />
          <br />
          <br />
          References
          <br />
          <Slider
            left="Short and Crisp"
            right="Long and Detailed"
            value={storage?.top_k || 100}
            step={1}
            max={100}
            onChange={(val) =>
              setStorage({
                ...storage,
                top_k: val,
              })
            }
          />
        </div>
      </Modal>
    </>
  );
}
