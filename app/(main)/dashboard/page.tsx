

export default function Dashboard() {
  return (
        <div className="min-h-screen bg-zinc-950 text-neutral-400 flex flex-col">
            <main className="relative z-10 pt-32 pb-20 max-w-7xl mx-auto px-6 w-full space-y-12">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-medium text-white tracking-tight">Overview</h1>
                    <p className="text-sm text-neutral-500 font-light">Welcome back, here&apos;s what&apos;s happening today.</p>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-neutral-600">Period:</span>
                    <button className="flex items-center gap-2 px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-xs text-white">
                    <span>Last 30 Days</span>
                    </button>
                </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: 'Total Revenue', value: '$42,892.00', delta: '+12.5%', color: 'emerald' },
                    { title: 'Active Users', value: '8,549', delta: '+8.2%', color: 'emerald' },
                    { title: 'Bounce Rate', value: '42.3%', delta: '-2.1%', color: 'neutral' },
                    { title: 'Avg. Session', value: '4m 32s', delta: '+1.2%', color: 'emerald' },
                ].map((m) => (
                    <div key={m.title} className="group p-6 rounded-2xl border border-white/5 bg-white/2 hover:bg-white/4 transition-all duration-300">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-2 bg-white/5 rounded-lg border border-white/5 text-neutral-400 group-hover:text-white transition-colors">
                        </div>
                        <span className={`flex items-center gap-1 text-[10px] font-medium ${m.color === 'emerald' ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' : 'text-neutral-500 bg-white/5 border-white/10'} px-2 py-1 rounded-full`}>
                        {m.delta}
                        </span>
                    </div>
                    <div>
                        <div className="text-xs font-medium text-neutral-500 mb-1">{m.title}</div>
                        <div className="text-2xl font-medium text-white tracking-tight">{m.value}</div>
                    </div>
                    </div>
                ))}
                </div>

                <section className="w-full rounded-3xl border border-white/5 bg-[#080808] relative overflow-hidden">
                <div className="p-8 flex items-center justify-between">
                    <div>
                    <h2 className="text-base font-medium text-white">Revenue Analytics</h2>
                    <p className="text-xs text-neutral-500 mt-1">Growth comparison year over year</p>
                    </div>
                    <button className="p-2 text-neutral-500 hover:text-white transition-colors border border-transparent hover:border-white/10 hover:bg-white/5 rounded-lg">
                    </button>
                </div>

                <div className="relative h-87.5 w-full px-4 sm:px-8 pb-8">
                    <div className="absolute inset-0 flex flex-col justify-between px-8 pb-12 pt-4 pointer-events-none opacity-20">
                    <div className="w-full h-px border-t border-white/20" />
                    <div className="w-full h-px border-t border-white/20" />
                    <div className="w-full h-px border-t border-white/20" />
                    <div className="w-full h-px border-t border-white/20" />
                    <div className="w-full h-px border-t border-white/20" />
                    </div>

                    <div className="flex justify-between text-[10px] text-neutral-600 font-medium mt-4 px-2">
                    <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>
                </div>
                </section>

                <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 rounded-3xl border border-white/5 bg-[#080808] p-8">
                    <div className="flex items-center justify-between mb-8">
                    <h3 className="text-base font-medium text-white">Top Performers</h3>
                    <button className="text-xs text-neutral-500 hover:text-white">View Report</button>
                    </div>

                    <div className="space-y-6">
                    {[
                        { name: 'John Doe', role: 'Product Designer', initials: 'JD', value: '$12,400' },
                        { name: 'Alice Smith', role: 'Engineering Lead', initials: 'AS', value: '$9,250' },
                        { name: 'Mike Kelly', role: 'Marketing', initials: 'MK', value: '$8,100' },
                    ].map((u) => (
                        <div key={u.name} className="flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-neutral-800 border border-white/5 flex items-center justify-center text-xs text-white">{u.initials}</div>
                            <div>
                            <div className="text-sm font-medium text-white group-hover:text-neutral-300">{u.name}</div>
                            <div className="text-xs text-neutral-600 font-light">{u.role}</div>
                            </div>
                        </div>
                        <div className="text-sm text-white font-medium">{u.value}</div>
                        </div>
                    ))}
                    </div>
                </div>

                <div className="rounded-3xl border border-white/5 bg-[#080808] p-8 flex flex-col justify-between">
                    <div>
                    <h3 className="text-base font-medium text-white mb-6">System Health</h3>
                    <div className="flex flex-col gap-6 relative">
                        <div className="absolute left-1.75 top-2 bottom-2 w-px bg-white/5" />
                        <div className="relative pl-6">
                        <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center">
                            <div className="w-1 h-1 rounded-full bg-emerald-500" />
                        </div>
                        <p className="text-sm text-neutral-300">All systems operational</p>
                        <span className="text-[10px] text-neutral-600">Updated 5m ago</span>
                        </div>
                        <div className="relative pl-6">
                        <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full bg-neutral-800 border border-neutral-600" />
                        <p className="text-sm text-neutral-400">Maintenance scheduled</p>
                        <span className="text-[10px] text-neutral-600">Tomorrow, 02:00 AM</span>
                        </div>
                    </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/5">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-500">Uptime</span>
                        <span className="text-white font-medium">99.99%</span>
                    </div>
                    <div className="w-full h-1 bg-neutral-800 rounded-full mt-2 overflow-hidden">
                        <div className="w-[99%] h-full bg-white/80 rounded-full" />
                    </div>
                    </div>
                </div>
                </div>
            </main>
        </div>
  )
}