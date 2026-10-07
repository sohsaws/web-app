"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  type SubmitHandler,
  type UseFormReturn,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { authClient } from "@/lib/auth/auth-client";

export const DELETE_ACCOUNT_CONFIRMATION = "DELETE";

const REAUTH_URL = "/login?callbackUrl=/settings/security";

const deleteAccountFieldsSchema = z.object({
  confirmation: z
    .string()
    // Explicit boolean: an inferred type predicate would narrow the output
    // type to the literal "DELETE" and break the form's input/output types.
    .refine((value): boolean => value === DELETE_ACCOUNT_CONFIRMATION, {
      message: `Type ${DELETE_ACCOUNT_CONFIRMATION} to confirm`,
    }),
  password: z.string(),
});

type DeleteAccountFormValues = z.infer<typeof deleteAccountFieldsSchema>;

function createDeleteAccountSchema(
  requiresPassword: boolean,
): typeof deleteAccountFieldsSchema {
  return deleteAccountFieldsSchema.superRefine(
    ({ password }, context): void => {
      if (requiresPassword && password.length === 0) {
        context.addIssue({
          code: "custom",
          path: ["password"],
          message: "Password is required",
        });
      }
    },
  );
}

async function signOutAndReauthenticate(): Promise<void> {
  await authClient.signOut();
  window.location.assign(REAUTH_URL);
}

interface UseDeleteAccountResult {
  form: UseFormReturn<DeleteAccountFormValues>;
  onSubmit: SubmitHandler<DeleteAccountFormValues>;
}

export function useDeleteAccount(
  requiresPassword: boolean,
): UseDeleteAccountResult {
  const form = useForm<DeleteAccountFormValues>({
    resolver: zodResolver(createDeleteAccountSchema(requiresPassword)),
    defaultValues: { confirmation: "", password: "" },
  });

  const onSubmit: SubmitHandler<DeleteAccountFormValues> = async ({
    password,
  }) => {
    try {
      const { error } = await authClient.deleteUser(
        requiresPassword ? { password } : {},
      );

      if (error) {
        if (error.code === "INVALID_PASSWORD") {
          form.setError("password", { message: "Password is incorrect" });
          return;
        }
        if (error.code === "SESSION_EXPIRED") {
          toast.error("Please sign in again to delete your account", {
            description:
              "For your safety, account deletion needs a recent sign-in.",
            action: {
              label: "Sign in",
              onClick: (): void => {
                void signOutAndReauthenticate();
              },
            },
          });
          return;
        }

        toast.error(error.message ?? "Unable to delete your account");
        return;
      }

      // A full reload clears every client cache (TanStack Query, Zustand)
      // that may still hold the deleted user's data.
      window.location.assign("/");
    } catch (error: unknown) {
      console.error("Account deletion failed:", error);
      toast.error("Unable to delete your account");
    }
  };

  return { form, onSubmit };
}
