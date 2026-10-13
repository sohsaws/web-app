import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";
import { configDefaults, defineConfig } from "vitest/config";

// DATABASE_URL_TEST lives in .env.local next to the other secrets.
loadEnv({ path: ".env.local", quiet: true });

const testDatabaseUrl = process.env.DATABASE_URL_TEST;

// Integration tests write to and delete from a real database. Refuse to run
// without a dedicated test database, or when it is the main one.
if (!testDatabaseUrl) {
  throw new Error("DATABASE_URL_TEST must be set to run integration tests");
}
if (testDatabaseUrl === process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL_TEST must not be the main DATABASE_URL");
}

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
    include: ["**/*.integration.test.ts"],
    exclude: [...configDefaults.exclude, ".next/**", "e2e/**"],
    // The code under test reads DATABASE_URL (lib/prisma.ts), so it is
    // pointed at the test database here.
    env: { DATABASE_URL: testDatabaseUrl },
    globalSetup: ["./test-utils/integration-global-setup.ts"],
    // One shared database: files run one after another so tests never race
    // on the same rows.
    fileParallelism: false,
    testTimeout: 30_000,
    hookTimeout: 60_000,
    clearMocks: true,
    restoreMocks: true,
    unstubEnvs: true,
  },
});
