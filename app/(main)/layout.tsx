import { BellRing } from "lucide-react";
import Link from "next/link";
import Dropdown from "@/components/Dropdown";
import { SessionProvider } from "next-auth/react";

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <nav className="fixed top-0 w-full z-50 bg-zinc-900 border-b border-white/5 h-20">
                <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
                    <Link href="#" className="flex text-3xl font-serif text-white tracking-tight">
                        Swiipy
                    </Link>

                    <div className="hidden md:flex items-center gap-2 bg-neutral-900/60 border border-white/10 rounded-full py-1.5 px-2 backdrop-blur-md shadow-2xl shadow-black/50">
                        <Link 
                            href='#' 
                            className="px-4 py-1.5 text-xs font-medium text-neutral-400 hover:text-white hover:bg-white/5 rounded-full transition-all duration-200"
                        >
                        Overview
                        </Link>
                        <Link 
                            href="#" 
                            className="px-4 py-1.5 text-xs font-medium text-neutral-400 hover:text-white hover:bg-white/5 rounded-full transition-all duration-200"
                        >
                        Dive
                        </Link>
                        <Link 
                            href="#" 
                            className="px-4 py-1.5 text-xs font-medium text-neutral-400 hover:text-white hover:bg-white/5 rounded-full transition-all duration-200"
                        >
                        Explore
                        </Link>
                    </div>

                    <div className="flex justify-end w-24 gap-7">
                        <button className="text-neutral-500 hover:text-white transition-colors cursor-pointer">
                            <BellRing className="w-6 h-6" />
                        </button>
                        <Dropdown />
                    </div>
                </div>
            </nav>

            <div>
                <SessionProvider>{children}</SessionProvider>
            </div>
        </>
    );
}