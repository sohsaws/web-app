import Link from "next/link";

export default function SiteLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="flex min-h-dvh flex-col">
			<nav className="fixed top-0 z-50 h-15 w-app-screen-width border-b border-white/5 bg-app-bg">
				<div className="relative mx-auto flex h-app-full max-w-app-shell items-center justify-between gap-[clamp(0.125rem,2vw,2rem)] px-[clamp(0.375rem,4vw,3rem)]">
					<Link
						href="/"
						className="shrink-0 pb-1 font-serif text-[clamp(1.25rem,5vw,1.875rem)] text-white tracking-tight"
					>
						Swiipy
					</Link>

					<div className="absolute left-1/2 flex w-[clamp(11.25rem,42vw,27.75rem)] min-w-45 -translate-x-1/2 items-stretch overflow-hidden rounded-full border border-white/10 bg-neutral-900/60 shadow-3xl shadow-black/50 backdrop-blur-md">
						<Link
							href="/contact"
							className="flex min-w-0 flex-1 items-center justify-center rounded-l-full px-[clamp(0.5rem,2.5vw,2.5rem)] py-1.5 text-app-nav font-medium text-neutral-400 transition-all duration-200 hover:bg-white/5 hover:text-white"
						>
							Contact
						</Link>
						<Link
							href="/pricing"
							className="flex min-w-0 flex-1 items-center justify-center px-[clamp(0.5rem,2.5vw,2.5rem)] py-1.5 text-app-nav font-medium text-neutral-400 transition-all duration-200 hover:bg-white/5 hover:text-white"
						>
							Pricing
						</Link>
						<Link
							href="/about"
							className="flex min-w-0 flex-1 items-center justify-center rounded-r-full px-[clamp(0.5rem,2.5vw,2.5rem)] py-1.5 text-app-nav font-medium text-neutral-400 transition-all duration-200 hover:bg-white/5 hover:text-white"
						>
							About
						</Link>
					</div>

					<div className="relative flex gap-2 lg:left-4 xl:left-8 2xl:left-12">
						<Link
							href="/login"
							className="shrink-0 rounded-full bg-white px-[clamp(0.75rem,3vw,1.75rem)] py-1.5 text-app-nav font-semibold tracking-tight text-black transition-colors duration-200 hover:bg-neutral-300"
						>
							Sign In
						</Link>
						<Link
							href="/register"
							className="shrink-0 rounded-full bg-white px-[clamp(0.75rem,3vw,1.75rem)] py-1.5 text-app-nav font-semibold tracking-tight text-black transition-colors duration-200 hover:bg-neutral-300"
						>
							Sign Up
						</Link>
					</div>
				</div>
			</nav>

			<div className="flex flex-1 flex-col pt-app-nav-height">
				<div className="relative z-10 flex flex-1 flex-col bg-app-bg">
					{children}
				</div>

				<footer className="relative z-10 shrink-0 border-t border-white/5 bg-app-bg py-3">
				<div className="relative mx-auto flex max-w-app-shell items-center justify-center px-app-nav-x">
					<nav
						className="flex items-center gap-10 text-app-footer-link text-neutral-500"
						aria-label="Footer"
					>
						<Link href="#" className="transition-colors hover:text-white">
							Privacy
						</Link>
						<Link href="#" className="transition-colors hover:text-white">
							Terms
						</Link>
						<Link href="#" className="transition-colors hover:text-white">
							Telegram
						</Link>
						<Link href="#" className="transition-colors hover:text-white">
							GitHub
						</Link>
					</nav>

					<p className="absolute right-9 text-app-nav leading-none text-neutral-600">
						© 2026 Swiipy.
					</p>
				</div>
				</footer>
			</div>
		</div>
	);
}
