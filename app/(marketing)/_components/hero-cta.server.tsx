import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactElement } from "react";

interface HeroCtaProps {
  isSignedIn: boolean;
}

export function HeroCta({ isSignedIn }: HeroCtaProps): ReactElement {
  return (
    <Link
      href={isSignedIn ? "/dive" : "/register"}
      className="group relative isolate inline-flex min-h-12 items-center gap-2 rounded-full bg-black px-8 text-sm font-medium tracking-wide text-white shadow-[0_0_40px_rgb(255_255_255/0.08)] ring-1 ring-white/10 ring-inset transition-shadow duration-300 hover:shadow-[0_0_60px_rgb(255_255_255/0.18)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:transition-none"
    >
      <span
        aria-hidden="true"
        className="shine-border pointer-events-none absolute inset-0 rounded-[inherit] motion-safe:animate-shine"
      />
      <span className="relative">Dare to decide</span>
      <ArrowRight
        aria-hidden="true"
        className="relative size-4 transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none"
      />
    </Link>
  );
}
