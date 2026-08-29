import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Brand
        gold: "#DDA83F",
        "gold-bright": "#F0BC55",
        "powder-blue": "#CEDEEB",
        green: "#008037",
        "green-bright": "#35C46E",
        navy: "#2B5773",
        // Theme-aware tokens (see globals.css)
        canvas: "var(--canvas)",
        elevated: "var(--elevated)",
        surface: "var(--surface)",
        "surface-hi": "var(--surface-hi)",
        hairline: "var(--hairline)",
        "hairline-hi": "var(--hairline-hi)",
        ink: "var(--ink)",
        "ink-2": "var(--ink-2)",
        "ink-3": "var(--ink-3)",
        accent: "var(--accent)",
        "accent-ink": "var(--accent-ink)",
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
        serif: ["'Gentium Plus'", "Georgia", "serif"],
        devanagari: ["'Noto Serif Devanagari'", "serif"],
        script: ["'Kaushan Script'", "cursive"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
