import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        lightGray: "var(--background)",
        darkGray: "var(--foreground)",
        veryDarkGray: "#1A1A1A",
        offWhite: "#FFFFFF",
        darkNavy: "#067BC2",
        jonquil: "#ECC30B",

        softGreen: "#16a34a",
        mutedGreen: "#15803d",
        softRed: "#E74C3C",
        mutedRed: "#f53925",
        mutedGold: "#F1C40F",

        hoverLightGray: "#E5E5E5",
        hoverDarkGray: "#2C2C2C",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
      },
    },
  },
  plugins: [],
} satisfies Config;
