/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          red: "var(--color-primary-red)",
          secundary: "var(--color-secundary-red)",
        },
        text: {
          dark: "var(--color-text-dark)",
          light: "var(--color-text-light)",
        },
      },
    },
  },
  plugins: [],
};
