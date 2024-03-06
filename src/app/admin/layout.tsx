"use client";

import AdminSideBar from "@/components/sidebar/adminSidebar";
import { storageAtom } from "@/store";
import { useAtom } from "jotai";
import { useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarExpanded, setSidebarExpanded] = useState(false);
  const [storage, setStorage] = useAtom(storageAtom);

  function toggleSidebar() {
    setSidebarExpanded(!isSidebarExpanded);
  }
  // if (!storage?.user?.is_staff)
  //   return (
  //     <div className="flex justify-center items-center w-full font-bold text-3xl p-4">
  //       You are not authorized to view this page.
  //     </div>
  //   );

  return (
    <div className="inset-0 bg-secondary">
      <button
        onClick={toggleSidebar}
        type="button"
        className={`${isSidebarExpanded ? "hidden" : "block"
          } absolute h-12 md:hidden items-center ml-3 text-sm text-gray-500 rounded-lg hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-secondaryActive dark:text-gray-400 dark:hover:bg-secondaryActive dark:focus:ring-secondaryActive`}
      >
        <span className="sr-only">Open sidebar</span>
        <div className="space-y-1">
          <span className="block w-6 h-0.5 bg-gray-600"></span>
          <span className="block w-6 h-0.5 bg-gray-600"></span>
          <span className="block w-4 h-0.5 bg-gray-600"></span>
        </div>
      </button>
      <div className="inset-0 flex">
        <div
          className={`${isSidebarExpanded
            ? "translate-x-0 absolute"
            : "-translate-x-full absolute"
            } md:translate-x-0 md:contents items-stretch z-40 md:z-0 duration-200 ease-in-out h-screen`}
        >
          <AdminSideBar />
        </div>

        <div
          className={`p-10 m-auto overflow-auto w-full h-screen flex-1 bg-cover bg-center`}
          onClick={() => {
            if (isSidebarExpanded) setSidebarExpanded(false);
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
