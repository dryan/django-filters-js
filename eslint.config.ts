import type { Linter } from "eslint";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";
import json from "@eslint/json";

const config: Linter.Config[] = [
  {
    // Global ignores
    ignores: [
      "node_modules/**",
      "dist/**",
      "build/**",
      ".vscode/**",
      ".rollup.cache/**",
      "coverage/**",
      "package-lock.json",
      "*.backup.*",
      "*.js", // Ignore generated JS files
      "!*.config.js", // But don't ignore config files
      "!eslint.config.js",
      "!eslint.config.ts",
      "!rollup.config.js",
      "!web-test-runner.config.js",
      "!scripts/**/*.js",
      // Python
      "__pycache__/**",
      "*.pyc",
      ".pytest_cache/**",
      ".ruff_cache/**",
      "*.egg-info/**",
      ".venv/**",
      "venv/**",
    ],
  },

  // JSON files
  {
    files: ["**/*.json"],
    ignores: ["**/tsconfig*.json"], // Exclude tsconfig which has comments
    language: "json/json",
    ...json.configs.recommended,
  },

  // JSONC files (JSON with Comments like tsconfig.json)
  {
    files: ["**/tsconfig*.json"],
    language: "json/jsonc",
    ...json.configs.recommended,
  },

  // Base configs
  {
    ...eslint.configs.recommended,
    files: ["**/*.{js,ts,jsx,tsx}"],
  },
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ["**/*.{js,ts,jsx,tsx}"],
  })),
  {
    ...prettierConfig,
    files: ["**/*.{js,ts,jsx,tsx}"],
  },

  // JavaScript/TypeScript files - custom rules
  {
    files: ["**/*.js", "**/*.ts"],
    rules: {
      // Web Components often use property decorators
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          // Ignore decorator-related unused vars
          ignoreRestSiblings: true,
        },
      ],
    },
  },

  // Config files - add Node.js globals
  {
    files: ["*.config.js", "*.config.ts", "scripts/**/*.js", "scripts/**/*.ts"],
    languageOptions: {
      globals: {
        process: "readonly",
        console: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        Buffer: "readonly",
      },
    },
  },

  // Browser-based files - add browser globals
  {
    files: ["src/**/*.js", "src/**/*.ts"],
    languageOptions: {
      globals: {
        window: "readonly",
        document: "readonly",
        customElements: "readonly",
        HTMLElement: "readonly",
        CustomEvent: "readonly",
        Element: "readonly",
        Event: "readonly",
        EventTarget: "readonly",
      },
    },
  },

  // Test files - add test globals
  {
    files: ["**/*.test.js", "**/*.test.ts", "**/*.spec.js", "**/*.spec.ts"],
    languageOptions: {
      globals: {
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        jest: "readonly",
        test: "readonly",
      },
    },
  },
];

export default config;
