import Link from "next/link";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <nav className="fixed flex w-full z-50 pt-6 pr-8 pl-8 top-0 left-0 items-center justify-between">
        <div className="flex shrink-0 w-24 items-center">
          <Link
            href="/"
            className="pl-7 pb-4 text-3xl font-serif text-white tracking-tight"
          >
            Swiipy
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-1 bg-neutral-900/60 border border-white/10 rounded-full py-1.5 px-2 backdrop-blur-md shadow-2xl shadow-black/50">
          <Link
            href="/contact"
            className="px-4 py-1.5 text-xs font-medium text-neutral-400 hover:text-white hover:bg-white/5 rounded-full transition-all duration-200"
          >
            Contact
          </Link>
          <Link
            href="/pricing"
            className="px-4 py-1.5 text-xs font-medium text-neutral-400 hover:text-white hover:bg-white/5 rounded-full transition-all duration-200"
          >
            Pricing
          </Link>
          <Link
            href="/about"
            className="px-4 py-1.5 text-xs font-medium text-neutral-400 hover:text-white hover:bg-white/5 rounded-full transition-all duration-200"
          >
            About
          </Link>
        </div>

        <div className="pb-3 pr-7 flex justify-end shrink-0 w-24">
          <Link
            href="/login"
            className="hover:bg-neutral-200 transition-colors duration-200 text-xs font-semibold text-black tracking-tight bg-white rounded-full pt-2 pr-5 pb-2 pl-5"
          >
            Login
          </Link>
        </div>
      </nav>
      
      <div className="bg-zinc-950 grow relative z-10 min-h-screen">
        {children}
      </div>
      
      <footer className="border-t border-white/5 bg-zinc-950 py-7 relative z-10">
        <div className="mx-auto px-12 flex md:flex-row justify-between items-center gap-6">

          <div className="flex-1"></div>

          <div className="flex items-centers gap-7 text-sm text-neutral-500">
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
          </div>

          <div className="flex-1 flex justify-end">
            <div className="text-xs text-neutral-600">© 2026 Swiipy.</div>
          </div>
        </div>
      </footer>
    </>
  );
}
