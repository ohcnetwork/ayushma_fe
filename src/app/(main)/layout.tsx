import SideBar from "@/components/sidebar";

export default function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen items-stretch">
            <SideBar />
            <div className="flex-1 bg-gray-100 overflow-auto">
                {children}
            </div>
        </div>
    )
}