 /** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#2563eb',
        'primary-dark': '#1d4ed8',
        'secondary': '#16a34a',
        'accent': '#f59e0b',
        'dark': '#111827', // Darker for more contrast
        'light-gray': '#f3f4f6',
      },
      fontFamily: {
        // Adding professional fonts
        sans: ['Inter', 'sans-serif'],
        heading: ['Lexend', 'sans-serif'],
      }
    },
  },
  plugins: [],
}