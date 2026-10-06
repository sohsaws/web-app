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
      className="group inline-flex min-h-12 items-center gap-2.5 rounded-full bg-[#ece8e1] px-7 text-sm font-semibold text-black shadow-[0_8px_30px_rgb(0_0_0/0.45)] transition-[translate,background-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:bg-white hover:shadow-[0_14px_40px_rgb(255_255_255/0.16)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:transition-colors motion-reduce:hover:translate-y-0"
    >
      Dare to decide
      <ArrowRight
        aria-hidden="true"
        className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none"
      />
    </Link>
  );
}
