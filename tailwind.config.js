/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-red": "#994D4D",
        "secundary-red": "#9D1309",
        "text-dark": "#374151",
        "text-light": "#6B7280",
      },
    },
  },
  plugins: [],
};
