// @ts-check

import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        projectService: true,
      }
    },
    rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "prefer-const": "off",
        "@typescript-eslint/ban-ts-comment": "off",
        "no-undef": "off",
        "@typescript-eslint/no-this-alias": "off",
        "@types-eslint/no-unused-expressions": "off",
        "@types-eslint/no-require-imports": "off",
        "@typescript-eslint/no-unsafe-return": "off",
        "@typescript-eslint/no-unsafe-argument": "off",
        "@typescript-eslint/require-await": "off",
        "@types-eslint/restrict-template-expressions": "off",
        "@typescript-eslint/no-floating-promises": "error",
        "@typescript-eslint/no-unsafe-member-access": "off"
    }
  },
  {
    ignores: [
      "src/Database/Migrations/*",
      "src/Database/Development/*",
    ]
  }
);
