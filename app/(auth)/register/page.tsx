"use client";

import { useState } from "react";
import * as z from "zod";
import Link from "next/link";
import Image from "next/image";
import { User, Mail, Lock, AtSign } from "lucide-react";
import { useSignUp } from '@clerk/nextjs';
import { GoogleAuthButton } from '../../../components/GoogleSignButton';
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

const userSchema = z
	.object({
		name: z
			.string({ error: "Name is required" })
			.min(1, "Name is required")
			.max(50, "Name must be at most 50 characters long"),
		username: z
			.string({ error: "Username is required" })
			.min(3, "Username must be at least 3 characters long")
			.max(40, "Username must be at most 50 characters long")
			.regex(
				/^[a-z0-9_]+$/i,
				"Only letters, numbers, and underscores are allowed",
			),
		email: z
			.email("Invalid email address")
			.min(1, "Email is required")
			.max(50, "Email must be at most 50 characters long"),
		password: z
			.string({ error: "Password is required" })
			.min(8, "Password must be at least 8 characters long")
			.max(50, "Password must be at most 50 characters long"),
		passwordConfirm: z
			.string({ error: "Passwords do not match" })
			.min(1, "Please confirm your password"),
	})
	.refine((data) => data.password === data.passwordConfirm, {
		path: ["passwordConfirm"],
		message: "Password do not match",
	});

type registerForm = z.infer<typeof userSchema>;

