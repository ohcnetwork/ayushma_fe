"use client";

import SideBar from "@/components/sidebar";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarExpanded, setSidebarExpanded] = useState(false);

  const { project_id } = useParams();

  function toggleSidebar() {
    setSidebarExpanded(!isSidebarExpanded);
  }
  return (
    <div className="inset-0 bg-[url(/blurred.png),linear-gradient(var(--ayushma-primary),var(--ayushma-secondary))]">
      <button
        onClick={toggleSidebar}
        type="button"
        className={`${isSidebarExpanded ? "hidden" : "block"
          } absolute h-12 md:hidden items-center ml-3 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-200 dark:focus:ring-gray-200`}
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
          <SideBar project_id={project_id} />
        </div>

        <div
          className={`overflow-auto w-full h-screen flex-1 bg-cover bg-center`}
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