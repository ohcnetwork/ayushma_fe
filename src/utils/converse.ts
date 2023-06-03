import { Storage } from "@/types/storage";
import { useMutation } from "@tanstack/react-query";
import { API } from "./api";

export const getFormData = async (storage: Storage, blobUrl?: string, text?: string) => {
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
}