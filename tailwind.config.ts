import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  plugins: [
    require("@assistant-ui/react-ui/tailwindcss"),
    require("tailwindcss-animate"),
  ],
};

export default config;
