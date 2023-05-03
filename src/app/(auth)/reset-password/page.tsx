"use client";
import { Button, Errors, Input } from "@/components/ui/interactive";
import { API } from "@/utils/api";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ForgotPassword() {

    const sp = useSearchParams()
    const token = sp?.get("token") || "";
    const email = sp?.get("email");
    const [otp, setOTP] = useState(token);
    const [password, setPassword] = useState({
        password: "",
        confirm_password: ""
    });
    const [passwordError, setPasswordError] = useState(false);
    const [verified, setVerified] = useState(false);

    const router = useRouter();

    const verifyMutation = useMutation(() => API.user.verify(otp, email || ""), {
        onSuccess: (data) => {
            setVerified(true);
        }
    })

    useEffect(() => {
        if (token && email) {
            verifyMutation.mutate();
        }
    }, [token, email])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        verifyMutation.mutate();
    }

    const resetMutation = useMutation(() => API.user.reset(
        otp,
        email || "",
        password.password
    ), {
        onSuccess: (data) => {
            router.push("/login?reset_success=true");
        }
    })

    const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPasswordError(false);
        if (password.password !== password.confirm_password) {
            setPasswordError(true);
            return;
        }
        resetMutation.mutate();
    }

    if (!email) {
        return (
            <>
                <h1>
                    Invalid URL
                </h1>
            </>
        )
    }

    if (verified) {
        return (
            <>
                <h1 className="font-black text-2xl">
                    Reset Password
                </h1>
                <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
                    <Input
                        type="password"
                        placeholder="Password"
                        errors={(resetMutation.error as any)?.error?.password}
                        value={password.password}
                        onChange={(e) => setPassword({
                            ...password,
                            password: e.target.value
                        })}
                    />
                    <Input
                        type="password"
                        placeholder="Confirm Password"
                        errors={passwordError ? ["Passwords do not match"] : undefined}
                        value={password.confirm_password}
                        onChange={(e) => setPassword({
                            ...password,
                            confirm_password: e.target.value
                        })}
                    />
                    <Button
                        loading={resetMutation.isLoading}
                    >
                        Reset
                    </Button>
                    <p>
                        <Link href="/login" className="text-green-500 hover:text-green-600">Cancel</Link>
                    </p>
                </form>
            </>
        )
    }

    return (
        <>
            <h1 className="font-black text-2xl">
                Enter OTP
            </h1>
            <p>
                We have sent an OTP to {email}. Please enter it below.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                    type="text"
                    placeholder="OTP"
                    errors={(verifyMutation.error as any)?.error?.token}
                    value={otp}
                    onChange={(e) => setOTP(e.target.value)}
                />
                <Errors errors={(verifyMutation.error as any)?.error?.non_field_errors} />
                <Button
                    loading={verifyMutation.isLoading}
                >
                    Verify
                </Button>
                <p>
                    <Link href="/login" className="text-green-500 hover:text-green-600">Go back</Link>
                </p>
            </form>
        </>
    )
}