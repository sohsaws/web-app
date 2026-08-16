import Link from "next/link";

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="overflow-hidden">
			<nav className="fixed inset-x-0 top-0 z-50 h-15 border-b border-white/5 bg-app-bg">
				<div className="mx-auto flex h-app-full max-w-app-shell items-center px-[clamp(0.375rem,4vw,3rem)]">
					<Link
						href="/"
						className="shrink-0 pb-1 font-serif text-[clamp(1.25rem,5vw,1.875rem)] tracking-tight text-white"
					>
						Swiipy
					</Link>
				</div>
			</nav>
			<div className="relative z-10 flex h-full flex-col overflow-y-auto">
				{children}
			</div>
		</div>
	);
}
