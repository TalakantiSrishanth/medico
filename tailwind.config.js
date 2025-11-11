// tailwind.config.js
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // we'll toggle .dark on <html> or <body>
  theme: {
    extend: {
      colors: {
        medico: {
          50: "#f0fcfb",
          100: "#d9fbf6",
          500: "#0ea5a0",
          700: "#0b857f",
        },
      },
      backgroundImage: {
        "medical-hero": "url('/images/MedicalBackground.jpg')",
      },
      borderRadius: {
        xl: "1rem",
      },
      boxShadow: {
        soft: "0 8px 24px rgba(2,6,23,0.6)",
      },
    },
  },
  plugins: [],
};
