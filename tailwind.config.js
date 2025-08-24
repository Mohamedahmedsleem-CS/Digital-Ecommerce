/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // background: "var(--background)",
        // foreground: "var(--foreground)",
        primary: "#08D9D6",
        cream: "#FFFBDE",
      },
      fontFamily:{
         roboto: ['var(--font-roboto)'],
         open_sans: ['var(--font-sans)'],
         cairo: ['var(--font-cairo)', 'sans-serif']
      }
    },
  },
  plugins: [],
};
