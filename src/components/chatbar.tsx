import { useState } from "react";
import { Input } from "./ui/interactive";
import Loading from "./ui/loading";
import { useReactMediaRecorder } from "react-media-recorder-2";
import LangDialog from "./ui/langdialog";
import { supportedLanguages } from "@/utils/constants";
import { storageAtom } from "@/store";
import { useAtom } from "jotai";
import Modal from "./modal";

export default function ChatBar(props: {
    chat: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void,
    onAudio: (blobUrl: string) => void,
    errors: string[],
    loading?: boolean
}) {

    const { chat, onChange, onSubmit, errors, loading, onAudio } = props;

    const [storage, setStorage] = useAtom(storageAtom);

    const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({
        audio: true,
        onStop: onAudio
    });

    const [langDialogOpen, setLangDialogOpen] = useState<boolean>(false);

    return (
        <>
            <div className={`fixed inset-0 flex items-center justify-center transition-all ${status === "recording" ? "visible opacity-100" : "invisible opacity-0"}`}>
                <div className="bg-black/40 absolute inset-0 -z-10" />
                <div className="md:min-w-[300px] md:min-h-[300px] bg-white rounded-xl p-4 flex items-center flex-col gap-4">
                    <div className="mb-4">
                        <i className="fa-regular fa-language"></i>&nbsp;
                        <strong>
                            {supportedLanguages.find(l => l.value === (storage?.language || "en"))?.nativeLabel}
                        </strong>
                        <span className="text-sm text-gray-500">
                            {storage?.language !== "en" && (<>({supportedLanguages.find(l => l.value === (storage?.language || "en"))?.label})</>)}
                        </span>
                    </div>
                    Listening...
                    <button className="flex w-28 h-28 items-center justify-center text-4xl bg-red-500 rounded-full text-white hover:bg-red-600" onClick={stopRecording}>
                        <i className="fas fa-microphone-slash" />
                    </button>
                </div>
            </div>
            <Modal
                show={langDialogOpen}
                onClose={() => {
                    setLangDialogOpen(false);
                }}
                className="md:w-auto md:h-auto"
            >
                <h1 className="text-2xl font-black">
                    <i className="far fa-language" /> Select conversation language
                </h1>
                <br />
                <select
                    value={storage?.language || "en"}
                    onChange={(e) => setStorage({ ...storage, language: e.target.value })}
                    className="block w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 rounded leading-tight focus:outline-none focus:shadow-outline-blue focus:border-green-500 transition duration-150 ease-in-out sm:text-sm sm:leading-5">
                    {supportedLanguages.map((language) => (
                        <option key={language.value} value={language.value}>
                            {language.label} ({language.nativeLabel})
                        </option>
                    ))}
                </select>
            </Modal>
            <form onSubmit={onSubmit}>
                <Input
                    type="text"
                    autoFocus={true}
                    placeholder="Chat"
                    value={chat || ""}
                    onChange={onChange}
                    loading={loading}
                    errors={errors}
                    right={loading ?
                        <Loading /> :
                        <span className="flex justify-between border-t p-1">
                            <span>
                            <button title="Select Conversation Language" type="button" className="w-12 h-12 p-1 text-xl bg-gray-50 text-gray-500 rounded-lg hover:bg-gray-100 transition" onClick={() => { setLangDialogOpen(true) }}>
                                <i className="fa-regular fa-language"></i>
                            </button>
                            <button title="Search by Voice" type="button" className={`w-12 h-12 p-1 ml-2 text-xl bg-gray-50 text-gray-500 rounded-lg hover:bg-gray-100 transition ${status === "recording" ? "text-green-500" : ""}`} onClick={status === "recording" ? stopRecording : startRecording}>
                                <i className="fal fa-microphone" />
                            </button>
                            </span>
                            <button className="w-12 h-12 p-1 text-xl ml-2 rounded-lg enabled:hover:bg-green-600 enabled:bg-green-500 enabled:text-white disabled:text-gray-300 transition"  disabled={chat.length < 1}>
                                <i className="fal fa-paper-plane-top" />
                            </button>
                        </span>
                    }
                />
            </form>
        </>
    )
}
