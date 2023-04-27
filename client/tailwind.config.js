/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,node_modules/react-daisyui/dist/**/*.js,node_modules/daisyui/dist/**/*.js}",
  ],
  darkMode: "media",
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
};
