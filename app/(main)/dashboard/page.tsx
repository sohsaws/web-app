

export default function Dashboard() {
  return (
        <div className="min-h-screen bg-zinc-950 text-neutral-400 flex flex-col">
            <main className="relative z-10 pt-32 pb-20 max-w-7xl mx-auto px-6 w-full space-y-12">

                <section className="w-full rounded-3xl border border-white/5 bg-[#080808] relative overflow-hidden">
                    <div className="p-8 flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-medium text-white">Revenue Analytics</h2>
                            <p className="text-xs text-neutral-500 mt-1">Growth comparison year over year</p>
                        </div>
                        <button className="p-2 text-neutral-500 hover:text-white transition-colors border border-transparent hover:border-white/10 hover:bg-white/5 rounded-lg">
                        </button>
                    </div>
                </section>
            </main>
        </div>
  )
}