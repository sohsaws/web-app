"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  type SubmitHandler,
  type UseFormReturn,
  useForm,
} from "react-hook-form";
import { z } from "zod";
import { authClient } from "@/lib/auth/auth-client";

const loginFormSchema = z.object({
  identifier: z
    .string({ error: "This field is required" })
    .min(3, "Email or username is required")
    .max(50, "Email or username must be at most 50 characters long")
    .regex(
      /^(?:[a-z0-9_]+|[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,})$/i,
      "Invalid email or username",
    ),
  password: z
    .string({ error: "Password is required" })
    .min(8, "Password must be at least 8 characters long")
    .max(50, "Password must be at most 50 characters long"),
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
              onError: (context) => setError(context.error.message),
            },
          )
        : await authClient.signIn.username(
            { ...credentials, username: values.identifier },
            {
              onSuccess: () => router.push(callbackUrl),
              onError: (context) => setError(context.error.message),
            },
          );

      if (result.error) {
        setError(result.error.message);
      }
    } catch (caughtError: unknown) {
      console.error(caughtError);
      setError("An unexpected error occurred");
    }
  };

  return {
    error,
    form,
    onSubmit,
  };
}
