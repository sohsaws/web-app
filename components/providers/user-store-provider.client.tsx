"use client";

import { type ReactElement, type ReactNode, useState } from "react";
import { createUserStore, UserStoreContext } from "@/app/stores/user-store";
import type { User } from "@/lib/types/user/types";

interface UserStoreProviderProps {
  initialUser: User | null;
  children: ReactNode;
}

export function UserStoreProvider({
  initialUser,
  children,
}: UserStoreProviderProps): ReactElement {
  const [store] = useState(() => createUserStore(initialUser));

  return (
    <UserStoreContext value={store}>
      {children}
    </UserStoreContext>
  );
}
