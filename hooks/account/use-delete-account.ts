"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import {
  type SubmitHandler,
  type UseFormReturn,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useAuthErrorMessage } from "@/hooks/i18n/use-auth-error-message";
import { authClient } from "@/lib/auth/auth-client";

// The same word in every language (user decision); only the text around it
// is translated.
export const DELETE_ACCOUNT_CONFIRMATION = "DELETE";

const REAUTH_URL = "/login?callbackUrl=/settings/security";

// Messages are Validation keys; the form shows them through
// useValidationMessage.
const deleteAccountFieldsSchema = z.object({
  confirmation: z
    .string()
    // Explicit boolean: an inferred type predicate would narrow the output
    // type to the literal "DELETE" and break the form's input/output types.
    .refine((value): boolean => value === DELETE_ACCOUNT_CONFIRMATION, {
      message: "deleteConfirmation",
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
          message: "passwordRequired",
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
  const t = useTranslations("Settings.deleteAccount");
  const tActions = useTranslations("Common.actions");
  const authErrorMessage = useAuthErrorMessage();
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
          form.setError("password", { message: "passwordIncorrect" });
          return;
        }
        if (error.code === "SESSION_EXPIRED") {
          toast.error(t("reauthRequired"), {
            description: t("reauthReason"),
            action: {
              label: tActions("signIn"),
              onClick: (): void => {
                void signOutAndReauthenticate();
              },
            },
          });
          return;
        }

        toast.error(authErrorMessage(error, t("failed")));
        return;
      }

      // A full reload clears every client cache (TanStack Query, Zustand)
      // that may still hold the deleted user's data.
      window.location.assign("/");
    } catch (error: unknown) {
      console.error("Account deletion failed:", error);
      toast.error(t("failed"));
    }
  };

  return { form, onSubmit };
}
