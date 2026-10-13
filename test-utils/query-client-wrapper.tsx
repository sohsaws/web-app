import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

interface QueryClientWrapper {
  queryClient: QueryClient;
  wrapper: ({ children }: { children: ReactNode }) => ReactNode;
}

// A fresh client per test: no shared cache between tests and no retries to
// wait for.
export function createQueryClientWrapper(): QueryClientWrapper {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  function wrapper({ children }: { children: ReactNode }): ReactNode {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }

  return { queryClient, wrapper };
}
