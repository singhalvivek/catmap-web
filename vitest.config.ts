// vitest.config — test runner config for pure TypeScript unit tests
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // Mirrors tsconfig's "@/*" path, so a module under test can import the way the app does.
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: {
    environment: "node",
    include: ["src/__tests__/**/*.test.ts"],
  },
});
