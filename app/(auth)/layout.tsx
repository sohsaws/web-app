import Link from "next/link";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <nav className="fixed top-0 flex w-full z-50 items-center">
        <div className="pt-10 px-15 max-w-7xl mx-auto w-full">
          <Link
            href="/"
            className="text-3xl font-serif text-white tracking-tight"
          >
            Swiipy
          </Link>
        </div>
      </nav>
      <div className="relative z-10">{children}</div>
    </>
  );
}
