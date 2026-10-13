import { execSync } from "node:child_process";

// Brings the test database to the schema in prisma/migrations before any
// integration test runs. `migrate deploy` only applies pending migration
// files; it never resets or drops data.
export default function setup(): void {
  execSync("npx prisma migrate deploy", {
    stdio: "inherit",
    env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL_TEST },
  });
}
