import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// RTL unmounts rendered trees automatically only when Vitest globals are on.
// This project imports test APIs explicitly, so unmount after every test to
// stop hooks and effects from one test leaking into the next.
afterEach(() => {
  cleanup();
});
