/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        pine: "#16311F",
        pine2: "#1F4429",
        moss: "#4C7C4A",
        mosslight: "#8FB08C",
        clay: "#C97A3D",
        mist: "#F4F7F2",
        sage: "#6E7B6E",
      },
    },
  },
  plugins: [],
};