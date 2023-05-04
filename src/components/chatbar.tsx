import { useState } from "react";
import { Input } from "./ui/interactive";
import Loading from "./ui/loading";
import { useReactMediaRecorder } from "react-media-recorder-2";

export default function ChatBar(props: {
    chat: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void,
    onAudio: (blobUrl: string) => void,
    errors: string[],
    loading?: boolean
}) {

    const { chat, onChange, onSubmit, errors, loading, onAudio } = props;

    const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({
        audio: true,
        onStop: onAudio
    });

    return (
        <form onSubmit={onSubmit}>
            <Input
                type="text"
                placeholder="Chat"
                value={chat || ""}
                onChange={onChange}
                loading={loading}
                errors={errors}
                right={loading ?
                    <Loading /> :
                    <>
                        <button type="button" className={`px-4 ${status === "recording" ? "text-green-500" : ""}`} onClick={status === "recording" ? stopRecording : startRecording}>
                            <i className="fal fa-microphone" />
                        </button>
                        <button className="px-4 disabled:text-gray-300" disabled={chat.length < 1}>
                            <i className="fal fa-paper-plane-top" />
                        </button>
                    </>
                }
            />
        </form>
    )
}