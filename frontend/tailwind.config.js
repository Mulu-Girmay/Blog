/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // 📰 Magazine Color Palette
        paper: {
          DEFAULT: "#FDF6E3",
          dark: "#F5ECD7",
          light: "#FFFBF0",
        },
        ink: {
          DEFAULT: "#2C2C2C",
          light: "#4A4A4A",
          lighter: "#6B6B6B",
        },
        burgundy: {
          DEFAULT: "#8B3A3A",
          light: "#A05252",
          dark: "#6B2A2A",
        },
        gold: {
          DEFAULT: "#B8860B",
          light: "#D4A017",
          dark: "#8B6B00",
        },
        cream: "#FFF8EE",
        navy: "#1A2A3A",
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        body: ["Mercury", "Georgia", "serif"],
        sans: ["Inter", "sans-serif"],
      },
      fontSize: {
        "7xl": "4.5rem",
        "8xl": "5.5rem",
      },
      backgroundImage: {
        "paper-texture": "url('/paper-texture.png')",
      },
      boxShadow: {
        magazine: "0 4px 20px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.08)",
        "magazine-hover":
          "0 8px 30px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
        card: "0 2px 12px rgba(0,0,0,0.04)",
      },
      typography: {
        DEFAULT: {
          css: {
            color: "#2C2C2C",
            maxWidth: "none",
            "h1, h2, h3, h4": {
              fontFamily: '"Playfair Display", Georgia, serif',
            },
          },
        },
      },
    },
  },
  plugins: [],
};
