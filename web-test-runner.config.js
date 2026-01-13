// @ts-check

/**
 * @web/test-runner configuration for Web Components
 *
 * This configuration uses Playwright for cross-browser testing.
 * Adjust browsers, coverage, and other options based on your needs.
 */

import { playwrightLauncher } from "@web/test-runner-playwright";

export default {
  // Test files to run
  files: ["src/**/*.test.ts", "tests/**/*.test.ts"],

  // Browsers to test
  browsers: [
    playwrightLauncher({ product: "chromium" }),
    playwrightLauncher({ product: "firefox" }),
    playwrightLauncher({ product: "webkit" }),
  ],

  // Node resolve for bare module imports
  nodeResolve: true,

  // Coverage configuration
  coverage: true,
  coverageConfig: {
    report: true,
    reportDir: "coverage",
    threshold: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },

  // Test framework configuration
  testFramework: {
    config: {
      timeout: 3000,
    },
  },

  // Preserve symlinks for monorepo setups
  preserveSymlinks: true,
};
