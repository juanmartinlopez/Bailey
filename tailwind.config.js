/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          red: "#994D4D",
        },
        text: {
          dark: "#374151", // gris oscuro para títulos
          light: "#6B7280", // gris más claro para texto secundario
        },
      },
    },
  },
  plugins: [],
};
