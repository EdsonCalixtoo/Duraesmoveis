import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        dark: {
          base: "#080808",
          surface: "#111111",
          card: "#1C1C1C",
          "card-hover": "#252525",
          border: "#303030",
          "border-subtle": "#222222",
          muted: "#A3A3A3",
          light: "#FFFFFF",
        },
        lime: {
          primary: "#8CF000",
          hover: "#A3FF12",
          glow: "rgba(140, 240, 0, 0.2)",
          subtle: "rgba(140, 240, 0, 0.1)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "lime-glow": "0 0 20px -2px rgba(140, 240, 0, 0.35)",
        "lime-sm": "0 0 10px rgba(140, 240, 0, 0.25)",
        "card-elevation": "0 10px 30px -10px rgba(0, 0, 0, 0.7)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
