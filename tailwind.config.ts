import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#F6F4EE",
        panel: "#FFFDF8",
        primary: "#3B82F6",
        accent: "#D4A84F",
        muted: "#6B7280",
        ink: "#1C2430",
      },
    },
  },
  plugins: [],
};

export default config;
