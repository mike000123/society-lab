import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Semantic tokens (dark defaults; light theme overrides via globals.css)
        background: "#060b13",
        panel:      "#0e1726",
        primary:    "#22d3ee",
        accent:     "#60a5fa",
        muted:      "#334155",
        // Harvard Crimson palette
        crimson: {
          "50":  "#fef2f3",
          "100": "#fde8ea",
          "200": "#fbd5d9",
          "300": "#f6acb4",
          "400": "#ef7987",
          "500": "#e4495a",
          "600": "#ce2b3f",
          "700": "#a51c30",
          "800": "#8b1a2b",
          "900": "#771926",
          "950": "#460d16",
        },
      },
    },
  },
  plugins: [],
};

export default config;
