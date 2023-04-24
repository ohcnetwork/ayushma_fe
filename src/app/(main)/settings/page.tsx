"use client";

import { Input } from "@/components/ui/interactive";
import { storageAtom } from "@/store";
import { useAtom } from "jotai";

export default function Page() {

    const [storage, setStorage] = useAtom(storageAtom);

    return (
        <div className="p-8">
            Your Open AI API key
            <Input
                type="text"
                placeholder="OpenAI key"
                value={storage?.openai_api_key}
                onChange={(e) => setStorage({
                    ...storage,
                    openai_api_key: e.target.value
                })}
            />
        </div>
    )
}