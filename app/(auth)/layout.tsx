import Link from "next/link";

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className='flex min-h-dvh flex-col'>
			<nav className="fixed top-0 flex h-app-nav-height z-50 w-full items-center bg-app-bg border-white/5 border-b">
				<div className="mx-auto flex items-center justify-between">
					<Link
						href="/"
						className="shrink-0 pb-1 font-serif text-[clamp(1.25rem,5vw,1.875rem)] text-white tracking-tight justify-end"
					>
						Swiipy
					</Link>
				</div>
			</nav>
			<div className="relative z-10">
				{children}
			</div>
		</div>
	);
}
