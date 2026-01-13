// @ts-check

/**
 * Rollup configuration for Web Components
 *
 * This is a template configuration. Adjust based on your project needs:
 * - Add/remove plugins as needed
 * - Adjust input/output paths
 * - Configure for library vs application builds
 */

import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import summary from "rollup-plugin-summary";

// Set to true for production builds
const production = !process.env["ROLLUP_WATCH"];

export default {
  input: "src/index.ts",
  output: {
    dir: "dist",
    format: "es",
    sourcemap: true,
  },
  plugins: [
    // Resolve bare module specifiers to relative paths
    resolve(),

    // Convert CommonJS modules to ES6
    commonjs(),

    // Compile TypeScript
    typescript({
      declaration: true,
      declarationDir: "dist/types",
      rootDir: "src",
    }),

    // Minify in production
    production &&
      terser({
        ecma: 2020,
        module: true,
      }),

    // Print bundle summary
    summary(),
  ],

  // External dependencies (don't bundle these)
  external: [
    // Lit is typically externalized in library builds
    /^lit/,
  ],

  preserveEntrySignatures: "strict",
};
