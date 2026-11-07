import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: { DEFAULT: "1rem", sm: "1.5rem", lg: "2rem" }, screens: { "2xl": "1280px" } },
    extend: {
      colors: {
        lime: { DEFAULT: "#80C83F", light: "#A6E06B", dark: "#5E9A27", soft: "#E6F4D8", ink: "#2F5410" },
        ink: "#050505",
        charcoal: "#1D1D1D",
        mist: "#F5F7F4",
        line: { DEFAULT: "#E3E7E0", dark: "#2A2A2A" },
        muted: { DEFAULT: "#4B5049", dark: "#A3A3A3" },
      },
      fontFamily: {
        sans: ["var(--font-geist)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: { tightest: "-0.035em" },
      borderRadius: { "4xl": "2rem" },
    },
  },
  plugins: [],
};

export default config;
