import LayoutClient from "./layout-client";

export default function Layout({ children }: { children: React.ReactNode }) {

  return (
    <>
      <div className="flex">
        <LayoutClient />
        <div className="py-4 w-full h-screen overflow-auto ">
          <div
            className={`w-full flex-1 bg-cover bg-center bg-gray-100 border border-gray-200 border-r-0 rounded-l-xl`}
            id="main-screen"
          >
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
