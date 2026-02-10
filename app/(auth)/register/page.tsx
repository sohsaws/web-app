'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User, Mail, Lock } from 'lucide-react';
import { signIn } from "next-auth/react";
import { OauthLogin } from "@/lib/Oauth"

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormValues({ name: "", email: "", password: "" });

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      setLoading(false);
      
      if (!res.ok) {
        setError((await res.json()).message);
        console.log(error);
        return;
      }

      signIn(undefined, { redirectTo: "/dashboard" });

    } catch (error) {
      console.log(error);
      setLoading(false);
      setError(error as string);
    }
  };

  const handleSubmit = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({...formValues, [name]: value });
  }

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


          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div className="space-y-1">
              <label htmlFor="name" className="block text-xs font-medium text-neutral-400">
                Name
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <User className="text-neutral-600" size={18} strokeWidth={1.5} />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formValues.name}
                  onChange={handleSubmit} 
                  className="block w-full rounded-md border border-neutral-700 bg-neutral-900 py-2 pl-10 pr-3 text-sm text-white placeholder-neutral-600 shadow-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500 h-10 transition-colors"
                  placeholder="John"
                />
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
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formValues.email}
                  onChange={handleSubmit}
                  className="block w-full rounded-md border border-neutral-700 bg-neutral-900 py-2 pl-10 pr-3 text-sm text-white placeholder-neutral-600 shadow-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500 h-10 transition-colors"
                  placeholder="name@example.com"
                />
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
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formValues.password}
                  onChange={handleSubmit}
                  className="block w-full rounded-md border border-neutral-700 bg-neutral-900 py-2 pl-10 pr-3 text-sm text-white placeholder-neutral-600 shadow-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500 h-10 transition-colors"
                  placeholder="••••••••"
                />
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
                disabled={loading}
                style={{backgroundColor: loading ? "#171717" : "white"}}
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