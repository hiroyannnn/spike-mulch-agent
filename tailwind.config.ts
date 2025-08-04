import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  presets: [require("@assistant-ui/react-ui/preset")],
};

export default config;
