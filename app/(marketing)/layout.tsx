import Link from "next/link";

export default function SiteLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="flex min-h-dvh flex-col">
			<nav className="fixed top-0 w-app-screen-width z-50 bg-app-bg border-b border-white/5 h-app-nav-height">
				<div className="max-w-app-shell mx-auto px-app-nav-x h-app-full flex items-center justify-between">
					<Link
						href="/"
						className="pb-1 text-app-brand font-serif text-white tracking-tight"
					>
						Swiipy
					</Link>

					<div className="flex items-stretch overflow-hidden rounded-full bg-neutral-900/60 border border-white/10 backdrop-blur-md shadow-3xl shadow-black/50">
						<Link
							href="/contact"
							className="flex flex-1 items-center justify-center px-10 py-1.5 text-app-nav font-medium text-neutral-400 hover:text-white hover:bg-white/5 rounded-l-full transition-all duration-200"
						>
							Contact
						</Link>
						<Link
							href="/pricing"
							className="flex flex-1 items-center justify-center px-10 py-1.5 text-app-nav font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition-all duration-200"
						>
							Pricing
						</Link>
						<Link
							href="/about"
							className="flex flex-1 items-center justify-center px-10 py-1.5 text-app-nav font-medium text-neutral-400 hover:text-white hover:bg-white/5 rounded-r-full transition-all duration-200"
						>
							About
						</Link>
					</div>

					<Link
						href="/login"
						className="hover:bg-neutral-300 transition-colors duration-200 text-app-nav font-semibold text-black tracking-tight bg-white rounded-full px-7 py-1.5"
					>
						Login
					</Link>
				</div>
			</nav>

			<div className="flex flex-1 flex-col pt-app-nav-height">
				<div className="flex flex-1 flex-col bg-app-bg relative z-10">
					{children}
				</div>

				<footer className="shrink-0 border-t border-white/5 bg-app-bg py-3 relative z-10">
				<div className="max-w-app-shell mx-auto px-app-nav-x relative flex items-center justify-center">
					<nav
						className="flex items-center gap-10 text-app-footer-link text-neutral-500"
						aria-label="Footer"
					>
						<Link href="#" className="hover:text-white transition-colors">
							Privacy
						</Link>
						<Link href="#" className="hover:text-white transition-colors">
							Terms
						</Link>
						<Link href="#" className="hover:text-white transition-colors">
							Telegram
						</Link>
						<Link href="#" className="hover:text-white transition-colors">
							GitHub
						</Link>
					</nav>

					<p className="absolute right-9 text-app-nav text-neutral-600 leading-none">
						© 2026 Swiipy.
					</p>
				</div>
				</footer>
			</div>
		</div>
	);
}
