import AnimatedSearch from '@/components/AnimatedSearch';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="bg-zinc-950 grow flex flex-col w-full z-10 relative items-center justify-center min-h-screen">
      <nav className="fixed flex w-full z-50 pt-10 pr-8 pl-8 top-0 left-0 items-center justify-between">
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
            href="/content"
            className="px-4 py-1.5 text-xs font-medium text-neutral-400 hover:text-white hover:bg-white/5 rounded-full transition-all duration-200"
          >
            Content
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

      <div className="text-center max-w-4xl mx-auto space-y-10 mb-20 px-6">
        <h1 className="text-5xl md:text-7xl font-medium tracking-tight text-white leading-[1.1]">
          <span className="font-serif text-transparent bg-clip-text bg-linear-to-b from-white via-white to-white/40">
            Swipe. Decide. <br />Done.
          </span>
        </h1>
        <p className="text-base md:text-lg font-light text-neutral-500 tracking-tight max-w-lg mx-auto leading-relaxed">
          From vacation spots to startup ideas — clarity is just a swipe away
        </p>
      </div>

      <AnimatedSearch />

      <footer className="absolute bottom-8 w-full text-center pb-4 pt-4">
        <p className="text-[10px] text-neutral-700 uppercase tracking-widest font-medium">
          © Swiipy Inc.
        </p>
      </footer>
    </main>
  );
}
