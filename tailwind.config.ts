import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#060b13",
        panel: "#0e1726",
        primary: "#22d3ee",
        accent: "#60a5fa",
        muted: "#334155"
      }
    }
  },
  plugins: [],
};

export default config;
