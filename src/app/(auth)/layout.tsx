
export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="bg-[url('/bg.png')] bg-cover bg-center h-screen flex items-center justify-center">
            <div className="w-64 flex flex-col gap-4">
                {children}
            </div>
        </div>
    )
}