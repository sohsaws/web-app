"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  type SubmitHandler,
  type UseFormReturn,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { authClient } from "@/lib/auth/auth-client";

const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must be at most 128 characters"),
    confirmPassword: z.string(),
  })
  .refine(
    ({ confirmPassword, newPassword }) => {
      return confirmPassword === newPassword;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    },
  );

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

interface UseResetPasswordResult {
  form: UseFormReturn<ResetPasswordFormValues>;
  onSubmit: SubmitHandler<ResetPasswordFormValues>;
}

export function useResetPassword(token: string): UseResetPasswordResult {
  const router = useRouter();
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      confirmPassword: "",
      newPassword: "",
    },
  });

  const onSubmit: SubmitHandler<ResetPasswordFormValues> = async ({
    newPassword,
  }) => {
    try {
      const { error } = await authClient.resetPassword({
        newPassword,
        token,
      });

      if (error) {
        if (error.code === "INVALID_TOKEN") {
          router.replace("/forgot-password?error=INVALID_TOKEN");
          return;
        }

        toast.error(error.message ?? "Unable to reset your password");
        return;
      }

      toast.success("Password reset successfully");
      router.replace("/login?passwordReset=success");
    } catch (error: unknown) {
      console.error("Password reset failed:", error);
      toast.error("Unable to reset your password");
    }
  };

  return {
    form,
    onSubmit,
  };
}
