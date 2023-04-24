"use client";
import { storageAtom } from "@/store";
import { useAtom } from "jotai"
import { useEffect } from "react";

export default function Login() {

    const [storage, setStorage] = useAtom(storageAtom);

    useEffect(() => {

    }, [])

    return (
        <div>
            <h1>Login</h1>
        </div>
    )
}