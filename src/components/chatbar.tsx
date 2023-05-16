import { useState } from "react";
import { Input } from "./ui/interactive";
import Loading from "./ui/loading";
import { useReactMediaRecorder } from "react-media-recorder-2";
import LangDialog from "./ui/langdialog";
import { supportedLanguages } from "@/utils/constants";

export default function ChatBar(props: {
    chat: string,
    language?: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void,
    onAudio: (blobUrl: string) => void,
    onLangSet?: (lang: string) => void,
    errors: string[],
    loading?: boolean
}) {

    const { chat, language, onChange, onSubmit, onLangSet, errors, loading, onAudio } = props;

    const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({
        audio: true,
        onStop: onAudio
    });

    const [langDialogOpen, setLangDialogOpen] = useState<boolean>(false);
    const [selectedLanguage, setSelectedLanguage] = useState<string>(language || "en");

    return (
        <>
            <div className={`fixed inset-0 flex items-center justify-center transition-all ${status === "recording" ? "visible opacity-100" : "invisible opacity-0"}`}>
                <div className="bg-black/40 absolute inset-0 -z-10" />
                <div className="md:min-w-[300px] md:min-h-[300px] bg-white rounded-xl p-4 flex items-center flex-col gap-4">
                    <div className="mb-4"> <i className="fa-regular fa-language"></i> <strong>{supportedLanguages.find(l => l.value === selectedLanguage)?.label}</strong> </div>
                    Listening...
                    <button className="flex w-28 h-28 items-center justify-center text-4xl bg-red-500 rounded-full text-white hover:bg-red-600" onClick={stopRecording}>
                        <i className="fas fa-microphone-slash" />
                    </button>
                </div>
            </div>
            <LangDialog
                open={langDialogOpen}
                onClose={() => {
                    setLangDialogOpen(false);
                }}
                onSubmit={(lang) => {
                    setLangDialogOpen(false);
                    setSelectedLanguage(lang);
                    onLangSet?.(lang);
                }}
            />
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
                            <button type="button" className="px-2" onClick={() => { setLangDialogOpen(true) }}>
                                <i className="fa-regular fa-language"></i>
                            </button>
                            <button type="button" className={`px-4 ${status === "recording" ? "text-green-500" : ""}`} onClick={status === "recording" ? stopRecording : startRecording}>
                                <i className="fal fa-microphone" />
                            </button>
                            <button className="pl-2 pr-4 disabled:text-gray-300" disabled={chat.length < 1}>
                                <i className="fal fa-paper-plane-top" />
                            </button>
                        </>
                    }
                />
            </form>
        </>
    )
}