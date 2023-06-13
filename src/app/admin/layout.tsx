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
        <div className="max-w-[1000px] mx-5 mb-5 md:mx-auto md:mb-auto mt-6">
            {children}
        </div>
    )
}