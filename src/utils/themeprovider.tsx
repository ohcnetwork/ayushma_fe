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
            preferedTheme: isDark ? 1 : 0
        }));
    }, [isDark]);

    useEffect(() => {
        if (typeof storage.theme === "number" || typeof storage.preferedTheme === "number") {
            setTheme(THEMES[(typeof storage.theme === "number" ? storage.theme : (typeof storage.preferedTheme === "number" ? storage.preferedTheme : undefined)) as any]);
        }
    }, [storage.theme, storage.preferedTheme]);

    return children
}