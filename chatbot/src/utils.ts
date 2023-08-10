export const getFormData = async (text?: string) => {
    const fd = new FormData();
    if (text) {
        fd.append("text", text);
    }
    fd.append("language", "en");
    fd.append("temperature", "0.1");
    fd.append("top_k", "100");
    return fd;
}