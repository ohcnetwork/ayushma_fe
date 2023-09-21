import "./globals.css";
import Script from "next/script";
import Providers from "@/utils/provider";

export const metadata = {
  title: process.env.NEXT_PUBLIC_AI_NAME,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <Script src="https://www.writeroo.net/fawesome.js" />
      </head>
      <body className="font-inter">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
