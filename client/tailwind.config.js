/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f3faf7",
          100: "#d9f2e8",
          200: "#b3e5d2",
          300: "#7dd1b4",
          400: "#49b792",
          500: "#2c9a77",
          600: "#1f7b5f",
          700: "#19624d",
          800: "#154f3f",
          900: "#133f34"
        }
      }
    }
  },
  plugins: []
};
