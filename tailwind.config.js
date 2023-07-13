/** @type {import('tailwindcss').Config} */
const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      freshman: ["Freshman", ...fontFamily.sans],
    },
    extend: {
      colors: {
        background: "#fff0e6",
        green: {
          50: "#DAFBF4",
          100: "#BAF7EB",
          200: "#71EFD6",
          300: "#2CE7C2",
          400: "#14B393",
          500: "#0C6B58",
          600: "#0A5748",
          700: "#074035",
          800: "#052922",
          900: "#031713",
          950: "#010908",
        },
        purple: "#580C6B",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
