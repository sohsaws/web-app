"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { User } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Logout } from "@/lib/Oauth"

export default function Dropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function ClickOutside(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('click', ClickOutside);
        return () => document.removeEventListener('click', ClickOutside);
    }, []);

    return (
        <div ref={menuRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="w-8 h-8 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center hover:border-white/30 text-neutral-400 hover:text-white cursor-pointer"
            >
                <User />
            </button>

            <div className="relative">
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.98 }}
                            transition={{ duration: 0.18 }}
                            className="absolute left-1/2 top-full mt-2 w-48 -translate-x-1/2 origin-top-right z-50"
                        >
                            <div className="bg-neutral-900 border px-3 py-2 border-white/10 rounded-lg shadow-lg">
                                <ul className="w-full">
                                    <li className="w-full">
                                        <Link 
                                            href="/profile" 
                                            className="block w-full text-center px-4 py-3 text-sm text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                        >Profile</Link>
                                    </li>
                                    <li className="w-full">
                                        <Link 
                                            href="#" 
                                            className="block w-full text-center px-4 py-3 text-sm text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                        >Settings</Link>
                                    </li>
                                    <li className="w-full">
                                        <Link 
                                            href="#" 
                                            className="block w-full text-center px-10 py-3 text-sm text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                            onClick={Logout}
                                        >Sign out</Link>
                                    </li>
                                </ul>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}