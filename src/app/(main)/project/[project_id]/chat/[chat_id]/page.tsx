"use client";

import ChatBar from "@/components/chatbar";
import ChatBlock from "@/components/chatblock";
import { storageAtom } from "@/store";
import { Chat, ChatConverseStream, ChatMessageType } from "@/types/chat";
import { Project } from "@/types/project";
import { API } from "@/utils/api";
import { getFormData } from "@/utils/converse";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Chat(
  params: Readonly<{
    params: { project_id: string; chat_id: string };
  }>,
) {
  const { project_id, chat_id } = params.params;
  const searchParams = useSearchParams();
  const autoplayParam = searchParams?.get("autoplay") !== null;
  const [shouldAutoPlay, setShouldAutoPlay] = useState<boolean>(false);
  const [newChat, setNewChat] = useState("");
  const [chatMessage, setChatMessage] = useState<string>("");
  const [storage] = useAtom(storageAtom);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [apiError, setApiError] = useState<undefined | string>(undefined);

  const chatQuery = useQuery({
    queryKey: ["chat", chat_id],
    queryFn: () => API.chat.get(project_id, chat_id),
    refetchOnWindowFocus: false,
  });

  const projectQuery = useQuery({
    queryKey: ["chat", project_id],
    queryFn: () => API.projects.get(project_id),
    refetchOnWindowFocus: false,
  });
  const project: Project | undefined = projectQuery.data;

  const chat: Chat | undefined = chatQuery.data;
  const [autoPlayIndex, setAutoPlayIndex] = useState<number>(-1);

  const openai_key =
    !storage?.user?.allow_key || storage?.override_api_key
      ? storage?.openai_api_key
      : undefined;

  useEffect(() => {
    if (!chat?.chats) return;
    const uri = window.location.toString();
    if (uri.indexOf("?") > 0) setShouldAutoPlay(true);
    window.history.replaceState(
      {},
      document.title,
      uri.substring(0, uri.indexOf("?")),
    );
  }, [chat, autoplayParam]);

  useEffect(() => {
    const prevTitle = document.title;
    API.projects
      .get(params.params.project_id)
      .then((data) => (document.title = data.title));
    return () => {
      document.title = prevTitle;
    };
  }, []);

  const streamChatMessage = async (message: ChatConverseStream) => {
    if (newChat === "") setNewChat(message.input);
    setChatMessage((prevChatMessage) => {
      const updatedChatMessage = prevChatMessage + message.delta;
      return updatedChatMessage;
    });
    if (message.stop) {
      await chatQuery.refetch();
      setNewChat("");
      setIsTyping(false);
      setChatMessage("");
    }
    if (message.error) {
      setIsTyping(false);
      setNewChat("");
      setChatMessage("");
    }
  };

  const converseMutation = useMutation({
    mutationFn: (params: { formdata: FormData }) =>
      API.chat.converse(
        project_id,
        chat_id,
        params.formdata,
        openai_key,
        streamChatMessage,
        20,
        !project?.assistant_id,
      ),
    retry: false,
    onSuccess: async (data, vars) => {
      setAutoPlayIndex((chat?.chats?.length || 0) + 1);
      if (!project?.assistant_id) await chatQuery.refetch();
    },
    onError: async (error, vars) => {
      converseMutation.error = error;
      setIsTyping(false);
    },
  });

  const chat_language = chat?.chats?.[0]?.language || "en";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsTyping(true);
    const fd = await getFormData(storage, undefined, newChat, chat_language);
    converseMutation.mutate({ formdata: fd });
  };

  const handleAudio = async (blobUrl: string) => {
    setIsTyping(true);
    const sttFormData = await getFormData(storage, blobUrl)
    try{
      const {transcript, stats} = await API.chat.speechToText(
        project_id,
        chat_id,
        sttFormData,
      )
      setNewChat(transcript);

      const fd = await getFormData(storage, undefined, transcript);
      fd.append("transcript_start_time", stats.transcript_start_time.toString());
      fd.append("transcript_end_time", stats.transcript_end_time.toString());
      converseMutation.mutate({ formdata: fd });
    }
    catch(e: any){
      setIsTyping(false);
      setApiError(e?.error?.error);
    }
  };

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [chatMessage]);

  useEffect(() => {
    setShouldAutoPlay(false);
  }, [shouldAutoPlay]);

  useEffect(() => {
    console.log(autoPlayIndex);
    if (autoPlayIndex !== -1) setTimeout(() => setAutoPlayIndex(-1), 1000);
  }, [autoPlayIndex]);

  return (
    <div className="h-full flex flex-col flex-1">
      <div className="flex-1 overflow-auto" ref={messagesContainerRef}>
        {chat?.chats?.map((message, i) => (
          <ChatBlock
            message={message}
            key={message.external_id}
            autoplay={(shouldAutoPlay && i === 1) || i === autoPlayIndex}
          />
        ))}

        {chatMessage && (
          <>
            <ChatBlock
              message={{
                messageType: ChatMessageType.USER,
                message: newChat,
                original_message: newChat,
                language: chat_language,
                created_at: "",
                external_id: "",
                modified_at: "",
              }}
            />
            <ChatBlock
              cursor={true}
              message={{
                messageType: ChatMessageType.AYUSHMA,
                message: chatMessage,
                original_message: chatMessage,
                language: chat_language,
                created_at: "",
                external_id: "",
                modified_at: "",
              }}
            />
          </>
        )}
      </div>
      <div className="w-full shrink-0 p-4 md:p-6 max-w-5xl mx-auto">
        <ChatBar
          chat={newChat || ""}
          onChange={(e) => setNewChat(e.target.value)}
          onSubmit={handleSubmit}
          onAudio={handleAudio}
          errors={[(converseMutation.error as any)?.error?.error, apiError]}
          loading={converseMutation.isPending || isTyping}
          projectId={project_id}
          forceLanguage={chat_language}
        />
        <p className="text-xs pl-0.5 text-center text-gray-500">
          {" "}
          {process.env.NEXT_PUBLIC_AI_WARNING}
        </p>
      </div>
    </div>
  );
}
