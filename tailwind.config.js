/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './chatbot/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      screens: {
        'xs': '370px',
      },
      colors: {
        gray: {
          50: "#FAFAFA",
          100: "#F5F5F5",
          200: "#EEEEEE",
          300: "#E0E0E0",
          400: "#BDBDBD",
          500: "#9D9D9D",
          600: "#716F6F",
          700: "#5C5C5C",
          800: "#373737",
          900: "#222222",
          950: "#1A1A1A",
        },
        accent: {
          50: '#f2fbf2',
          100: '#e0f8e1',
          200: '#c2f0c4',
          300: '#93e298',
          400: '#44c54d',
          500: '#35b23e',
          600: '#27922e',
          700: '#227328',
          800: '#1f5c24',
          900: '#1c4b21',
        },
        primary: "var(--w-primary)",
        primaryOpaque: "var(--w-primaryOpaque)",
        primaryDarkOpaque: "var(--w-primaryDarkOpaque)",
        secondary: "var(--w-secondary)",
        secondaryActive: "var(--w-secondaryActive)",
        secondaryOpaque: "var(--w-secondaryOpaque)",
        primaryFont: "var(--w-primaryFont)",
        primaryLightfont: "var(--w-primaryLightfont)",
        lightOpaque: "var(--w-lightOpaque)",
        opaque: "var(--w-opaque)",
        opaqueActive: "var(--w-opaqueActive)",
        tertiaryBorderColor:"var(--w-tertiaryBorderColor)",
        tertiaryTextColor:"var(--w-tertiaryTextColor)"
      },
    },
  },
  plugins: [],
}
