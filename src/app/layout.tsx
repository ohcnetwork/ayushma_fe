import "./globals.css";
import Script from "next/script";
import Providers from "@/utils/provider";
import { cookies } from "next/headers";
import { Storage } from "@/types/storage";
import { Theme } from "@/types/themes";
import { THEMECOMMONS, THEMES } from "@/utils/constants";

export const metadata = {
  title: process.env.NEXT_PUBLIC_AI_NAME,
  description: process.env.NEXT_PUBLIC_AI_DESCRIPTION || "Revolutionizing medical diagnosis through AI and Opensource",
  metadataBase: new URL(process.env.NEXT_PUBLIC_DOMAIN ?
    'https://' + process.env.NEXT_PUBLIC_DOMAIN :
    "http://localhost:3000"
  ),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const cookieStore = cookies()
  const jsonstorage = cookieStore.get(process.env.NEXT_PUBLIC_COOKIE_STORAGE || "storage")?.value

  const storage: Storage = JSON.parse(jsonstorage || "{}")

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
  }

  const theme = storage?.theme || storage.preferedTheme || 0;
  const themeVars = getThemeVariables(THEMES[theme])

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
        <Providers initialStorage={storage}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
