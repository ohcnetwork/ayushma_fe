"use client";

import { storageAtom } from "@/store";
import { useAtom } from "jotai";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
// import x from "../../../public/device-laptop"
export default function AdminSideBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [storage, setStorage] = useAtom(storageAtom);

  const links = [
    {
      text: "Projects",
      url: "/admin",
      icon: "cube",
    },
    {
      text: "Users",
      url: "/admin/users",
      icon: "users",
    },
    {
      text: "Tests",
      url: "/admin/tests",
      icon: "wrench",
    },
  ];

  const buttons = [
    {
      icon: "home",
      text: "Ayushma",
      onclick: () => {
        router.push("/");
      },
    },
    {
      icon: "sign-out-alt",
      text: "Logout",
      onclick: () =>
        setStorage({ ...storage, user: undefined, auth_token: undefined }),
    },
  ];
  return (
    <>
      <div className="bg-primary bg-cover bg-top w-64 shrink-0 flex flex-col justify-between border-r border-gray-300 h-screen">
        <div className="flex flex-col p-2 gap-2">
          <div className="cursor-pointer p-3 flex flex-col items-end justify-center">
            <img
              src={process.env.NEXT_PUBLIC_LOGO_URL ?? "/logo_text.svg"}
              alt="Logo"
              className="w-full h-full object-contain"
            />
            <div className="text-xs text-gray-600">Beta</div>
          </div>
          <div className="flex flex-col gap-2">
            {links.map((link, idx) => (
              <Link
                href={link.url}
                className={`flex gap-4 px-4 py-2 w-full group hover:bg-secondary border border-secondaryActive rounded-lg overflow-hidden items-center ${
                  pathname === link.url && "bg-secondary"
                }`}
                key={idx}
              >
                <i className={`fal fa-${link.icon}`} />
                <span>{link.text}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="p-2">
          <div className="flex gap-2">
            {buttons.map((button, i) => (
              <button
                key={i}
                onClick={button.onclick}
                className="flex-1 py-2 px-4 border flex flex-col rounded-lg items-center text-lg justify-center hover:bg-secondary border-secondaryActive"
              >
                <i className={`fal fa-${button.icon}`} />
              </button>
            ))}
              <select
                value={storage.theme}
                onChange={(e) => {
                  setStorage({
                    ...storage,
                    theme:
                      Number(e.target.value) === 2
                        ? undefined
                        : Number(e.target.value),
                  });
                }}
                className="border border-secondary rounded-lg bg-primary p-2 px-4"
              >
                <option value={2}>System</option>
                <option value={0}>
                  Light
                </option>
                <option value={1}>Dark</option>
              </select>
          </div>
        </div>
      </div>
    </>
  );
}