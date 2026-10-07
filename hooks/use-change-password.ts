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

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
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

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

interface UseChangePasswordResult {
  form: UseFormReturn<ChangePasswordFormValues>;
  onSubmit: SubmitHandler<ChangePasswordFormValues>;
}

export function useChangePassword(): UseChangePasswordResult {
  const router = useRouter();
  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      confirmPassword: "",
      currentPassword: "",
      newPassword: "",
    },
  });

  const onSubmit: SubmitHandler<ChangePasswordFormValues> = async ({
    currentPassword,
    newPassword,
  }) => {
    try {
      const { error } = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });

      if (error) {
        if (error.code === "INVALID_PASSWORD") {
          form.setError("currentPassword", {
            message: "Current password is incorrect",
          });
          return;
        }

        toast.error(error.message ?? "Unable to change your password");
        return;
      }

      toast.success("Password changed successfully");
      router.replace("/settings/security");
      router.refresh();
    } catch (error: unknown) {
      console.error("Password change failed:", error);
      toast.error("Unable to change your password");
    }
  };

  return {
    form,
    onSubmit,
  };
}
