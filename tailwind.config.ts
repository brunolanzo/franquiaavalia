import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1B4D3E",
          light: "#2D7A5F",
        },
        accent: {
          DEFAULT: "#F59E0B",
          hover: "#D97706",
        },
        background: "#F8F9FA",
        card: "#FFFFFF",
        foreground: "#1F2937",
        muted: "#6B7280",
        border: "#E5E7EB",
      },
    },
  },
  plugins: [],
};
export default config;
