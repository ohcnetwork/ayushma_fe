"use client";
import { Button, Errors, Input } from "@/components/ui/interactive";
import { storageAtom } from "@/store";
import { API } from "@/utils/api";
import { useMutation } from "@tanstack/react-query";
import { useAtom } from "jotai"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Login() {

    const [storage, setStorage] = useAtom(storageAtom);
    const [creds, setCreds] = useState({
        email: "",
        password: ""
    });
    const router = useRouter();

    const loginMutation = useMutation(() => API.user.login(creds.email, creds.password), {
        onSuccess: (data) => {
            setStorage({
                ...storage,
                auth_token: data.token
            })
            router.push("/");
        }
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        loginMutation.mutate();
    }

    return (
        <div className="bg-[url('/bg.png')] bg-cover bg-center h-screen flex items-center justify-center">
            <div className="w-64 flex flex-col gap-4">
                <h1 className="font-black text-2xl">
                    Login
                </h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Input
                        type="text"
                        placeholder="Email"
                        errors={(loginMutation.error as any)?.error?.email}
                        value={creds.email}
                        onChange={(e) => setCreds({ ...creds, email: e.target.value })}
                    />
                    <Input
                        type="password"
                        placeholder="Password"
                        errors={(loginMutation.error as any)?.error?.password}
                        value={creds.password}
                        onChange={(e) => setCreds({ ...creds, password: e.target.value })}
                    />
                    <Errors errors={(loginMutation.error as any)?.error?.non_field_errors} />
                    <Button
                        loading={loginMutation.isLoading}
                    >
                        Login
                    </Button>
                </form>
            </div>
        </div>
    )
}