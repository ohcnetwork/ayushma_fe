"use client";

import "./globals.css";
import Script from "next/script";
import Providers from "@/utils/provider";
import { Storage } from "@/types/storage";
import { Theme } from "@/types/themes";
import { THEMECOMMONS, THEMES } from "@/utils/constants";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { storageAtom } from "@/store";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [storage, setStorage] = useAtom(storageAtom);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const preferences = localStorage.getItem("preferences");
    if (preferences) {
      setStorage(JSON.parse(preferences));
    }
    setLoading(false);
  }, []);

  // Function to derive CSS variables from theme
  const getThemeVariables = (theme: Theme) => {
    const themeMain = theme.scheme;
    const themeVars = {
      ...themeMain,
      ...THEMECOMMONS,
    };
    let cssVars: any = {};
    for (const property in themeVars) {
      const val = themeVars[property as keyof typeof themeVars];
      cssVars["--w-" + property] = val;
    }
    return cssVars;
  };

  // Fallback logic for theme selection
  const theme = storage?.theme || storage?.preferredTheme || 0;
  const themeVars = getThemeVariables(THEMES[theme]);

  return (
    <html lang="en" style={{ ...themeVars }}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <Script src="https://www.writeroo.net/fawesome.js" />
      </head>
      <body className="font-inter bg-primary text-primaryFont">
        {loading ? (
          <div className="flex items-center h-screen justify-center overflow-hidden">
            <div className="w-4 h-4 mr-2 rounded-full bg-gray-900 animate-pulse"></div>
            <div className="w-4 h-4 mr-2 rounded-full bg-gray-900 animate-pulse"></div>
            <div className="w-4 h-4 rounded-full bg-gray-900 animate-pulse"></div>
          </div>
        ) : (
          <Providers initialStorage={storage}>{children}</Providers>
        )}
      </body>
    </html>
  );
}
