"use client";

import { usePathname, useRouter } from 'next/navigation'
import './globals.css'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { API } from '@/utils/api'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { storageAtom } from '@/store'

const noAuthRoutes = ['/login', '/register', '/forgot-password', '/reset-password']

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const router = useRouter()
  const pathname = usePathname()

  const [storage, setStorage] = useAtom(storageAtom);
  const queryClient = new QueryClient()

  const getStorage = async () => {
    const storage = localStorage.getItem("w-storage");
    if (storage) {
      setStorage(JSON.parse(storage));
    } else {
      setStorage({ auth_token: "" });
    }
  }

  useEffect(() => {
    if (!storage) return;
    localStorage.setItem(process.env.NEXT_PUBLIC_LOCAL_STORAGE || "storage", JSON.stringify(storage))
  }, [storage])

  const getUserDetails = async () => {
    if (storage?.auth_token) {
      try {
        const user = await API.user.me();
        setStorage({
          ...storage,
          user: {
            ...storage.user,
            ...user
          }
        })
      } catch (error) {
        console.log(error);
        console.log("Removing storage")
        setStorage({
          ...storage,
          //user: undefined,
          //auth_token: undefined
        })
      }
    }
  }

  useEffect(() => {
    if (storage === null) return;
    if (storage?.auth_token) {
      getUserDetails()
    } else {
      if (!noAuthRoutes.includes(pathname)) {
        router.push('/login')
      }
    }
  }, [storage?.auth_token])

  useEffect(() => {
    getStorage();
  }, []);

  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  )
}
