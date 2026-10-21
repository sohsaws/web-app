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
    server: {
      deps: {
        // next-intl ships ESM that imports "next/server" without an
        // extension; bundling it through Vite lets those imports resolve.
        inline: ["next-intl"],
      },
    },
    // Logic, routes and actions need no DOM; hooks and components (.tsx)
    // run in jsdom. In Vitest 4 a project inherits these root options only
    // with `extends: true`.
    projects: [
      {
        extends: true,
        test: { name: "node", environment: "node", include: ["**/*.test.ts"] },
      },
      {
        extends: true,
        test: {
          name: "jsdom",
          environment: "jsdom",
          include: ["**/*.test.tsx"],
          setupFiles: ["./test-utils/rtl-setup.ts"],
        },
      },
    ],
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
    unstubGlobals: true,
  },
});
