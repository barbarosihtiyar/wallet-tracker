import js from "@eslint/js";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import reactRefreshPlugin from "eslint-plugin-react-refresh";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import importPlugin from "eslint-plugin-import";
import prettierPlugin from "eslint-plugin-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";

// import nextPlugin from '@next/eslint-plugin-next'

export default [
  // JS temel kurallar
  js.configs.recommended,

  // Genel ayarlar + Next/React/TS entegrasyonu
  {
    ignores: [
      "node_modules/**/*",
      "dist/**/*",
      "build/**/*",
      "**/*.d.ts",
      "public/**/*",
      "commitlint.config.js",
      "eslint.config.js",
      "vite.config.dev.js",
      "vite.config.prod.js",
      "dummy.js",
      "scripts/**/*",
    ],
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: typescriptParser,
      parserOptions: {
        project: "./tsconfig.json",
      },
      globals: {
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        document: "readonly",
        window: "readonly",
        navigator: "readonly",
        console: "readonly",
        localStorage: "readonly",
        sessionStorage: "readonly",
        React: "readonly",
        process: "readonly",
        fetch: "readonly",
        FormData: "readonly",
      },
    },
    settings: {
      react: {
        version: "18.2",
      },
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
      "import/extensions": [".js", ".jsx", ".ts", ".tsx"],
    },
    plugins: {
      "@typescript-eslint": typescriptPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "jsx-a11y": jsxA11yPlugin,
      import: importPlugin,
      prettier: prettierPlugin,
      "react-refresh": reactRefreshPlugin,
      "simple-import-sort": simpleImportSort,
      // '@next/next': nextPlugin,
    },
    rules: {
      // Genel kurallar
      "no-console": "error",
      "no-debugger": "error",
      "no-alert": "warn",
      "no-undef": "error",
      "import/no-unresolved": [
        "error",
        {
          ignore: ["^@/"], // Ignore path aliases starting with @/
        },
      ],
      "import/extensions": [
        "error",
        "ignorePackages",
        {
          js: "never",
          jsx: "never",
          ts: "never",
          tsx: "never",
        },
      ],
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "import/order": "off",
      "no-unused-vars": "off",

      // TypeScript kuralları
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unsafe-member-access": "error",

      // React
      "react/prop-types": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "off",

      // Erişilebilirlik
      "jsx-a11y/anchor-is-valid": "off",

      // Prettier
      "prettier/prettier": "error",
      "import/no-duplicates": "error",

      // React Fast Refresh
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },

  // JS/JSX dosyaları için base no-unused-vars'ı tekrar aç
  {
    files: ["**/*.{js,jsx}"],
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
];
