"use client";

import { createContext, useContext } from "react";
import { useStore } from "zustand";
import { createStore } from "zustand/vanilla";
import type { User } from "@/lib/types/user/types";

export interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
  updateUser: (changes: Partial<Omit<User, "id">>) => void;
  clearUser: () => void;
}

export const createUserStore = (initialUser: User | null = null) =>
  createStore<UserStore>((set) => ({
    user: initialUser,
    setUser: (user): void => {
      set({ user });
    },
    updateUser: (changes): void => {
      set((state) => ({
        user: state.user ? { ...state.user, ...changes } : state.user,
      }));
    },
    clearUser: (): void => {
      set({ user: null });
    },
}));

type UserStoreApi = ReturnType<typeof createUserStore> | null;

export const UserStoreContext = createContext<UserStoreApi>(null);

export function useUserStore<T,>(selector: (state: UserStore) => T): T {
  const store = useContext(UserStoreContext);

  if (!store) {
    throw new Error("useUserStore must be used within UserStoreProvider");
  }

  return useStore(store, selector);
}
