import Link from "next/link";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <nav className="fixed flex w-full z-50 pt-10 pr-8 pl-8 top-0 left-0 items-center">
        <div className="flex shrink-0 w-24 items-center">
          <Link
            href="/"
            className="pl-7 pb-4 text-3xl font-serif text-white tracking-tight"
          >
            Swiipy
          </Link>
        </div>
      </nav>

      <div className="relative z-10">{children}</div>
    </>
  );
}
