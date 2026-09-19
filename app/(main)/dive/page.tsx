import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactElement } from "react";
import { auth } from "@/lib/auth";
import { CardsPool } from "./_components/cards-pool.client";
import Link from 'next/link';

export default async function Dive(): Promise<ReactElement> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login?reason=unauthorized");
  }

  const userBio = session.user.bio;

  if (!userBio) {
    return (
      <main className="relative z-10 pt-32 pb-20 max-w-7xl mx-auto px-6 w-full space-y-12">
        <section className="w-full rounded-3xl border border-white/5 bg-[#080808] relative overflow-hidden">
          <div className="p-8 flex items-center justify-between">
            <h2 className="text-base font-medium text-white">
              Your bio is empty. Please, type something to see ideas
            </h2>					
            <Link
              href='/settings/profile' 
              className="p-2 text-neutral-500 hover:text-white transition-colors border 
              border-transparent hover:border-white/10 hover:bg-white/5 rounded-lg"
            >
              Go to Profile
            </Link>
          </div>
        </section>
		  </main>
    )
  }

  return (
    <main className="relative z-10 mx-auto flex min-h-dvh w-app-screen-width items-center justify-center text-app-fg sm:px-6 sm:pt-32">
      <section
        aria-labelledby="cards-heading"
        className="min-w-0 w-app-shell rounded-3xl border border-white/5 bg-app-bg sm:p-8"
      >
        <header>
          <h1 id="cards-heading" className="text-base font-medium text-white">
            Cards
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            Discover ideas, one card at a time.
          </p>
        </header>

        <div className="flex min-h-72 flex-col items-center justify-center gap-3 text-center sm:min-h-96">
          <CardsPool userBio={userBio}/>
        </div>
      </section>
    </main>
  );
}
