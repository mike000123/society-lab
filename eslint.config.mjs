import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "Uploaded_on_github/**",
      "lets_change_the_world_prototype.jsx",
      "src/lets_change_the_world_prototype.jsx",
      "v1/**",
      "v2/**",
      "tmp_visual/**",
      "tmp_visual_dev/**",
    ],
  },
  ...compat.extends("next/core-web-vitals"),
];

export default eslintConfig;
