import { useEffect, useState } from "react";

const commons = {

}

export const Themes = [
    {
        name: "light",
        displayName: "Light",
        scheme: {
            ...commons,
            primary: "white",
            primaryFont: "black",
            secondary: "#e9e9e9",
            secondaryActive: "#dbdbdb",
            primaryOpaque: "rgba(255, 255, 255, 0.5)",
            lightOpaque: "rgba(0, 0, 0, 0.05)",
            opaque: "rgba(0, 0, 0, 0.2)",
            opaqueActive: "rgba(0, 0, 0, 0.3)",
        },
        type: "light"
    },
    {
        name: "dark",
        displayName: "Dark",
        scheme: {
            ...commons,
            primary: "#000",
            primaryFont: "#eeeeee",
            secondary: "#181818",
            secondaryActive: "#292929",
            primaryOpaque: "rgba(8, 8, 8, 0.5)",
            lightOpaque: "rgba(255, 255, 255, 0.05)",
            opaque: "rgba(255, 255, 255, 0.200)",
            opaqueActive: "rgba(255, 255, 255, 0.300)",
        },
        type: "dark"
    }
]

export const setTheme = (themeName: string) => {
    const themeMain = Themes.filter(t => t.name === themeName)[0];
    const theme = themeMain.scheme;
    for (const property in theme) {
        const val = theme[property as keyof typeof theme];
        document.documentElement.style.setProperty('--ayushma-' + property, val);
    }
}

export const useThemeDetector = () => {
    const getCurrentTheme = () => window.matchMedia("(prefers-color-scheme: dark)").matches;
    const [isDarkTheme, setIsDarkTheme] = useState(getCurrentTheme());
    const mqListener = ((e: any) => {
        setIsDarkTheme(e.matches);
    });

    useEffect(() => {
        const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
        darkThemeMq.addListener(mqListener);
        return () => darkThemeMq.removeListener(mqListener);
    }, []);
    return isDarkTheme;
}