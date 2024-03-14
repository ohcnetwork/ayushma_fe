export type Theme = {
    name: string;
    scheme: {
        primary: string;
        primaryFont: string;
        primaryLightfont: string;
        secondary: string;
        secondaryActive: string;
        primaryOpaque: string;
        primaryDarkOpaque: string;
        lightOpaque: string;
        opaque: string;
        opaqueActive: string;
    };
    lowHardware: {
        backdropFilter: string;
        primaryOpaque: string;
    };
    type: "light" | "dark";
};