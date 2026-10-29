import { defineConfig } from "vitest/config";

export default defineConfig({
  // Relative base so the build works on GitHub Pages sub-paths and anywhere else.
  base: "./",
  build: { outDir: "dist", sourcemap: false },
  test: { environment: "node", include: ["tests/**/*.test.ts"] }
});
