import Link from "next/link";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-zinc-900 border-b border-white/5 h-20">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link
            href="/"
            className="flex text-3xl font-serif text-white tracking-tight"
          >
            Swiipy
          </Link>

          <div className="hidden md:flex items-center gap-2 bg-neutral-900/60 border border-white/10 rounded-full py-1.5 px-2 backdrop-blur-md shadow-2xl shadow-black/50">
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

          <div className="flex justify-end w-24">
            <Link
              href="/login"
              className="hover:bg-neutral-200 transition-colors duration-200 text-xs font-semibold text-black tracking-tight bg-white rounded-full pt-2 pr-5 pb-2 pl-5"
            >
              Login
            </Link>
          </div>
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
