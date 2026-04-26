/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4F46E5",
          dark: "#6366F1",
        },
        accent: "#22C55E",
        background: {
          light: "#F8FAFC",
          dark: "#020617",
        },
        surface: {
          light: "#FFFFFF",
          dark: "#0F172A",
        },
        text: {
          primary: {
            light: "#0F172A",
            dark: "#E2E8F0",
          },
          muted: {
            light: "#64748B",
            dark: "#94A3B8",
          },
        },
        border: {
          light: "#E2E8F0",
          dark: "#1E293B",
        },
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        xxl: "48px",
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
      },
      fontSize: {
        xs: "12px",
        sm: "14px",
        base: "16px",
        lg: "18px",
        xl: "20px",
        "2xl": "24px",
        "3xl": "30px",
        "4xl": "36px",
      },
    },
  },
  plugins: [],
};
