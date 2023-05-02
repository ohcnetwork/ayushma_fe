"use client";
import { Button, Errors, Input } from "@/components/ui/interactive";
import { storageAtom } from "@/store";
import { API } from "@/utils/api";
import { useMutation } from "@tanstack/react-query";
import { useAtom } from "jotai"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ForgotPassword() {

    const [creds, setCreds] = useState({
        email: "",
    });
    const router = useRouter();

    const forgotMutation = useMutation(() => API.user.forgot(creds.email), {
        onSuccess: (data) => {
            router.push("/reset-password?email=" + creds.email);
        }
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        forgotMutation.mutate();
    }

    return (
        <>
            <h1 className="font-black text-2xl">
                Forgot Password?
            </h1>
            <p>
                Enter your email address and we will send you a link with an OTP to reset your password.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                    type="text"
                    placeholder="Email"
                    errors={(forgotMutation.error as any)?.error?.email}
                    value={creds.email}
                    onChange={(e) => setCreds({ ...creds, email: e.target.value })}
                />
                <Errors errors={(forgotMutation.error as any)?.error?.non_field_errors} />
                <Button
                    loading={forgotMutation.isLoading}
                >
                    Send OTP
                </Button>
                <p>
                    <Link href="/login" className="text-green-500 hover:text-green-600">Go back</Link>
                </p>
            </form>
        </>
    )
}