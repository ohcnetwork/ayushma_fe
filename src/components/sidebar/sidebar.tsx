"use client";

import { CheckBox, Input } from "../ui/interactive";
import { ReactNode, useState } from "react";
import { storageAtom } from "@/store";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import Modal from "../modal";
import Slider from "../ui/slider";

export default function SideBar(props: { children: ReactNode }) {
  const { children } = props;

  const [storage, setStorage] = useAtom(storageAtom);
  const router = useRouter();

  const [settingsModal, setSettingsModal] = useState(false);

  const onSettingsClose = () => {
    setSettingsModal(false);
  };

  const buttons = [
    {
      icon: "user-circle",
      text: "Profile",
      onclick: () => {
        router.push("/profile");
      },
    },
    {
      icon: "cog",
      text: "Settings",
      onclick: () => {
        setSettingsModal(true);
      },
    },
    ...(storage?.user?.is_staff
      ? [
          {
            icon: "user-shield",
            text: "Admin",
            onclick: () => {
              router.push("/admin");
            },
          },
        ]
      : []),
    {
      icon: "sign-out-alt",
      text: "Logout",
      onclick: () =>
        setStorage({ ...storage, user: undefined, auth_token: undefined }),
    },
  ];

  return (
    <>
      <div className="bg-white bg-cover bg-top w-64 shrink-0 flex flex-col justify-between border-r border-gray-300 h-screen">
        <div className="flex flex-col p-2 gap-2">
          <div className="h-6 flex gap-2 items-center my-4 justify-center">
            <img src="/ayushma_text.svg" alt="Logo" className="h-full" />
            <div className="text-xs">Beta</div>
          </div>
          {children}
        </div>
        <div className="p-2">
          <div className="flex gap-2">
            {buttons.map((button, i) => (
              <button
                key={i}
                onClick={button.onclick}
                className="flex-1 py-2 px-4 border flex flex-col rounded-lg items-center text-lg justify-center hover:bg-gray-100 border-gray-200"
              >
                <i className={`fal fa-${button.icon}`} />
              </button>
            ))}
          </div>
        </div>
      </div>
      <Modal onClose={onSettingsClose} show={settingsModal}>
        <div>
          Your Open AI API key
          <Input
            type="text"
            placeholder="OpenAI key"
            value={storage?.openai_api_key}
            onChange={(e) =>
              setStorage({
                ...storage,
                openai_api_key: e.target.value,
              })
            }
          />
          <br />
          <br />
          {storage?.user?.allow_key && (
            <div>
              <CheckBox
                label="Override key"
                type="checkbox"
                checked={storage?.override_api_key}
                onChange={(e) =>
                  setStorage({
                    ...storage,
                    override_api_key: e.target.checked,
                  })
                }
              />
              {storage?.override_api_key && (
                <p className="text-gray-700 text-xs">
                  Your key will be used instead of Ayushma&apos;s Key
                </p>
              )}
            </div>
          )}
          <br />
          <CheckBox
            label="Show stats for nerds"
            type="checkbox"
            checked={storage?.show_stats}
            onChange={(e) =>
              setStorage({
                ...storage,
                show_stats: e.target.checked,
              })
            }
          />
          <br />
          <CheckBox
            label="Show Original English Responses"
            type="checkbox"
            checked={storage?.show_english}
            onChange={(e) =>
              setStorage({
                ...storage,
                show_english: e.target.checked,
              })
            }
          />
          <br />
          <br />
          Chat Temperature
          <br />
          <Slider
            left="More Factual"
            right="More Creative"
            value={storage?.temperature || 0.1}
            step={0.1}
            max={1}
            onChange={(val) =>
              setStorage({
                ...storage,
                temperature: val,
              })
            }
          />
          <br />
          <br />
          References
          <br />
          <Slider
            left="Short and Crisp"
            right="Long and Detailed"
            value={storage?.top_k || 100}
            step={1}
            max={100}
            onChange={(val) =>
              setStorage({
                ...storage,
                top_k: val,
              })
            }
          />
        </div>
      </Modal>
    </>
  );
}
