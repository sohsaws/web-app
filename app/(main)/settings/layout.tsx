import SideBar from "@/components/SideBar";

export default function SettingsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen bg-zinc-950 text-neutral-400 flex flex-col">
            <div className="relative z-1 pt-32 pb-20 max-w-7xl mx-auto px-4 w-full">
                <div className="flex gap-12">
                    <SideBar />
                    {children}
                </div>
            </div>
        </div>
    );
}