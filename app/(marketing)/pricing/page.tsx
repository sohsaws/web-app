'use client';

import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section className="max-w-6xl mx-auto px-6 py-25">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-medium text-white tracking-tight mb-4">
          Simple, transparent pricing
        </h2>
        <p className="text-neutral-500 text-sm">No hidden fees. Cancel anytime.</p>

        <div className="flex items-center justify-center mt-8 gap-3">
          <span className="text-sm text-white">Monthly</span>
          <label htmlFor="toggle" className="flex items-center cursor-pointer relative">
            <input
              type="checkbox"
              id="toggle"
              checked={isYearly}
              onChange={(e) => setIsYearly(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-white/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neutral-600"></div>
          </label>
          <span className="text-sm text-neutral-500">Yearly</span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-8 rounded-2xl border border-white/5 bg-neutral-900/10 flex flex-col">
          <div className="mb-4">
            <h3 className="text-white font-medium">Starter</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-3xl font-medium text-white tracking-tight">$0</span>
              <span className="text-sm text-neutral-500">/mo</span>
            </div>
            <p className="text-xs text-neutral-500 mt-2">Perfect for side projects.</p>
          </div>
          <ul className="space-y-3 mb-8 flex-1">
            <li className="flex items-center gap-3 text-sm text-neutral-300">
              <CheckCircle className="text-neutral-500" size={18} strokeWidth={1.5} />
              1 Project
            </li>
            <li className="flex items-center gap-3 text-sm text-neutral-300">
              <CheckCircle className="text-neutral-500" size={18} strokeWidth={1.5} />
              Community Support
            </li>
            <li className="flex items-center gap-3 text-sm text-neutral-300">
              <CheckCircle className="text-neutral-500" size={18} strokeWidth={1.5} />
              5GB Storage
            </li>
          </ul>
          <Link
            href="#"
            className="block w-full py-2.5 text-center text-sm font-medium border border-neutral-700 rounded-lg text-white hover:bg-neutral-800 transition-colors"
          >
            Start Free
          </Link>
        </div>

        <div className="p-8 rounded-2xl border border-white/10 bg-white/3 relative flex flex-col">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-white text-black text-[10px] font-bold uppercase tracking-wider rounded-full">
            Most Popular
          </div>
          <div className="mb-4">
            <h3 className="text-white font-medium">Pro</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-3xl font-medium text-white tracking-tight">
                ${isYearly ? '24' : '29'}
              </span>
              <span className="text-sm text-neutral-500">/mo</span>
            </div>
            <p className="text-xs text-neutral-500 mt-2">For growing teams.</p>
          </div>
          <ul className="space-y-3 mb-8 flex-1">
            <li className="flex items-center gap-3 text-sm text-white">
              <CheckCircle className="text-white" size={18} strokeWidth={1.5} />
              Unlimited Projects
            </li>
            <li className="flex items-center gap-3 text-sm text-white">
              <CheckCircle className="text-white" size={18} strokeWidth={1.5} />
              Priority Support
            </li>
            <li className="flex items-center gap-3 text-sm text-white">
              <CheckCircle className="text-white" size={18} strokeWidth={1.5} />
              100GB Storage
            </li>
            <li className="flex items-center gap-3 text-sm text-white">
              <CheckCircle className="text-white" size={18} strokeWidth={1.5} />
              Analytics
            </li>
          </ul>
          <Link
            href="#"
            className="block w-full py-2.5 text-center text-sm font-medium bg-white text-black rounded-lg hover:bg-neutral-200 transition-colors"
          >
            Get Pro
          </Link>
        </div>

        <div className="p-8 rounded-2xl border border-white/5 bg-neutral-900/10 flex flex-col">
          <div className="mb-4">
            <h3 className="text-white font-medium">Enterprise</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-3xl font-medium text-white tracking-tight">Custom</span>
            </div>
            <p className="text-xs text-neutral-500 mt-2">For large scale needs.</p>
          </div>
          <ul className="space-y-3 mb-8 flex-1">
            <li className="flex items-center gap-3 text-sm text-neutral-300">
              <CheckCircle className="text-neutral-500" size={18} strokeWidth={1.5} />
              Dedicated Success Manager
            </li>
            <li className="flex items-center gap-3 text-sm text-neutral-300">
              <CheckCircle className="text-neutral-500" size={18} strokeWidth={1.5} />
              24/7 SLA Support
            </li>
            <li className="flex items-center gap-3 text-sm text-neutral-300">
              <CheckCircle className="text-neutral-500" size={18} strokeWidth={1.5} />
              Unlimited Storage
            </li>
            <li className="flex items-center gap-3 text-sm text-neutral-300">
              <CheckCircle className="text-neutral-500" size={18} strokeWidth={1.5} />
              SSO & Audit Logs
            </li>
          </ul>
          <Link
            href="#"
            className="block w-full py-2.5 text-center text-sm font-medium border border-neutral-700 rounded-lg text-white hover:bg-neutral-800 transition-colors"
          >
            Contact Sales
          </Link>
        </div>
      </div>
    </section>
  );
}
