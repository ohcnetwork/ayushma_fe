"use client";

import { CheckBox, Input } from "@/components/ui/interactive";
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
            <br />
            <br />
            {storage?.user?.allow_key && (
                <div>
                    <CheckBox
                        label="Override key"
                        type="checkbox"
                        checked={storage?.override_api_key}
                        onChange={(e) => setStorage({
                            ...storage,
                            override_api_key: e.target.checked
                        })}
                    />
                    {storage?.override_api_key && (
                        <p className="text-gray-700 text-xs">
                            Your key will be used instead of Ayushma&apos;s Key
                        </p>
                    )}
                </div>
            )}
            <CheckBox
                label="Show stats for nerds"
                type="checkbox"
                checked={storage?.show_stats}
                onChange={(e) => setStorage({
                    ...storage,
                    show_stats: e.target.checked
                })}
            />
        </div>
    )
}