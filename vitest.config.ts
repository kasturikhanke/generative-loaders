import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["packages/progress-narrative/tests/**/*.test.{ts,tsx}"],
  },
});
