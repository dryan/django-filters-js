import { defineConfig } from "vitest/config";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  test: {
    // Test environment
    environment: "node",

    // Include test files
    include: ["src/**/*.test.ts", "tests/**/*.test.ts", "**/*.spec.ts"],

    // Exclude files
    exclude: ["node_modules", "dist", "build", ".vscode"],

    // Coverage configuration
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules",
        "dist",
        "build",
        "**/*.test.ts",
        "**/*.spec.ts",
        "**/*.config.*",
        "**/types/**",
      ],
    },

    // Globals (optional - enables Jest-like global API)
    globals: true,

    // Test timeout
    testTimeout: 10000,
  },

  // Path aliases - match tsconfig.json
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "~": resolve(__dirname, "./src"),
      "@components": resolve(__dirname, "./src/components"),
      "@utils": resolve(__dirname, "./src/utils"),
      "@styles": resolve(__dirname, "./src/styles"),
      "@types": resolve(__dirname, "./src/types"),
    },
  },
});
