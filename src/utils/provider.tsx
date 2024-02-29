"use client";

import React, { useEffect } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useAtom } from "jotai";
import { storageAtom } from "@/store";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import AuthProvider from "./authprovider";
import { Storage } from "@/types/storage";
import { useHydrateAtoms } from "jotai/utils";
import ThemeProvider from "./themeprovider";

function Providers(props: {
  children: React.ReactNode;
  initialStorage: Storage;
}) {

  const { children, initialStorage } = props;

  const [client] = React.useState(
    new QueryClient({ defaultOptions: { queries: { staleTime: 5000 } } }),
  );

  const [storage, setStorage] = useAtom(storageAtom);

  useHydrateAtoms([
    [storageAtom, initialStorage || {}]
  ])

  useEffect(() => {
    const currentHostName = window.location.hostname;
    document.cookie = `${process.env.NEXT_PUBLIC_COOKIE_STORAGE}=${JSON.stringify(
      storage
    )}; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT; domain=${process.env.NEXT_PUBLIC_COOKIE_DOMAIN
      ? process.env.NEXT_PUBLIC_COOKIE_DOMAIN
      : currentHostName
      }`;
  }, [storage]);

  return (
    <QueryClientProvider client={client}>
      <AuthProvider>
        <ThemeProvider>
          <ReactQueryStreamedHydration>
            {storage && children}
          </ReactQueryStreamedHydration>
        </ThemeProvider>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} position="right" />
    </QueryClientProvider>
  );
}

export default Providers;
