/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1F4B99",
        accent: "#00B8A9",
        surface: "#0F172A"
      }
    }
  },
  plugins: []
};
