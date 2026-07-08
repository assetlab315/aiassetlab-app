import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        aalBlue: "#2563eb",
        aalDark: "#111827",
        aalSoft: "#f8fafc"
      }
    },
  },
  plugins: [],
};
export default config;
