"use client"

import { storageAtom } from "@/store";
import { useAtom } from "jotai";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const [storage] = useAtom(storageAtom);

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-[300px] flex flex-col gap-4">
        <div>
          <img
            src={(storage.theme || storage.preferedTheme) === 0 ? (process.env.NEXT_PUBLIC_LOGO_URL || "/logo_text.svg") : (process.env.NEXT_PUBLIC_LOGO_DARK_URL || "/logo_white.svg")}
            alt="Logo"
            className="w-full object-contain"
          />
        </div>
        {children}
      </div>
    </div>
  );
}
