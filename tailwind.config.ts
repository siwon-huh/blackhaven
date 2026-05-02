import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          0: "#FFFFFF",
          50: "#F4F5F7",
          100: "#E7E9ED",
          200: "#C9CDD4",
          300: "#9AA0AB",
          400: "#6E7480",
          500: "#4D525B",
          600: "#363A42",
          700: "#23262C",
          800: "#15171C",
          900: "#0C0E12",
          950: "#06070A",
        },
        signal: {
          DEFAULT: "#3DDC97",
          soft: "#3DDC9720",
          line: "#3DDC9740",
        },
        warn: {
          DEFAULT: "#F4C756",
          soft: "#F4C75620",
          line: "#F4C75640",
        },
        critical: {
          DEFAULT: "#FF6A4A",
          soft: "#FF6A4A20",
          line: "#FF6A4A40",
        },
        mist: {
          50: "#F4F5F7",
          100: "#E7E9ED",
          200: "#C9CDD4",
          300: "#9AA0AB",
          400: "#6E7480",
          500: "#4D525B",
        },
        jade: {
          400: "#3DDC97",
          500: "#1FB87A",
        },
        amber: {
          400: "#F4C756",
        },
        ember: {
          400: "#FF8A4C",
          500: "#FF6A4A",
        },
        violet: {
          400: "#9AA0AB",
          500: "#6E7480",
        },
      },
      fontFamily: {
        display: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,0.04), 0 8px 30px rgba(0,0,0,0.35)",
        ring: "inset 0 0 0 1px rgba(255,255,255,0.06)",
        accent:
          "0 0 0 1px rgba(61,220,151,0.15), 0 8px 30px rgba(61,220,151,0.06)",
      },
    },
  },
  plugins: [],
};
export default config;
