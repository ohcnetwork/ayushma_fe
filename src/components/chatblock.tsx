import React, { useEffect, useState } from "react";
import { ChatFeedback, ChatMessage, ChatMessageType } from "@/types/chat";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";
import rehypeRaw from "rehype-raw";
import { storageAtom } from "@/store";
import { useAtom } from "jotai";
import Stats from "./stats";
import Modal from "./modal";
import { Button } from "./ui/interactive";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API } from "@/utils/api";
import { useParams } from "next/navigation";

type AudioStatus = "unloaded" | "loading" | "playing" | "paused" | "stopped";

export default function ChatBlock(props: {
  message?: ChatMessage;
  loading?: boolean;
  autoplay?: boolean;
  cursor?: boolean;
}) {
  const [storage] = useAtom(storageAtom);
  const { message, loading, cursor, autoplay } = props;
  const cursorText = cursor
    ? (message?.original_message?.length || 0) % 2 === 0
      ? "|"
      : ""
    : "";
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [audioStatus, setAudioStatus] = useState<AudioStatus>("unloaded");
  const [percentagePlayed, setPercentagePlayed] = useState(0);

  const isCompleteLetter = (str: string) => {
    const regex = /^\p{L}$/u;
    return regex.test(str);
  };

  const chatMessage =
    (message?.message != message?.original_message
      ? message?.message
      : message?.original_message) + cursorText;

  const getMessageSegments = (): {
    highlightText: string;
    blackText: string;
  } => {
    const messageLength = chatMessage.length || 0;
    const highlightLength =
      percentagePlayed === 100
        ? 0
        : Math.floor((percentagePlayed / 100) * messageLength);

    let highlightText = chatMessage.slice(0, highlightLength) || "";
    let blackText = chatMessage.slice(highlightLength) || "";

    while (
      highlightText &&
      blackText &&
      percentagePlayed < 100 &&
      highlightText.length > 0 &&
      !isCompleteLetter(highlightText.slice(-1))
    ) {
      highlightText += blackText[0];
      blackText = blackText.slice(1);
    }

    return { highlightText, blackText };
  };

  const { highlightText, blackText } = getMessageSegments();

  useEffect(() => {
    if (audio) {
      const interval = setInterval(() => {
        setPercentagePlayed((audio.currentTime / audio.duration) * 100);
      }, 10);
      return () => clearInterval(interval);
    }
  }, [audio]);

  const loadAudio = async () => {
    if (message?.messageType === ChatMessageType.AYUSHMA) {
      setAudioStatus("loading");
      const audio = new Audio(message?.audio);
      setAudio(audio);
      setAudioStatus("playing");
      audio.play();
      audio.addEventListener("ended", () => {
        setAudioStatus("stopped");
      });
    }
  };

  const togglePlay = () => {
    if (audioStatus === "loading") return;
    if (audioStatus === "unloaded") loadAudio();
    if (audioStatus === "playing") {
      audio?.pause();
      setAudioStatus("paused");
    } else {
      audio?.play();
      setAudioStatus("playing");
    }
  };

  const stopAudio = () => {
    if (!audio) return;
    if (audioStatus === "loading" || audioStatus === "unloaded") return;
    if (audioStatus === "playing" || audioStatus === "paused") {
      audio?.pause();
      audio.currentTime = 0;
      setAudioStatus("stopped");
    }
  };

  useEffect(() => {
    if (autoplay) togglePlay();
  }, []);

  return (
    <div
      className={`relative flex flex-col gap-4 p-4 pt-8 md:p-6 md:pt-8 ${
        message?.messageType === ChatMessageType.USER ? "bg-gray-500/5" : ""
      }`}
    >
      <div className="flex gap-6 max-w-4xl mx-auto w-full">
        <div>
          {message?.messageType === ChatMessageType.USER && !loading ? (
            <div className="flex items-center justify-center w-10 h-10 text-2xl shrink-0 text-center bg-[#ffc688] rounded-full">
              <Image
                className="p-1.5"
                src="/person.svg"
                alt="User icon"
                width={100}
                height={100}
              />
            </div>
          ) : message?.messageType === ChatMessageType.AYUSHMA && !loading ? (
            <div className="flex items-center justify-center w-10 h-10 text-2xl shrink-0 text-center rounded-full">
              <Image
                className="p-0.5"
                src="/logo.svg"
                alt="Logo"
                width={100}
                height={100}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center w-10 h-10 text-2xl shrink-0 text-center bg-gray-300 rounded-full">
              <i className="fa-solid fa-circle-exclamation"></i>
            </div>
          )}
        </div>
        <div className="w-full pt-0.5">
          {loading ? (
            "Loading..."
          ) : (
            <div>
              {message?.messageType === ChatMessageType.SYSTEM && (
                <div className="relative flex flex-col gap-1">
                  <div className="min-h-[20px] flex flex-col items-start text-red-500">
                    <div className="py-2 px-3 border text-gray-700 rounded-md text-sm border-red-500 bg-red-500/10">
                      {message?.message}
                    </div>
                  </div>
                </div>
              )}
              {message?.messageType != ChatMessageType.SYSTEM && (
                <ReactMarkdown
                  rehypePlugins={[rehypeRaw]}
                  remarkPlugins={[remarkGfm]}
                  className="markdown-render"
                >
                  {audioStatus === "unloaded"
                    ? (message?.message || message?.original_message) +
                        cursorText || ""
                    : `<span className="text-green-600">${highlightText}</span><span>${blackText}</span>`}
                </ReactMarkdown>
              )}
              {message?.messageType === ChatMessageType.AYUSHMA &&
                message?.audio && (
                  <div className="inline-flex gap-1 mt-2">
                    <button
                      onClick={togglePlay}
                      className="flex items-center justify-center text-gray-500 rounded-lg transition bg-gray-100 hover:text-gray-700 hover:bg-gray-300 p-2"
                    >
                      {audioStatus === "playing" ? (
                        <i className="fa-regular fa-circle-pause text-xl"></i>
                      ) : (
                        <i className="fa-regular fa-circle-play text-xl"></i>
                      )}
                    </button>
                    {(audioStatus === "paused" ||
                      audioStatus === "playing") && (
                      <button
                        onClick={stopAudio}
                        className="flex items-center justify-center text-red-500 rounded-lg transition bg-gray-200 hover:text-gray-700 hover:bg-gray-300 p-2 "
                      >
                        <i className="fa-regular fa-circle-stop text-xl"></i>
                      </button>
                    )}
                  </div>
                )}
              {storage?.show_english &&
                message?.message &&
                message?.message !== message?.original_message && (
                  <>
                    <hr className="border-gray-300 my-4" />
                    <ReactMarkdown
                      rehypePlugins={[rehypeRaw]}
                      remarkPlugins={[remarkGfm]}
                      className="markdown-render text-sm text-gray-700"
                    >
                      {message?.original_message || ""}
                    </ReactMarkdown>
                  </>
                )}
              {storage?.show_stats && message && (
                <>
                  <hr className="border-gray-300 my-4" />
                  <Stats message={message} />
                </>
              )}
            </div>
          )}
        </div>
      </div>
      {message?.reference_documents &&
        message?.reference_documents.length > 0 && (
          <div className="flex flex-wrap gap-2 pl-16 items-center pb-4 max-w-4xl mx-auto w-full">
            <p className="mr-1 text-sm italic">References:</p>
            {message?.reference_documents.map((doc, i) => {
              if (doc.document_type === 1 || doc.document_type === 2)
                return (
                  <a
                    key={i}
                    href={doc.document_type === 1 ? doc.file : doc.text_content}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-md hover:bg-gray-300"
                  >
                    {doc.title}
                  </a>
                );
              else if (doc.document_type === 3)
                return (
                  <div className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-md hover:bg-gray-300">
                    {doc.title}
                  </div>
                );
              else return null;
            })}
          </div>
        )}
      {message?.messageType === ChatMessageType.AYUSHMA && (
        <div className="absolute top-2 right-2">
          <ChatFeedback
            message_id={message.external_id}
            feedback={message?.feedback ?? null}
          />
        </div>
      )}
    </div>
  );
}

