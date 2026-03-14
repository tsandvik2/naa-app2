import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#000000",
        surface: "#0a0a0f",
        card: "#111118",
        card2: "#161622",
        brand: {
          red: "#ff2d55",
          orange: "#ff6b00",
          yellow: "#ffd60a",
          green: "#00e676",
          cyan: "#00f0ff",
          purple: "#bf5af2",
          snap: "#fffc00",
        },
        text2: "rgba(235, 235, 245, 0.8)",
        muted: "#55556a",
        border: "rgba(255, 255, 255, 0.063)",
      },
      fontFamily: {
        bebas: ["var(--font-bebas)", "sans-serif"],
        jakarta: ["var(--font-jakarta)", "sans-serif"],
        sans: ["var(--font-jakarta)", "sans-serif"],
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #ff2d55, #ff6b00)",
        "gradient-logo": "linear-gradient(135deg, #ff2d55, #ff6b00, #ffd60a)",
      },
      animation: {
        "slide-up": "slideUp 0.32s cubic-bezier(0.16, 1, 0.3, 1)",
        "glow-pulse": "glow 3s ease-in-out infinite",
        boing: "boing 1.1s infinite",
        "mesh1": "d1 12s ease-in-out infinite",
        "mesh2": "d2 15s ease-in-out infinite",
        "mesh3": "d3 10s ease-in-out infinite",
        "timer-pulse": "timerPulse 1s ease-in-out infinite",
        "scale-in": "scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "sheet-up": "sheetUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in": "fadeIn 0.3s ease",
        "tick-pop": "tickPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "count-pop": "countPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "rec-blink": "recBlink 1s ease-in-out infinite",
        shine: "shine 3s infinite",
      },
      keyframes: {
        slideUp: {
          from: { opacity: "0", transform: "translateY(18px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        glow: {
          "0%, 100%": { opacity: "0.25" },
          "50%": { opacity: "0.5" },
        },
        boing: {
          "0%, 60%, 100%": { transform: "translateY(0)" },
          "30%": { transform: "translateY(-14px)" },
        },
        d1: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(40px, 30px)" },
        },
        d2: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(-30px, -20px)" },
        },
        d3: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(20px, -25px)" },
        },
        timerPulse: {
          "0%, 100%": { boxShadow: "none" },
          "50%": { boxShadow: "0 0 20px rgba(255, 45, 85, 0.3)" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.7)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        sheetUp: {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        tickPop: {
          "0%": { transform: "scale(0.8)" },
          "100%": { transform: "scale(1)" },
        },
        countPop: {
          from: { transform: "scale(0.4)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "1" },
        },
        recBlink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        shine: {
          "0%": { transform: "translateX(-200%)" },
          "100%": { transform: "translateX(200%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
