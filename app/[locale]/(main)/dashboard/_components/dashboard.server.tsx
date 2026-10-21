import type { ReactElement, ReactNode } from "react";
import type { AuthUser } from "@/lib/auth/types";

export default function DashBoard({
  user,
  children,
}: {
  user: AuthUser;
  children: ReactNode;
}): ReactElement {
  return (
    <main className="relative z-10 pt-32 pb-20 max-w-7xl mx-auto px-6 w-full space-y-12">
      <header>
        <h1 className="wrap-anywhere font-serif text-3xl text-white sm:text-4xl">
          Welcome back, {user.name}
        </h1>
        <p className="mt-3 text-sm text-app-muted">
          Your next idea is waiting. Keep your favorites close.
        </p>
      </header>
      {children}
    </main>
  );
}
