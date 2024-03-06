import { Theme } from "@/types/themes";
import { useEffect, useState } from "react";
import { THEMECOMMONS } from "./constants";

export const setTheme = (themeMain: Theme) => {
    //const themeMain = Themes.filter(t => t.name === themeName)[0];
    const theme = {
        ...themeMain.scheme,
        ...THEMECOMMONS,
    };
    for (const property in theme) {
        const val = theme[property as keyof typeof theme];
        document.documentElement.style.setProperty("--w-" + property, val);
    }
    //if(LoadEnv().lowhardware){
    //    const lowTheme = themeMain.lowHardware;
    //    for (const property in lowTheme){
    //        const val = lowTheme[property as keyof typeof lowTheme];
    //        document.documentElement.style.setProperty('--'+property, val);
    //    }
    //}
};

export const useThemeDetector = () => {
    const getCurrentTheme = () => window?.matchMedia("(prefers-color-scheme: dark)")?.matches;
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const mqListener = ((e: any) => {
        setIsDarkTheme(e.matches);
    });

    useEffect(() => {
        setIsDarkTheme(getCurrentTheme());
        const darkThemeMq = window?.matchMedia("(prefers-color-scheme: dark)");
        darkThemeMq.addListener(mqListener);
        return () => darkThemeMq.removeListener(mqListener);
    }, []);
    return isDarkTheme;
}