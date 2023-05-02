"use client";

import { usePathname, useRouter } from 'next/navigation'
import './globals.css'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { API } from '@/utils/api'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { storageAtom } from '@/store'
import Script from 'next/script';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Providers from '@/utils/provider';
import { setTheme, useThemeDetector } from '@/utils/themes';

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
  const isDark = useThemeDetector();

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
      storage?.theme ? setTheme(storage.theme) : setTheme(isDark ? "dark" : "light");
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
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <title>
          Ayushma
        </title>
        <Script src="https://www.writeroo.in/inc/lib/fawesome.js" />
      </head>
      <body className='font-inter'>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
