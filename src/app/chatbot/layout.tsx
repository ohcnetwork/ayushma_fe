import Script from "next/script";

export default function Layout(props: { children: React.ReactNode }) {

    const { children } = props;

    return (
        <>
            <Script src="/chatbot/index.cjs.js" strategy="beforeInteractive" />
            {children}
        </>
    )
}