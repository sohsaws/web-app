import AnimatedSearch from '@/components/AnimatedSearch';

export default function Home() {
  return (
    <main className="flex flex-col w-full relative items-center justify-center min-h-screen pb-15">
      <div className="text-center max-w-4xl mx-auto space-y-10 mb-20 px-6">
        <h1 className="text-5xl md:text-7xl font-medium tracking-tight text-white leading-[1.1]">
          <span className="font-serif text-transparent bg-clip-text bg-linear-to-b from-white via-white to-white/40">
            Swipe. Decide. <br/>Done.
          </span>
        </h1>
        <p className="text-base md:text-lg font-light text-neutral-500 tracking-tight max-w-lg mx-auto">
          From vacation spots to startup ideas — clarity is just a swipe away
        </p>
      </div>

      <AnimatedSearch />

    </main>
  );
}
