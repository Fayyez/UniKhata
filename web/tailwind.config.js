/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",  // ← This is critical
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
