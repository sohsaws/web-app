import { fileURLToPath } from "node:url";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
      "server-only": fileURLToPath(
        new URL("./test-utils/server-only.ts", import.meta.url),
      ),
    },
  },
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    // Integration tests need a database and run with
    // vitest.integration.config.mts (`npm run test:integration`).
    exclude: [
      ...configDefaults.exclude,
      ".next/**",
      "e2e/**",
      "**/*.integration.test.ts",
    ],
    // Every test starts from a clean slate without manual cleanup.
    clearMocks: true,
    restoreMocks: true,
    unstubEnvs: true,
  },
});
