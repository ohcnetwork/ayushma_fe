"use client";
import ChatBar from "@/components/chatbar";
import ChatBlock from "@/components/chatblock";
import { storageAtom } from "@/store";
import { ChatConverseStream, ChatMessageType } from "@/types/chat";
import { Project } from "@/types/project";
import { API } from "@/utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Chat(params: { params: { project_id: string } }) {
  const { project_id } = params.params;
  const [chat, setChat] = useState("");
  const router = useRouter();
  const [storage] = useAtom(storageAtom);
  const queryClient = useQueryClient();
  const [chatMessage, setChatMessage] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [chatID, setChatID] = useState<string>("");
  const [apiError, setApiError] = useState<undefined | string>(undefined);

  const openai_key =
    !storage?.user?.allow_key || storage?.override_api_key
      ? storage?.openai_api_key
      : undefined;

  useEffect(() => {
    if (!isTyping && chatID)
      router.push(`/project/${project_id}/chat/${chatID}?autoplay`);
  }, [chatID, isTyping, project_id, router]);

  const projectQuery = useQuery({
    queryKey: ["chat", project_id],
    queryFn: () => API.projects.get(project_id),
    refetchOnWindowFocus: false,
  });
  const project: Project | undefined = projectQuery.data;

  const streamChatMessage = async (message: ChatConverseStream) => {
    if (chat === "") setChat(message.input);
    setChatMessage((prevChatMessage) => {
      const updatedChatMessage = (prevChatMessage + message.delta)
        .replaceAll(`${process.env.NEXT_PUBLIC_AI_NAME}:`, "")
        .trimStart();
      return updatedChatMessage;
    });
    if (message.stop) setIsTyping(false);
    if (message.error) {
      setChatMessage("");
      setIsTyping(false);
    }
  };

  const newChatMutation = useMutation({
    mutationFn: () =>
      API.chat.create(
        project_id,
        chat !== "" ? chat.slice(0, 50) : "new chat",
        storage.openai_api_key,
      ),
    retry: false,
  });

  const converseMutation = useMutation({
    mutationFn: (params: { external_id: string; formdata: FormData }) =>
      API.chat.converse(
        project_id,
        params.external_id,
        params.formdata,
        openai_key,
        streamChatMessage,
        20,
        !project?.assistant_id,
      ),
    retry: false,
    onSuccess: async (data, vars) => {
      if (!data) return;
      setChatID(data.external_id);
      await queryClient.invalidateQueries({ queryKey: ["chats"] });
      setIsTyping(false);
    },
  });

  const getFormData = async (blobUrl?: string, text?: string) => {
    const fd = new FormData();
    if (blobUrl) {
      const f = await fetch(blobUrl);
      const blob = await f.blob();
      const file = new File([blob], "audio.wav", { type: "audio/wav" });
      fd.append("audio", file);
    } else if (text) {
      fd.append("text", text);
    }
    fd.append("language", storage.language || "en");
    fd.append("temperature", (storage.temperature || 0.1).toString());
    fd.append("top_k", (storage.top_k || 100).toString());
    return fd;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsTyping(true);
    e.preventDefault();

    try {
      const { external_id } = await newChatMutation.mutateAsync();
      setChatID(external_id);

      const fd = await getFormData(undefined, chat);
      converseMutation.mutate({ external_id, formdata: fd });
    } catch (e: any) {
      setIsTyping(false);
      setApiError(e?.error?.error);
    }
  };

  const handleAudio = async (blobUrl: string) => {
    setIsTyping(true);
    try {
      const { external_id } = await newChatMutation.mutateAsync();
      setChatID(external_id);

      const sttFormData = await getFormData(blobUrl);
      const { transcript, stats } = await API.chat.speechToText(
        project_id,
        external_id,
        sttFormData,
      );

      setChat(transcript);

      const fd = await getFormData(undefined, transcript);
      fd.append(
        "transcript_start_time",
        stats.transcript_start_time.toString(),
      );
      fd.append("transcript_end_time", stats.transcript_end_time.toString());
      converseMutation.mutate({ external_id, formdata: fd });
    } catch (e: any) {
      setIsTyping(false);
      setApiError(e?.error?.error);
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full">
      <div className="flex-1 items-center justify-center w-full overflow-auto">
        {!chatMessage ? (
          <div className="text-center text-gray-500 w-full">
            <h1 className="font-black text-4xl text-gray-600 mt-8">
              {process.env.NEXT_PUBLIC_AI_NAME}
            </h1>
            <p>{process.env.NEXT_PUBLIC_AI_DESCRIPTION}</p>

            {(project?.display_preset_questions ?? [])?.length > 0 && (
              <>
                <h2 className="font-semibold mt-8">Try asking me -</h2>
                <div className="grid md:grid-cols-2 mt-4 gap-4 px-4 lg:max-w-4xl mx-auto">
                  {(project?.display_preset_questions ?? []).map(
                    (prompt, i) => (
                      <button
                        onClick={async () => {
                          setChat(prompt);
                          setIsTyping(true);
                          const fd = await getFormData(undefined, prompt);
                          const { external_id } =
                            await newChatMutation.mutateAsync();
                          if (external_id === "") return;
                          setChatID(external_id);

                          converseMutation.mutate({
                            external_id,
                            formdata: fd,
                          });
                        }}
                        disabled={newChatMutation.isPending}
                        className="bg-primary hover:shadow-lg hover:bg-secondary hover:text-indigo-500 text-left border border-secondaryActive rounded-lg p-4 transition disabled:opacity-50 disabled:hover:text-gray-400"
                        key={i}
                      >
                        {prompt}
                      </button>
                    ),
                  )}
                </div>
              </>
            )}
            <div className="mt-6">
              <Link
                href="https://github.com/ohcnetwork/ayushma_fe"
                target="_blank"
              >
                <i className="fab fa-github" /> Contribute
              </Link>
            </div>
          </div>
        ) : (
          <>
            <ChatBlock
              message={{
                messageType: ChatMessageType.USER,
                message: chat,
                original_message: chat,
                language: storage.language || "en",
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
                language: storage.language || "en",
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
          chat={chat}
          onChange={(e) => setChat(e.target.value)}
          onSubmit={handleSubmit}
          onAudio={handleAudio}
          errors={[
            (newChatMutation.error as any)?.error?.error,
            (newChatMutation.error as any)?.error?.non_field_errors,
            apiError,
          ]}
          loading={
            newChatMutation.isPending || converseMutation.isPending || isTyping
          }
          projectId={project_id}
        />
        <p className="text-xs pl-0.5 text-center text-gray-500">
          {process.env.NEXT_PUBLIC_AI_WARNING}
        </p>
      </div>
    </div>
  );
}
