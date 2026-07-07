import js from "@eslint/js";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import unusedImports from "eslint-plugin-unused-imports";

export default tseslint.config(
  {
    ignores: ["dist", ".output", ".vinxi"],
  },

  {
    files: ["**/*.{ts,tsx}"],

    extends: [js.configs.recommended, ...tseslint.configs.recommended],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
    },

    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "unused-imports": unusedImports,
    },

    rules: {
      // React Hooks
      ...reactHooks.configs.recommended.rules,

      // React Fast Refresh
      "react-refresh/only-export-components": [
        "warn",
        {
          allowConstantExport: true,
        },
      ],

      // Disable default unused-vars rule
      "@typescript-eslint/no-unused-vars": "off",

      // Automatically remove unused imports
      "unused-imports/no-unused-imports": "error",

      // Warn for unused variables (ignore variables prefixed with _)
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],

      // Best practices
      "prefer-const": "error",
      eqeqeq: ["error", "always"],
      curly: ["error", "all"],

      // Console usage
      "no-console": [
        "warn",
        {
          allow: ["warn", "error"],
        },
      ],
    },
  },

  eslintPluginPrettier,
);
