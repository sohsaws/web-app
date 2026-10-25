"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  type SubmitHandler,
  type UseFormReturn,
  useForm,
} from "react-hook-form";
import { z } from "zod";
import { useAuthErrorMessage } from "@/hooks/i18n/use-auth-error-message";
import { useRouter } from "@/i18n/navigation";
import { authClient } from "@/lib/auth/auth-client";
import {
  LOGIN_IDENTIFIER_MAX_LENGTH,
  LOGIN_IDENTIFIER_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from "@/lib/config/auth";

// Messages are keys of the Validation namespace.
const loginFormSchema = z.object({
  identifier: z
    .string({ error: "required" })
    .min(LOGIN_IDENTIFIER_MIN_LENGTH, "identifierRequired")
    .max(LOGIN_IDENTIFIER_MAX_LENGTH, "identifierTooLong")
    .regex(
      /^(?:[a-z0-9_]+|[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,})$/i,
      "identifierInvalid",
    ),
  password: z
    .string({ error: "passwordRequired" })
    .min(PASSWORD_MIN_LENGTH, "passwordTooShort")
    .max(PASSWORD_MAX_LENGTH, "passwordTooLong"),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

interface UseLoginFormResult {
  error: string | undefined;
  form: UseFormReturn<LoginFormValues>;
  onSubmit: SubmitHandler<LoginFormValues>;
}

export function useLoginForm(callbackUrl: string): UseLoginFormResult {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const authErrorMessage = useAuthErrorMessage();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (values) => {
    try {
      setError(undefined);

      const isEmail = values.identifier.includes("@");
      const credentials = {
        password: values.password,
        rememberMe: true,
        callbackURL: callbackUrl,
      };

      const result = isEmail
        ? await authClient.signIn.email(
            { ...credentials, email: values.identifier },
            {
              onSuccess: () => router.push(callbackUrl),
              onError: (context) => setError(authErrorMessage(context.error)),
            },
          )
        : await authClient.signIn.username(
            { ...credentials, username: values.identifier },
            {
              onSuccess: () => router.push(callbackUrl),
              onError: (context) => setError(authErrorMessage(context.error)),
            },
          );

      if (result.error) {
        setError(authErrorMessage(result.error));
      }
    } catch (caughtError: unknown) {
      console.error(caughtError);
      setError(authErrorMessage(null));
    }
  };

  return {
    error,
    form,
    onSubmit,
  };
}
