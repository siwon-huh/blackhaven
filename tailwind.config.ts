import type { Config } from "tailwindcss";

// Ink 색은 CSS variable 기반 RGB 로 정의해 라이트/다크 모드에서 자동 inversion 됩니다.
// signal / warn / critical 도 동일 패턴.
const ink = (k: string) => `rgb(var(--ink-${k}) / <alpha-value>)`;
const accent = (k: string) => `rgb(var(--${k}-rgb) / <alpha-value>)`;

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          0: ink("0"),
          50: ink("50"),
          100: ink("100"),
          200: ink("200"),
          300: ink("300"),
          400: ink("400"),
          500: ink("500"),
          600: ink("600"),
          700: ink("700"),
          800: ink("800"),
          900: ink("900"),
          950: ink("950"),
        },
        signal: {
          DEFAULT: accent("signal"),
          soft: accent("signal-soft"),
          line: accent("signal-line"),
        },
        warn: {
          DEFAULT: accent("warn"),
          soft: accent("warn-soft"),
          line: accent("warn-line"),
        },
        critical: {
          DEFAULT: accent("critical"),
          soft: accent("critical-soft"),
          line: accent("critical-line"),
        },
        // legacy aliases (compat with components that still reference these names)
        mist: {
          50: ink("50"),
          100: ink("100"),
          200: ink("200"),
          300: ink("300"),
          400: ink("400"),
          500: ink("500"),
        },
        jade: {
          400: accent("signal"),
          500: accent("signal"),
        },
        amber: {
          400: accent("warn"),
        },
        ember: {
          400: accent("critical"),
          500: accent("critical"),
        },
        violet: {
          400: ink("300"),
          500: ink("400"),
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
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      boxShadow: {
        glow:
          "0 0 0 1px rgb(var(--ink-200) / 0.04), 0 8px 30px rgb(var(--ink-950) / 0.35)",
        ring: "inset 0 0 0 1px rgb(var(--ink-200) / 0.06)",
        accent:
          "0 0 0 1px rgb(var(--signal-rgb) / 0.15), 0 8px 30px rgb(var(--signal-rgb) / 0.06)",
      },
    },
  },
  plugins: [],
};
export default config;
