/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
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
        primary: "var(--ayushma-primary)",
        primaryOpaque: "var(--ayushma-primaryOpaque)",
        secondary: "var(--ayushma-secondary)",
        secondaryActive: "var(--ayushma-secondaryActive)",
        secondaryOpaque: "var(--ayushma-secondaryOpaque)",
        primaryFont: "var(--ayushma-primaryFont)",
      },
    },
  },
  plugins: [],
}
