"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center text-sm text-neutral-400">
      Redirecting...
    </div>
  );
}
