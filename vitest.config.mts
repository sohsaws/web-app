import { fileURLToPath } from "node:url";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    exclude: [...configDefaults.exclude, ".next/**", "e2e/**"],
    // Every test starts from a clean slate without manual cleanup.
    clearMocks: true,
    restoreMocks: true,
    unstubEnvs: true,
  },
});
