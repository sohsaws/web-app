'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from "next/navigation"
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Lock } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { OauthLogin } from '@/lib/Oauth';

export default function Login() {

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [resetEmailError, setResetEmailError] = useState("");
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const callbackUrl = useSearchParams().get("callbackUrl") || "/dashboard";
  
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      setFormValues({email: "", password: ""})
      
      const res = await signIn("credentials", {
        redirect: false,
        email: formValues.email,
        password: formValues.password,
        redirectTo: callbackUrl,
      });

      setLoading(false);

      console.log(res);

      if (!res?.error) {
        router.push(callbackUrl);
      } else {
        setError("Invalid email or password");
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError(error as string)
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };


  return (
    <div className="bg-zinc-950 grow flex min-h-screen items-center justify-center pt-25 px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
      <div className="mx-auto w-full max-w-sm lg:w-96">

        <div className="text-left">
          <h2 className="font-serif text-2xl font-medium tracking-tight text-white">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-neutral-500">
            Enter your credentials to access your account
          </p>
        </div>

        <div className="mt-8">
          <div className="grid gap-2">
            <button
              onClick={OauthLogin}
              type="submit"
              className="cursor-pointer flex items-center justify-center gap-3 rounded-md border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1 focus:ring-offset-black transition-all"
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
                  onChange={handleChange}
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
                  autoComplete="current-password"
                  required
                  value={formValues.password}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-neutral-700 bg-neutral-900 py-2 pl-10 pr-3 text-sm text-white placeholder-neutral-600 shadow-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500 h-10 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-xs">
                <Link
                  href="/forgot-password"
                  onClick={(e) => {
                    if (!formValues.email.trim()) {
                      e.preventDefault();
                      setResetEmailError(
                        'Please input an email to send the verification code to.'
                      );
                      return;
                    }
                    setResetEmailError("");
                  }}
                  className="font-medium text-neutral-500 hover:text-white transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <div>
              <button
                  type="submit"
                  style={{backgroundColor: loading ? "#171717" : "white"}}
                  disabled={loading}
                  className="flex w-full justify-center rounded-md border border-transparent bg-white py-2 px-4 text-sm font-medium text-black shadow-sm hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black transition-all"
                >
                  {loading ? "Loading..." : "Log in"}
              </button>
            </div>

            {resetEmailError ? (
              <p className="flex items-center justify-center text-sm text-red-500">{resetEmailError}</p>
            ) : null}

            {error ? (
              <p className="flex items-center justify-center text-sm text-red-500">{error}</p>
            ) : null }
          </form>

          <div className="mt-6 text-center text-xs">
            <span className="text-neutral-500">Don&apos;t have an account?</span>
            <Link href="/register" className="font-medium text-white hover:underline ml-1">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
