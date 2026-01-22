export default function About() {
  return (
    <section className="max-w-6xl mx-auto px-6 space-y-24 py-32">
      {/* Problem & Solution */}
      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        <div className="space-y-4">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">
            The Problem
          </span>
          <h3 className="text-xl font-medium text-white tracking-tight">
            Complexity slows you down
          </h3>
          <p className="text-sm leading-relaxed text-neutral-400">
            Modern software development has become cluttered. Excessive boilerplate, fragmented
            tools, and steep learning curves create friction that kills momentum. You spend more
            time configuring than creating.
          </p>
        </div>
        <div className="space-y-4">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">
            The Solution
          </span>
          <h3 className="text-xl font-medium text-white tracking-tight">
            Radical simplicity
          </h3>
          <p className="text-sm leading-relaxed text-neutral-400">
            Swiipy strips away the noise. We provide a cohesive, opinionated ecosystem that just
            works. By unifying the essential primitives, we give you a solid foundation to build
            incredible products in record time.
          </p>
        </div>
      </div>

      {/* How It Works */}
      <div className="border-t border-white/5 pt-16">
        <div className="mb-10">
          <h2 className="text-2xl font-medium text-white tracking-tight">How It Works</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="relative group">
            <div className="text-5xl font-bold text-neutral-800 mb-4 select-none group-hover:text-neutral-700 transition-colors">
              01
            </div>
            <h4 className="text-white font-medium mb-2">Connect your data</h4>
            <p className="text-sm text-neutral-500">
              Integrate with any database or API using our zero-config connectors.
            </p>
          </div>
          <div className="relative group">
            <div className="text-5xl font-bold text-neutral-800 mb-4 select-none group-hover:text-neutral-700 transition-colors">
              02
            </div>
            <h4 className="text-white font-medium mb-2">Build visual logic</h4>
            <p className="text-sm text-neutral-500">
              Construct workflows visually without sacrificing code-level control.
            </p>
          </div>
          <div className="relative group">
            <div className="text-5xl font-bold text-neutral-800 mb-4 select-none group-hover:text-neutral-700 transition-colors">
              03
            </div>
            <h4 className="text-white font-medium mb-2">Deploy instantly</h4>
            <p className="text-sm text-neutral-500">
              Push to our global edge network with a single click. No devops required.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
