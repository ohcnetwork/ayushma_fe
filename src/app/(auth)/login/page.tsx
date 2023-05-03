"use client";
import { Button, Errors, Input } from "@/components/ui/interactive";
import { storageAtom } from "@/store";
import { API } from "@/utils/api";
import { useMutation } from "@tanstack/react-query";
import { useAtom } from "jotai"
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function Login() {

    const [storage, setStorage] = useAtom(storageAtom);
    const [creds, setCreds] = useState({
        email: "",
        password: ""
    });
    const router = useRouter();
    const sp = useSearchParams();
    const resetSuccess = sp?.get("reset_success");

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
        <>
            {resetSuccess && (
                <div className="text-green-500 border border-green-500 p-3 bg-green-50 text-sm rounded-lg">
                    Password reset successfully. Please login.
                </div>
            )}
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
                <Link href="/forgot-password" className="text-green-500 hover:text-green-600 text-xs">Forgot Password?</Link>
                <Errors errors={(loginMutation.error as any)?.error?.non_field_errors} />
                <Button
                    loading={loginMutation.isLoading}
                >
                    Login
                </Button>
                <p>
                    Don&apos;t have an account? <Link href="/register" className="text-green-500 hover:text-green-600">Register</Link>
                </p>
            </form>
        </>
    )
}