import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // OPUS palette — see docs/whitepaper.md and src/styles/tokens.css
        "opus-black":  "#000000",
        "opus-bone":   "#F2EFE6",
        "opus-silver": "#BEBCB4",
        "opus-dim":    "#787870",
        "opus-gold":   "#D4AF7A",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Cormorant Garamond", "Georgia", "serif"],
        display: ["var(--font-cinzel)", "Cinzel", "Trajan Pro", "serif"],
        sans: ["var(--font-inter)", "Inter", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-jetbrains)", "JetBrains Mono", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        wider: "0.08em",
        widest: "0.18em",
        ritual: "0.32em",
      },
      animation: {
        "heartbeat": "heartbeat 1.2s ease-in-out infinite",
        "drift": "drift 60s linear infinite",
      },
      keyframes: {
        heartbeat: {
          "0%, 100%": { opacity: "0.45", transform: "scale(1)" },
          "50%":      { opacity: "1.00", transform: "scale(1.06)" },
        },
        drift: {
          "0%":   { transform: "translate3d(0, 0, 0)" },
          "100%": { transform: "translate3d(-2%, -2%, 0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
