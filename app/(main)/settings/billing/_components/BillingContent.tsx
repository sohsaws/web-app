"use client";

import { CreditCard, History, Package, Plus, Sparkles } from "lucide-react";

export default function BillingContent() {
  return (
    <div className="flex-1 px-10">
      <div className="max-w-3xl space-y-10">
        <div className="space-y-1 mb-10">
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Billing
          </h1>
          <p className="text-sm mt-5 font-normal text-neutral-500">
            Manage your subscription, payment methods, and billing history.
          </p>
        </div>
        <div className="border border-white/10 rounded-xl bg-neutral-900/30 backdrop-blur-md shadow-lg shadow-black/20 overflow-hidden">
          <div className="p-6 flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
            <div className="space-y-2">
              <h2 className="text-base font-medium text-white flex items-center gap-3">
                Current Plan
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-800/80 border border-white/5 text-xs font-medium text-neutral-400 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  Free
                </span>
              </h2>
              <p className="text-sm text-neutral-400 max-w-xl leading-relaxed">
                You are currently using the Free plan. Upgrade to unlock premium
                features and advanced workspace tools.
              </p>
            </div>
          </div>
          <div className="px-6 py-4 bg-white/2 border-t border-white/10 flex items-center justify-between">
            <p className="text-xs text-neutral-500 flex items-center gap-1.5">
              <Package size={14} className="text-neutral-400" />
              Standard member benefits
            </p>
            <button className="bg-white text-black hover:bg-neutral-200 transition-colors text-sm font-medium py-2 px-4 rounded-lg shrink-0 shadow-sm flex items-center gap-2 cursor-pointer group">
              <Sparkles
                size={16}
                className="text-zinc-600 group-hover:text-black transition-colors"
              />
              Upgrade to Pro
            </button>
          </div>
        </div>

        <div className="border border-white/10 rounded-xl bg-neutral-900/30 backdrop-blur-md shadow-lg shadow-black/20 overflow-hidden">
          <div className="p-6 border-b border-white/5">
            <h2 className="text-base font-medium text-white">Payment Method</h2>
            <p className="text-sm text-neutral-400 mt-1">
              Configure your primary billing method.
            </p>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center justify-between p-6 hover:bg-white/2 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-7 rounded bg-neutral-800 border border-white/10 flex items-center justify-center text-neutral-400 shrink-0">
                  <CreditCard size={18} strokeWidth={1.5} />
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-white">
                    No payment method added
                  </p>
                  <p className="text-xs text-neutral-500">
                    Add a credit or debit card to manage payments.
                  </p>
                </div>
              </div>
              <button className="text-sm font-medium text-white hover:text-neutral-300 transition-colors flex items-center gap-1.5 cursor-pointer">
                <Plus size={16} />
                Add card
              </button>
            </div>
          </div>
        </div>

        <div className="border border-white/10 rounded-xl bg-neutral-900/30 backdrop-blur-md shadow-lg shadow-black/20 overflow-hidden mt-12">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div>
              <h2 className="text-base font-medium text-white flex items-center gap-3">
                Billing History
              </h2>
              <p className="text-sm text-neutral-400 mt-1">
                View and download your past invoices.
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-neutral-800/50 border border-white/5 flex items-center justify-center text-neutral-400 shrink-0">
              <History size={16} strokeWidth={1.5} />
            </div>
          </div>

          <div className="px-6 py-12 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-neutral-900 border border-white/5 flex items-center justify-center text-neutral-600">
              <History size={24} strokeWidth={1.5} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-neutral-400">
                No invoices yet
              </p>
              <p className="text-xs text-neutral-600">
                Your transaction history will appear here once you make a
                purchase.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
