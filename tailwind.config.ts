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
          950: "#06070A",
          900: "#0B0D12",
          800: "#11141B",
          700: "#191D26",
          600: "#242935",
          500: "#3A4150",
        },
        mist: {
          50: "#F5F7FA",
          100: "#E6EAF1",
          200: "#C9D1DE",
          300: "#9AA4B5",
          400: "#6B7589",
        },
        ember: {
          400: "#FF8A4C",
          500: "#FF6A1F",
          600: "#E5500A",
        },
        jade: {
          400: "#3DDC97",
          500: "#1FB87A",
        },
        violet: {
          400: "#9C8CFF",
          500: "#7C6BFF",
        },
        amber: {
          400: "#F4C756",
        },
      },
      fontFamily: {
        display: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,0.04), 0 8px 30px rgba(0,0,0,0.35)",
        ring: "inset 0 0 0 1px rgba(255,255,255,0.06)",
      },
    },
  },
  plugins: [],
};
export default config;
