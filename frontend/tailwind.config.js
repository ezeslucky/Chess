/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "amber": {
          800: "#B58863",
          500: "#F0D9B5"
        },
        "green": {
          800: "#739552",
          200: "#EBECD0"
        }
      }
    },
  },
  plugins: [],
}

