'use client';

import { useState } from 'react';
import * as z from "zod";
import Link from 'next/link';
import Image from 'next/image';
import { User, Mail, Lock } from 'lucide-react';
import { signIn } from "next-auth/react";
import { OauthLogin } from "@/lib/Oauth"
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


const userSchema = z.object({
  name: z.string({error: "Name is required"}).min(1, "Name is required"),
  email: z.email("Invalid email address"),
  password: z.string({error: "Password is required"})
    .min(8, "Password must be at least 8 characters long")
    .max(50, "Password must be at most 50 characters long"),
  passwordConfirm: z.string({error: "Passwords do not match"})
    .min(1, "Please confirm your password"),
  }).refine((data) => data.password === data.passwordConfirm, {
      path: ["passwordConfirm"],
      message: "Password do not match",
});

type registerFrom = z.infer<typeof userSchema>;

export default function Register() {

  const {register, handleSubmit, formState: { errors }} = useForm<registerFrom>({
    resolver: zodResolver(userSchema)
  });

  const [submitting, setSubmitting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");
  const onSubmitHandler: SubmitHandler<registerFrom> = async (data) => {
    try {
      setSubmitting(true);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.message || "Registration failed");
        setSubmitting(false);
        return;
      }

      // Successful registration
      await signIn("credentials", { 
        email: data.email, 
        password: data.password,
        redirectTo: "/dashboard" 
      });

    } catch (error) {
      console.log(error);
      setError("An unexpected error occurred");
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-zinc-950 grow flex min-h-screen items-center justify-center pt-25 px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
      <div className="mx-auto w-full max-w-sm lg:w-96">

        <div className="text-left">
          <h2 className="font-serif text-2xl font-medium tracking-tight text-white">
            Let&apos;s create your account
          </h2>
          <p className="mt-2 text-sm text-neutral-500">
            Enter your details below to create your account
          </p>
        </div>

        <div className="mt-8">

          <div className="grid gap-3">
            <button
              type="submit"
              onClick={OauthLogin}
              className="group relative flex w-full items-center justify-center gap-2 rounded-md border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1 focus:ring-offset-black transition-all"
            >
              <Image
                src="/imgs/Google.png"
                alt="Google"
                width={16}
                height={16}
              />
              <span>Google</span>
            </button>
          </div>


          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-neutral-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-black px-2 text-neutral-600">Or continue with</span>
            </div>
          </div>


          <form onSubmit={handleSubmit(onSubmitHandler)} className="mt-6 space-y-4">
            <div className="space-y-1">
              <label htmlFor="name" className="block text-xs font-medium text-neutral-400">
                Name
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <User className="text-neutral-600" size={18} strokeWidth={1.5} />
                </div>
                <input
                  {...register("name")}
                  className="block w-full rounded-md border border-neutral-700 bg-neutral-900 py-2 pl-10 pr-3 text-sm text-white placeholder-neutral-600 shadow-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500 h-10 transition-colors"
                  placeholder="John"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name?.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="email" className="block text-xs font-medium text-neutral-400">
                Email address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="text-neutral-600" size={18} strokeWidth={1.5} />
                </div>
                <input
                  {...register("email")}
                  type="email"
                  className="block w-full rounded-md border border-neutral-700 bg-neutral-900 py-2 pl-10 pr-3 text-sm text-white placeholder-neutral-600 shadow-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500 h-10 transition-colors"
                  placeholder="name@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email?.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="block text-xs font-medium text-neutral-400">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="text-neutral-600" size={18} strokeWidth={1.5} />
                </div>
                <input
                  {...register("password")}
                  type="password"
                  className="block w-full rounded-md border border-neutral-700 bg-neutral-900 py-2 pl-10 pr-3 text-sm text-white placeholder-neutral-600 shadow-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500 h-10 transition-colors"
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password?.message}</p>
                )}
              </div>

              <label htmlFor="passwordConfirm" className="block text-xs font-medium text-neutral-400">
                Password confirmation
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="text-neutral-600" size={18} strokeWidth={1.5} />
                </div>
                <input
                  {...register("passwordConfirm")}
                  type="password"
                  className="block w-full rounded-md border border-neutral-700 bg-neutral-900 py-2 pl-10 pr-3 text-sm text-white placeholder-neutral-600 shadow-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500 h-10 transition-colors"
                  placeholder="••••••••"
                />
                {errors.passwordConfirm && (
                  <p className="text-red-500 text-xs mt-1">{errors.passwordConfirm?.message}</p>
                )}
              </div>

              
              <div className="flex gap-1 pt-1">
                <div className="h-1 flex-1 rounded-full bg-neutral-800"></div>
                <div className="h-1 flex-1 rounded-full bg-neutral-800"></div>
                <div className="h-1 flex-1 rounded-full bg-neutral-800"></div>
                <div className="h-1 flex-1 rounded-full bg-neutral-800"></div>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex h-5 items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="h-4 w-4 rounded border-neutral-700 bg-neutral-900 text-white focus:ring-white focus:ring-offset-0 cursor-pointer accent-white"
                />
              </div>
              <div className="ml-2 text-xs">
                <label htmlFor="terms" className="font-normal text-neutral-500">
                  I agree to the{' '}
                  <Link href="#" className="font-medium text-white hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="#" className="font-medium text-white hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>
            </div>


            <div>
              <button
                type="submit"
                onClick={(event: React.FormEvent) => {
                  if (!termsAccepted) {
                    setError("You must accept the terms and conditions");
                    event.preventDefault();
                  }
                }}
                disabled={submitting}
                style={{backgroundColor: submitting ? "#171717" : "white"}}
                className="flex w-full justify-center rounded-md border border-transparent bg-white py-2 px-4 text-sm font-medium text-black shadow-sm hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black transition-all"
              >
                Create account
              </button>
            </div>

            {error ? (
              <p className="flex items-center justify-center text-sm text-red-500">{error}</p>
            ) : null }

          </form>

          <div className="mt-6 text-center text-xs">
            <span className="text-neutral-500">Already have an account?</span>
            <Link href="/login" className="font-medium text-white hover:underline ml-1">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}