const ChatFeedback = ({
  feedback,
  message_id,
  onSuccess,
}: {
  message_id: string;
  feedback: ChatFeedback;
  onSuccess?: (data: ChatFeedback) => void;
}) => {
  const queryClient = useQueryClient();
  const [liked, setLiked] = useState<boolean | null>(null);
  const [message, setMessage] = useState("");
  const [messageSuggestions, setMessageSuggestions] = useState({
    liked: ["This is helpful."],
    disliked: [
      "This isn't helpful.",
      "This isn't true.",
      "This is harmful / unsafe.",
    ],
  });
  const { chat_id } = useParams();

  const createChatFeedbackMutation = useMutation(
    (feedback: Partial<ChatFeedback>) => API.feedback.create(feedback),
    {
      onSuccess: async (data: ChatFeedback) => {
        await queryClient.invalidateQueries(["chat", chat_id]);
        onSuccess?.(data);
      },
    }
  );

  return feedback ? (
    <div className="relative text-right group">
      {feedback.message && (
        <div className="hidden group-hover:block absolute bottom-6 right-6 text-center bg-gray-100 text-gray-900 p-2 px-4 rounded shadow">
          {feedback.message}
        </div>
      )}
      {feedback.liked ? (
        <i className="fas fa-thumbs-up p-1 rounded text-green-900 bg-green-100" />
      ) : (
        <i className="fas fa-thumbs-down p-1 rounded text-red-900 bg-red-100" />
      )}
    </div>
  ) : (
    <>
      <Modal
        className="md:h-fit"
        show={liked !== null}
        onClose={() => setLiked(null)}
      >
        <header className="flex items-center gap-6 border-b border-gray-200 pb-2">
          {liked ? (
            <i className="fas fa-thumbs-up p-3 rounded-full text-green-400 bg-green-100" />
          ) : (
            <i className="fas fa-thumbs-down p-3 rounded-full text-red-400 bg-red-100" />
          )}
          <h2 className="text-2xl font-semibold">
            Provide Additional Feedback
          </h2>
        </header>

        <div className="mt-10">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder={
              liked
                ? "What do you like about the response?"
                : "What was the issue with the response? How could it be improved?"
            }
            className="w-full p-4 rounded shadow-sm border border-gray-500"
          ></textarea>

          <div className="mt-4 flex items-center flex-wrap gap-2">
            {messageSuggestions[liked ? "liked" : "disliked"].map(
              (suggestion, i) => (
                <p
                  key={suggestion}
                  onClick={() => {
                    setMessage(`${message} ${suggestion}`.trim());
                    setMessageSuggestions({
                      ...messageSuggestions,
                      [liked ? "liked" : "disliked"]: [
                        ...messageSuggestions[
                          liked ? "liked" : "disliked"
                        ].filter((_, j) => i !== j),
                      ],
                    });
                  }}
                  className="text-sm p-2 px-4 text-white bg-gray-400 rounded-2xl cursor-pointer hover:bg-gray-500"
                >
                  {suggestion}
                </p>
              )
            )}
          </div>
        </div>

        <div className="mt-10 flex justify-end items-end">
          <Button
            onClick={async () =>
              await createChatFeedbackMutation.mutateAsync({
                chat_message: message_id,
                liked: liked as boolean,
                message,
              })
            }
            variant="primary"
          >
            Submit
          </Button>
        </div>
      </Modal>

      <div className="flex items-center justify-end gap-2">
        <i
          onClick={() => setLiked(true)}
          className="far fa-thumbs-up cursor-pointer p-1 rounded text-gray-500 hover:text-gray-900 hover:bg-gray-100"
        />
        <i
          onClick={() => setLiked(false)}
          className="far fa-thumbs-down cursor-pointer p-1 rounded text-gray-500 hover:text-gray-900 hover:bg-gray-100"
        />
      </div>
    </>
  );
};
