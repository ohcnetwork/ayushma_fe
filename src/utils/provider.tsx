"use client";

import React, { useEffect } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { usePathname, useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { storageAtom } from "@/store";
import { API } from "./api";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";

const noAuthRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/home"
];

function Providers({ children }: React.PropsWithChildren) {
  const [client] = React.useState(
    new QueryClient({ defaultOptions: { queries: { staleTime: 5000 } } }),
  );

  const router = useRouter();
  const pathname = usePathname();

  const [storage, setStorage] = useAtom(storageAtom);

  const getStorage = async () => {
    const storage = localStorage.getItem(
      process.env.NEXT_PUBLIC_LOCAL_STORAGE || "storage",
    );
    if (storage) {
      setStorage(JSON.parse(storage));
    } else {
      setStorage({});
    }
  };

  useEffect(() => {
    if (storage) {
      localStorage.setItem(
        process.env.NEXT_PUBLIC_LOCAL_STORAGE || "storage",
        JSON.stringify(storage),
      );
      if (!storage.auth_token) {
        if (!noAuthRoutes.includes(pathname || "")) {
          router.push("/home");
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
        });
        if (noAuthRoutes.includes(pathname || "")) {
          router.push("/");
        }
      } else {
        setStorage({});
      }
    } catch (e) {
      console.log(e);
      setStorage({});
    }
  };

  useEffect(() => {
    if (storage) {
      if (storage.auth_token) {

        getUserDetails();
        const currentHostName = window.location.hostname;
        document.cookie = `auth_token=${storage.auth_token}; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT; domain=${process.env.NEXT_PUBLIC_COOKIE_DOMAIN
          ? process.env.NEXT_PUBLIC_COOKIE_DOMAIN
          : currentHostName
          }`;
      } else {
        // delete cookie
        document.cookie = `auth_token=; path=/; expires=Fri, 31 Dec 1999 23:59:59 GMT;`;

      }
      if (noAuthRoutes.includes(pathname || "")) {
        router.push("/");
      }
    }
  }, [storage?.auth_token]);

  useEffect(() => {
    getStorage();
  }, []);

  return (
    <QueryClientProvider client={client}>
      <ReactQueryStreamedHydration>
        {storage && children}
      </ReactQueryStreamedHydration>
      <ReactQueryDevtools initialIsOpen={false} position="right" />
    </QueryClientProvider>
  );
}

export default Providers;
