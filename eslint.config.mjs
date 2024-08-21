// @ts-check

import eslint from "@eslint/js";
import pluginSimpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    name: "exuanbo/languages-node",
    files: ["**/*.?(c|m){j,t}s"],
    ignores: ["src"],
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.es2022,
        ...globals.node,
      },
    },
  },
  {
    name: "exuanbo/languages-lib",
    files: ["src/**/*.?(c|m){j,t}s"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.es2020,
      },
    },
  },
  {
    name: "exuanbo/ignores",
    ignores: [".yarn", "coverage", "dist", "docs"],
  },
  {
    name: "exuanbo/files",
    files: ["**/*.?(c|m){j,t}s"],
  },
  {
    name: "eslint/recommended",
    ...eslint.configs.recommended,
  },
  {
    name: "exuanbo/typescript",
    files: ["**/*.?(c|m)ts"],
    extends: tseslint.configs.recommendedTypeChecked,
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/consistent-type-exports": "error",
      "@typescript-eslint/consistent-type-imports": ["error", { fixStyle: "inline-type-imports" }],
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-import-type-side-effects": "error",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-enum-comparison": "off",
      "@typescript-eslint/no-unsafe-return": "off",
    },
  },
  {
    name: "simple-import-sort",
    plugins: {
      "simple-import-sort": pluginSimpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },
);
