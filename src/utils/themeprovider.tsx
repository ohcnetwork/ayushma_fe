import { useAtom } from "jotai";
import { useEffect } from "react";
import { Storage } from "@/types/storage";
import { setTheme, useThemeDetector } from "./themes";
import { storageAtom } from "@/store";
import { THEMES } from "./constants";

export default function ThemeProvider(props: {
    children: React.ReactNode,
    initialStorage?: Storage,
}) {

    const isDark = useThemeDetector();
    const { children, initialStorage } = props;
    const [dynstorage, setStorage] = useAtom(storageAtom);

    const storage = dynstorage || initialStorage;

    useEffect(() => {
        setStorage((storage) => ({
            ...storage,
            preferredTheme: 0 // Prefer light theme
        }));
    }, [isDark]);

    useEffect(() => {
        if (typeof storage.theme === "number" || typeof storage.preferredTheme === "number") {
            setTheme(THEMES[(typeof storage.theme === "number" ? storage.theme : 0) as any]);
        }
    }, [storage.theme, storage.preferredTheme]);

    return children
}