"use client";

import { useAtom } from "jotai";
import { User } from "@/types/user";
import { useMutation, useQuery } from "@tanstack/react-query";
import { API } from "./api";
import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { storageAtom } from "@/store";

const noAuthRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/home"
];

export default function AuthProvider(props: {
    children: React.ReactNode,
}) {
    const { children } = props;

    const path = usePathname();
    const router = useRouter();

    const [storage, setStorage] = useAtom(storageAtom);
    const meMutation = useMutation<User>({
        mutationFn: API.user.me,
        onSuccess: (data) => {
            setStorage((st) => ({ ...st, user: data }))
        },
        onError: () => {
            setStorage((st) => ({ ...st, auth_token: undefined, user: undefined }))
        }
    })

    useEffect(() => {
        if (storage.auth_token) {
            meMutation.mutate();
        }
    }, [storage.auth_token])

    useEffect(() => {
        if (storage.user && path && noAuthRoutes.includes(path)) {
            router.push("/")
        } else if (!storage.user && path && !noAuthRoutes.includes(path)) {
            router.push("/home")
        }
    }, [path, storage.user])

    return children;
}