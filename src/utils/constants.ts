import { Theme } from "@/types/themes";

export const supportedLanguages = [
  { value: "bn", label: "Bengali", nativeLabel: "বাংলা" },
  { value: "en", label: "English", nativeLabel: "English" },
  { value: "gu", label: "Gujarati", nativeLabel: "ગુજરાતી" },
  { value: "hi", label: "Hindi", nativeLabel: "हिन्दी" },
  { value: "kn", label: "Kannada", nativeLabel: "ಕನ್ನಡ" },
  { value: "ml", label: "Malayalam", nativeLabel: "മലയാളം" },
  { value: "mr", label: "Marathi", nativeLabel: "मराठी" },
  { value: "pa", label: "Punjabi", nativeLabel: "ਪੰਜਾਬੀ" },
  { value: "ta", label: "Tamil", nativeLabel: "தமிழ்" },
  { value: "te", label: "Telugu", nativeLabel: "తెలుగు" },
];

export const THEMECOMMONS = {
  accent: "#44c54d",
  accentActive: "#2aa733",
  accentFade: "rgba(42, 167, 50, 0.322)",
  font: "manrope",
  fontBold: "manrope-bold",
  warning: "yellow",
  backdropFilter: "blur(40px)",
};

export const THEMES: Theme[] = [
  {
    name: "light",
    scheme: {
      ...THEMECOMMONS,
      primary: "white",
      primaryFont: "black",
      primaryLightfont: "#464646",
      secondary: "#e9e9e9",
      secondaryActive: "#dbdbdb",
      primaryOpaque: "rgba(255, 255, 255, 0.5)",
      primaryDarkOpaque: "rgba(255, 255, 255, 0.7)",
      lightOpaque: "rgba(0, 0, 0, 0.05)",
      opaque: "rgba(0, 0, 0, 0.2)",
      opaqueActive: "rgba(0, 0, 0, 0.3)",
      tertiaryBorderColor:"#9E9E9E",
      tertiaryTextColor:"5C5C5C"
    },
    lowHardware: {
      backdropFilter: "none",
      primaryOpaque: "rgba(255, 255, 255, 0.950)",
    },
    type: "light",
  },
  {
    name: "dark",
    scheme: {
      ...THEMECOMMONS,
      primary: "#000",
      primaryFont: "#eeeeee",
      primaryLightfont: "#b8b8b8",
      secondary: "#181818",
      secondaryActive: "#292929",
      primaryOpaque: "rgba(8, 8, 8, 0.5)",
      primaryDarkOpaque: "rgba(8, 8, 8, 0.7)",
      lightOpaque: "rgba(255, 255, 255, 0.05)",
      opaque: "rgba(255, 255, 255, 0.200)",
      opaqueActive: "rgba(255, 255, 255, 0.300)",
      tertiaryBorderColor:"white",
      tertiaryTextColor:"5C5C5C"
    },
    lowHardware: {
      backdropFilter: "none",
      primaryOpaque: "rgba(8, 8, 8, 0.95)",
    },
    type: "dark",
  },
];