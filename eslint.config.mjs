import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["src/app/**/*.{ts,tsx}"],
    rules: {
      // Prevent rogue global stylesheet links in the App Router
      // Using a simple string match via custom plugin would be ideal; as a guardrail we'll rely on code review comment below.
    },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      // Guardrails: globals.css must only be imported in root layout
      "no-restricted-imports": [
        "warn",
        {
          paths: [
            {
              name: "./globals.css",
              message: "Import globals.css only in src/app/layout.tsx",
            },
            {
              name: "../globals.css",
              message: "Import globals.css only in src/app/layout.tsx",
            },
          ],
        },
      ],
    },
  },
];

export default eslintConfig;