export default function Register() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<registerForm>({
		resolver: zodResolver(userSchema),
	});

	const [submitting, setSubmitting] = useState(false);
	const [termsAccepted, setTermsAccepted] = useState(false);
	const [error, setError] = useState("");

	const { signUp, fetchStatus } = useSignUp();
	const router = useRouter();

	const onSubmitHandler: SubmitHandler<registerForm> = async (data) => {
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

			const { error } = await signUp.password({
				firstName: data.name,
				lastName: 'Leen',
				username: data.username,
				password: data.password,
				emailAddress: data.email
			});

			if (error) {
				setError(error.message);
				console.error(JSON.stringify(error, null, 2));
			}

			if (signUp.status === 'complete') {
				await signUp.finalize({
					navigate: ({ session, decorateUrl }) => {
						if (session?.currentTask) {
							console.log('Session task:', session.currentTask);
							router.push('/dashboard'); // ваша страница для завершения таска
							router.refresh();
							return;
						}
						const url = decorateUrl('/dashboard');
						if (url.startsWith('http')) {
							window.location.href = url;
						} else {
							router.push(url);
							router.refresh();
						}
					}
				})
			} else {
				console.log('Status: ', signUp.status);
			}

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
						<GoogleAuthButton />
					</div>

					<div className="relative mt-6">
						<div
							className="absolute inset-0 flex items-center"
							aria-hidden="true"
						>
							<div className="w-full border-t border-neutral-800"></div>
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-black px-2 text-neutral-600">
								Or continue with
							</span>
						</div>
					</div>

					<form
						onSubmit={handleSubmit(onSubmitHandler)}
						className="mt-6 space-y-4"
					>
						<div className="space-y-1">
							<label
								htmlFor="name"
								className="block text-xs font-medium text-neutral-400"
							>
								Name
							</label>
							<div className="relative">
								<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
									<User
										className="text-neutral-600"
										size={18}
										strokeWidth={1.5}
									/>
								</div>
								<input
									id="name"
									{...register("name")}
									className="block w-full rounded-md border border-neutral-700 bg-neutral-900 py-2 pl-10 pr-3 text-sm text-white placeholder-neutral-600 shadow-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500 h-10 transition-colors"
									placeholder="John"
								/>
							</div>
							{errors.name && (
								<p className="text-red-500 text-xs mt-2">
									{errors.name?.message}
								</p>
							)}
						</div>

						<div className="space-y-1">
							<label
								htmlFor="username"
								className="block text-xs font-medium text-neutral-400"
							>
								Username
							</label>
							<div className="relative">
								<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
									<AtSign
										className="text-neutral-600"
										size={18}
										strokeWidth={1.5}
									/>
								</div>
								<input
									{...register("username")}
									id="username"
									type="text"
									className="block w-full rounded-md border border-neutral-700 bg-neutral-900 py-2 pl-10 pr-3 text-sm text-white placeholder-neutral-600 shadow-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500 h-10 transition-colors"
									placeholder="Username"
								/>
							</div>
							{errors.username && (
								<p className="text-red-500 text-xs mt-2">
									{errors.username?.message}
								</p>
							)}
						</div>

						<div className="space-y-1">
							<label
								htmlFor="email"
								className="block text-xs font-medium text-neutral-400"
							>
								Email address
							</label>
							<div className="relative">
								<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
									<Mail
										className="text-neutral-600"
										size={18}
										strokeWidth={1.5}
									/>
								</div>
								<input
									id="email"
									{...register("email")}
									type="email"
									className="block w-full rounded-md border border-neutral-700 bg-neutral-900 py-2 pl-10 pr-3 text-sm text-white placeholder-neutral-600 shadow-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500 h-10 transition-colors"
									placeholder="name@example.com"
								/>
							</div>
							{errors.email && (
								<p className="text-red-500 text-xs mt-2">
									{errors.email?.message}
								</p>
							)}
						</div>

						<div className="space-y-1">
							<label
								htmlFor="password"
								className="block text-xs font-medium text-neutral-400"
							>
								Password
							</label>
							<div className="relative">
								<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
									<Lock
										className="text-neutral-600"
										size={18}
										strokeWidth={1.5}
									/>
								</div>
								<input
									id="password"
									{...register("password")}
									type="password"
									className="block w-full rounded-md border border-neutral-700 bg-neutral-900 py-2 pl-10 pr-3 text-sm text-white placeholder-neutral-600 shadow-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500 h-10 transition-colors"
									placeholder="••••••••"
								/>
							</div>
							{errors.password && (
								<p className="text-red-500 text-xs mt-2">
									{errors.password?.message}
								</p>
							)}

							<label
								htmlFor="passwordConfirm"
								className="block text-xs font-medium mt-5 text-neutral-400"
							>
								Password confirmation
							</label>
							<div className="relative">
								<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
									<Lock
										className="text-neutral-600"
										size={18}
										strokeWidth={1.5}
									/>
								</div>
								<input
									id="passwordConfirm"
									{...register("passwordConfirm")}
									type="password"
									className="block w-full rounded-md border border-neutral-700 bg-neutral-900 py-2 pl-10 pr-3 text-sm text-white placeholder-neutral-600 shadow-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500 h-10 transition-colors"
									placeholder="••••••••"
								/>
							</div>
							{errors.passwordConfirm && (
								<p className="text-red-500 text-xs mt-2">
									{errors.passwordConfirm?.message}
								</p>
							)}

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
									I agree to the{" "}
									<Link
										href="#"
										className="font-medium text-white hover:underline"
									>
										Terms of Service
									</Link>{" "}
									and{" "}
									<Link
										href="#"
										className="font-medium text-white hover:underline"
									>
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
								style={{ backgroundColor: submitting || fetchStatus === 'fetching' ? "#171717" : "white" }}
								className="flex w-full cursor-pointer justify-center rounded-md border border-transparent bg-white py-2 px-4 text-sm font-medium text-black shadow-sm hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black transition-all"
							>
								Create account
							</button>
						</div>

						{error ? (
							<p className="flex items-center justify-center text-sm text-red-500">
								{error}
							</p>
						) : null}
					</form>

					<div className="mt-6 text-center text-xs">
						<span className="text-neutral-500">Already have an account?</span>
						<Link
							href="/login"
							className="font-medium text-white hover:underline ml-1"
						>
							Sign in
						</Link>
					</div>
					<div id="clerk-captcha" />
				</div>
			</div>
		</div>
	);
}
