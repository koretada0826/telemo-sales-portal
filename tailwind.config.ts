import type { Config } from "tailwindcss";

// TELEMOのテーマカラー・サイズ規約をTailwindに登録
const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#F7FAF9",
        card: "#FFFFFF",
        sidebar: { DEFAULT: "#0D2430", soft: "#133240" },
        mint: {
          DEFAULT: "#2FC7A2", dark: "#18AA87",
          soft: "#C8F7E9", softer: "#ECFBF6",
        },
        ink: { DEFAULT: "#111827", soft: "#667085" },
        line: "#E4ECE9",
        danger: "#E5484D",
        warning: "#F5A524",
        success: "#20A779",
      },
      borderRadius: {
        card: "16px",
        btn: "12px",
        input: "10px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.04)",
        cardHover: "0 4px 12px rgba(16,24,40,0.06)",
      },
      fontFamily: {
        sans: ["var(--font-noto-sans-jp)", "system-ui", "-apple-system", "sans-serif"],
      },
      maxWidth: { content: "1600px" },
      transitionDuration: { DEFAULT: "200ms" },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
