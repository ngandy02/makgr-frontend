/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#394A56", // Dark blue-gray
        secondary: "#EFEFEB", // Light gray
        white: "#FFFFFF", // Pure white
      },
    },
  },
  plugins: [],
};
