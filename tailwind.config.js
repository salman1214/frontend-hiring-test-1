/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#4F46F8',
        'secondary': "#F8F8F8",
      },
    },
  },
  plugins: [],
}

