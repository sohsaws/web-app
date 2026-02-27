"use client";

import { useState } from "react";
import { 
  Star, 
  Megaphone, 
  ShieldCheck, 
  MessageCircle, 
  AtSign, 
  BarChart3, 
  ChevronDown,
  Clock,
  Moon
} from "lucide-react";
import { motion } from "framer-motion";

interface ToggleProps {
  enabled: boolean;
  onChange?: (val: boolean) => void;
  disabled?: boolean;
}

const Toggle = ({ enabled, onChange, disabled }: ToggleProps) => (
  <button
    type="button"
    role="switch"
    aria-checked={enabled}
    disabled={disabled}
    onClick={() => onChange?.(!enabled)}
    className={`w-9 h-5 rounded-full flex items-center p-0.5 shrink-0 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-neutral-950 cursor-pointer ${
      disabled ? "bg-white/20 opacity-50 cursor-not-allowed" : enabled ? "bg-white" : "bg-neutral-700 hover:bg-neutral-600"
    }`}
  >
    <motion.div
      animate={{ x: enabled ? 16 : 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={`w-4 h-4 rounded-full shadow-sm ${enabled ? "bg-black" : "bg-white"}`}
    />
  </button>
);

export default function NotificationsContent() {
  const [settings, setSettings] = useState({
    productUpdates: true,
    marketing: false,
    directMessages: true,
    mentions: true,
    workspaceActivity: false,
    quietHours: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex-1 px-10">
      <div className="max-w-3xl space-y-8">
        
        <div className="space-y-1 mb-10">
          <h1 className="text-2xl font-semibold tracking-tight text-white">Notifications</h1>
          <p className="text-sm mt-5 font-normal text-neutral-500">
            Manage how and when you receive updates from Swiipy.
          </p>
        </div>

        <div className="border border-white/10 rounded-xl bg-neutral-900/30 backdrop-blur-md shadow-lg shadow-black/20 overflow-hidden">
          <div className="p-6 border-b border-white/5">
            <h2 className="text-base font-medium text-white">Email Notifications</h2>
            <p className="text-sm text-neutral-400 mt-1">Choose what we can send directly to your inbox.</p>
          </div>
          <div className="flex flex-col">
            
            <div className="flex items-center justify-between p-6 border-b border-white/5 hover:bg-white/2 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-neutral-800/50 border border-white/5 flex items-center justify-center text-neutral-400 shrink-0">
                  <Star size={16} strokeWidth={1.5} />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-sm font-medium text-white">Product Updates</h3>
                  <p className="text-xs text-neutral-500">New features, announcements, and platform updates.</p>
                </div>
              </div>
              <Toggle enabled={settings.productUpdates} onChange={() => toggleSetting('productUpdates')} />
            </div>

            <div className="flex items-center justify-between p-6 border-b border-white/5 hover:bg-white/2 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-neutral-800/50 border border-white/5 flex items-center justify-center text-neutral-400 shrink-0">
                  <Megaphone size={16} strokeWidth={1.5} />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-sm font-medium text-white">Marketing & Offers</h3>
                  <p className="text-xs text-neutral-500">Promotional offers, newsletters, and community news.</p>
                </div>
              </div>
              <Toggle enabled={settings.marketing} onChange={() => toggleSetting('marketing')} />
            </div>

            <div className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-neutral-800/50 border border-white/5 flex items-center justify-center text-neutral-500 shrink-0">
                  <ShieldCheck size={16} strokeWidth={1.5} />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-sm font-medium text-neutral-400">Security Alerts</h3>
                  <p className="text-xs text-neutral-600">Important security updates cannot be disabled for your safety.</p>
                </div>
              </div>
              <Toggle enabled={true} disabled={true} />
            </div>

          </div>
        </div>

        <div className="border border-white/10 rounded-xl bg-neutral-900/30 backdrop-blur-md shadow-lg shadow-black/20 overflow-hidden">
          <div className="p-6 border-b border-white/5">
            <h2 className="text-base font-medium text-white">Push Notifications</h2>
            <p className="text-sm text-neutral-400 mt-1">Manage notifications delivered directly to your devices.</p>
          </div>
          <div className="flex flex-col">
            
            <div className="flex items-center justify-between p-6 border-b border-white/5 hover:bg-white/2 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-neutral-800/50 border border-white/5 flex items-center justify-center text-neutral-400 shrink-0">
                  <MessageCircle size={16} strokeWidth={1.5} />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-sm font-medium text-white">Direct Messages</h3>
                  <p className="text-xs text-neutral-500">Get notified when someone sends you a message.</p>
                </div>
              </div>
              <Toggle enabled={settings.directMessages} onChange={() => toggleSetting('directMessages')} />
            </div>

            <div className="flex items-center justify-between p-6 border-b border-white/5 hover:bg-white/2 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-neutral-800/50 border border-white/5 flex items-center justify-center text-neutral-400 shrink-0">
                  <AtSign size={16} strokeWidth={1.5} />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-sm font-medium text-white">Mentions & Replies</h3>
                  <p className="text-xs text-neutral-500">Get notified when you are mentioned in a thread.</p>
                </div>
              </div>
              <Toggle enabled={settings.mentions} onChange={() => toggleSetting('mentions')} />
            </div>

            <div className="flex items-center justify-between p-6 hover:bg-white/2 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-neutral-800/50 border border-white/5 flex items-center justify-center text-neutral-400 shrink-0">
                  <BarChart3 size={16} strokeWidth={1.5} />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-sm font-medium text-white">Workspace Activity</h3>
                  <p className="text-xs text-neutral-500">Receive a daily digest of activity across your workspace.</p>
                </div>
              </div>
              <Toggle enabled={settings.workspaceActivity} onChange={() => toggleSetting('workspaceActivity')} />
            </div>

          </div>
        </div>

        <div className="border border-white/10 rounded-xl bg-neutral-900/30 backdrop-blur-md shadow-lg shadow-black/20 overflow-hidden mt-12">
          <div className="p-6 flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
            <div className="space-y-2">
              <h2 className="text-base font-medium text-white flex items-center gap-3">
                Quiet Hours
                {settings.quietHours && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-800/80 border border-white/5 text-[10px] font-medium text-emerald-400 shrink-0">
                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse"></span>
                    Active
                  </span>
                )}
              </h2>
              <p className="text-sm text-neutral-400 max-w-xl leading-relaxed">
                Automatically pause all notifications and alerts during your specified downtime.
              </p>
            </div>
          </div>
          <div className="px-6 py-4 bg-white/2 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-medium text-neutral-500 uppercase tracking-tight">From</span>
                <button className="bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-neutral-300 flex items-center gap-2 cursor-pointer hover:border-white/30 hover:text-white transition-all select-none">
                  10:00 PM
                  <ChevronDown size={12} className="text-neutral-500" />
                </button>
              </div>
              <div className="text-neutral-700 select-none">
                <Clock size={12} />
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-medium text-neutral-500 uppercase tracking-tight">To</span>
                <button className="bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-neutral-300 flex items-center gap-2 cursor-pointer hover:border-white/30 hover:text-white transition-all select-none">
                  08:00 AM
                  <ChevronDown size={12} className="text-neutral-500" />
                </button>
              </div>
            </div>

            <Toggle enabled={settings.quietHours} onChange={() => toggleSetting('quietHours')} />
          </div>
        </div>

      </div>
    </div>
  );
}
