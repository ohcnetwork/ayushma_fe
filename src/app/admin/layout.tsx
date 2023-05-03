"use client";

import { storageAtom } from "@/store";
import { useAtom } from "jotai";

export default function Layout({ children }: { children: React.ReactNode }) {

    const [storage, setStorage] = useAtom(storageAtom);

    if (!storage?.user?.is_staff) return (
        <div>
            You are not authorized to view this page.
        </div>
    )

    return (
        <div className="w-[1000px] m-auto mt-10">
            {children}
        </div>
    )
}