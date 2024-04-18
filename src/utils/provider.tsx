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

function Providers(
  props: Readonly<{
    children: React.ReactNode;
    initialStorage: Storage;
  }>,
) {
  const { children, initialStorage } = props;

  const [client] = React.useState(
    new QueryClient({ defaultOptions: { queries: { staleTime: 5000 } } }),
  );

  const [storage, setStorage] = useAtom(storageAtom);

  useHydrateAtoms([[storageAtom, initialStorage || {}]]);

  useEffect(() => {
    if (JSON.stringify(storage) != "{}") {
      localStorage.setItem("preferences", JSON.stringify(storage));
    }
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
