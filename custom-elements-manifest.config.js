// @ts-check

/**
 * Custom Elements Manifest configuration
 *
 * Generates custom-elements.json for Web Components
 * This file is used by VS Code, IDEs, and documentation tools
 * to provide autocomplete and documentation for custom elements.
 */

export default {
  globs: ["src/**/*.ts"],
  exclude: ["src/**/*.test.ts", "src/**/*.spec.ts"],
  outdir: ".",

  // Lit-specific plugin
  plugins: [],
};
