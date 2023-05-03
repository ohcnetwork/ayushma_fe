"use client";

import React, { useEffect } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { usePathname, useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { storageAtom } from "@/store";
import { API } from "./api";

const noAuthRoutes = ['/login', '/register', '/forgot-password', '/reset-password']

function Providers({ children }: React.PropsWithChildren) {
    const [client] = React.useState(
        new QueryClient({ defaultOptions: { queries: { staleTime: 5000 } } })
    );

    const router = useRouter()
    const pathname = usePathname()

    const [storage, setStorage] = useAtom(storageAtom);

    const getStorage = async () => {
        const storage = localStorage.getItem(process.env.NEXT_PUBLIC_LOCAL_STORAGE || "storage");
        if (storage) {
            setStorage(JSON.parse(storage));
        } else {
            setStorage({});
        }
    }

    useEffect(() => {
        if (storage) {
            localStorage.setItem(process.env.NEXT_PUBLIC_LOCAL_STORAGE || "storage", JSON.stringify(storage));
            if (!storage.auth_token) {
                if (!noAuthRoutes.includes(pathname || "")) {
                    router.push('/login');
                }
            }
        }
    }, [storage]);

    const getUserDetails = async () => {
        try {
            const userData = await API.user.me();
            if (userData) {
                setStorage({
                    ...storage,
                    user: userData,
                })
                if (noAuthRoutes.includes(pathname || "")) {
                    router.push('/');
                }
            } else {
                setStorage({})
            }
        } catch (e) {
            console.log(e);
            setStorage({})
        }
    }

    useEffect(() => {
        if (storage && storage.auth_token) {
            getUserDetails();
        }
    }, [storage?.auth_token]);

    useEffect(() => {
        getStorage();
    }, []);

    return (
        <QueryClientProvider client={client}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} position="top-right" />
        </QueryClientProvider>
    );
}

export default Providers;