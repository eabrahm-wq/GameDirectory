import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        index: {
          bg: "#f4f4f0",
          paper: "#fffefb",
          ink: "#14201b",
          muted: "#3f4d46",
          line: "#cdd5cd",
          accent: "#2a5645",
          accentSoft: "#e3ece6",
        },
      },
      boxShadow: {
        card: "0 1px 2px rgba(12,18,15,0.05)",
      },
    },
  },
  plugins: [],
};

export default config;
