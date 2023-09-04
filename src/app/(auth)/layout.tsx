export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[url('/bg.png')] bg-cover bg-center h-screen flex items-center justify-center">
      <div className="w-64 flex flex-col gap-4">
        <div>
          <img
            src={process.env.NEXT_PUBLIC_LOGO_URL ?? "/logo_text.svg"}
            alt="Logo"
            className="w-full object-contain"
          />
        </div>
        <br />
        {children}
      </div>
    </div>
  );
}
