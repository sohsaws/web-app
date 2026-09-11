"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useUserStore } from "@/app/stores/user-store";
import { authClient } from "@/lib/auth/auth-client";

interface UseSignOutResult {
  isPending: boolean;
  signOut: () => Promise<void>;
}

export function useSignOut(): UseSignOutResult {
  const clearUser = useUserStore((state) => state.clearUser);
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function signOut(): Promise<void> {
    if (isPending) {
      return;
    }

    setIsPending(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message ?? "Unable to sign out");
        return;
      }

      clearUser();
      
      toast.success("Signed out successfully");
      router.replace("/login");
    } catch {
      toast.error("Unable to sign out");
    } finally {
      setIsPending(false);
    }
  }

  return {
    isPending,
    signOut,
  };
}
