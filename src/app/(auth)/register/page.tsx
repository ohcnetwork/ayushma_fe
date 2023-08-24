"use client";
import { Button, Errors, Input } from "@/components/ui/interactive";
import { storageAtom } from "@/store";
import { API } from "@/utils/api";
import { useMutation } from "@tanstack/react-query";
import { useAtom } from "jotai"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

export default function Register() {

    const [storage, setStorage] = useAtom(storageAtom);
    const [creds, setCreds] = useState({
        username: "",
        full_name: "",
        email: "",
        password: "",
        recaptcha: ""
    });
    const router = useRouter();

    const registerMutation = useMutation(() => API.user.register(creds), {
        onSuccess: (data) => {
            router.push("/login");
        }
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        registerMutation.mutate();
    }

    return (
        <>
            <h1 className="font-black text-2xl">
                Create an account
            </h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                    type="text"
                    placeholder="Your Name"
                    errors={(registerMutation.error as any)?.error?.full_name}
                    value={creds.full_name}
                    onChange={(e) => setCreds({ ...creds, full_name: e.target.value })}
                />
                <Input
                    type="text"
                    placeholder="Username"
                    errors={(registerMutation.error as any)?.error?.username}
                    value={creds.username}
                    onChange={(e) => setCreds({ ...creds, username: e.target.value })}
                />
                <Input
                    type="text"
                    placeholder="Email"
                    errors={(registerMutation.error as any)?.error?.email}
                    value={creds.email}
                    onChange={(e) => setCreds({ ...creds, email: e.target.value })}
                />
                <Input
                    type="password"
                    placeholder="Password"
                    errors={(registerMutation.error as any)?.error?.password}
                    value={creds.password}
                    onChange={(e) => setCreds({ ...creds, password: e.target.value })}
                />
                {process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY && (
                    <div>
                        <ReCAPTCHA
                            className="origin-[0_0] scale-[.85]"
                            sitekey={process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY ?? ""}
                            onChange={(value) => setCreds({ ...creds, recaptcha: value ?? "" })}
                        />
                        <Errors errors={(registerMutation.error as any)?.error?.recaptcha} className="-mt-3" />
                    </div>
                )}
                <Errors errors={(registerMutation.error as any)?.error?.non_field_errors} />
                <Button
                    loading={registerMutation.isLoading}
                >
                    Register
                </Button>
                <p>
                    Already have an account? <Link href="/login" className="text-green-500 hover:text-green-600">Login</Link>
                </p>
            </form>
        </>
    )
}