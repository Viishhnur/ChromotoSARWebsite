/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",                // Ensures Tailwind scans your root HTML
    "./src/**/*.{js,ts,jsx,tsx}"   // Scans all JS, TS, JSX, and TSX files in src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
