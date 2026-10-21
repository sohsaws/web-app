import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import type { ReactElement, ReactNode } from "react";
import { Toaster } from "sonner";
import { QueryProvider } from "@/components/providers/query-provider.client";
import { routing } from "@/i18n/routing";

import "../globals.css";

const InterFont = Inter({
  variable: "--font-inter",
  // Cyrillic for Russian; latin-ext for the rare letters latin lacks (ẞ, Ÿ).
  // unicode-range keeps the extra files from loading until a page needs them.
  subsets: ["latin", "latin-ext", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Swiipy",
  description: "AI-Powered Idea Discovery Platform",
  icons: {
    // Absolute: a relative path would resolve under the locale prefix.
    icon: "/icon.png",
  },
};

// Prerenders every static page once per locale.
export function generateStaticParams(): { locale: string }[] {
  return routing.locales.map((locale) => ({ locale }));
}

// No session read here: request-time APIs in the root layout would make every
// route dynamic, including the static marketing pages. The locale comes from
// the URL through next/root-params, which keeps static rendering.
export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>): Promise<ReactElement> {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body
        className={`${InterFont.variable} min-h-app-screen-height overflow-x-hidden bg-app-bg font-sans text-app-fg antialiased selection:bg-app-selection-bg selection:text-app-selection-fg`}
      >
        <div className="pointer-events-none fixed inset-0 z-0">
          <div className="absolute top-0 left-1/2 h-app-glow-height w-app-screen-width -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-app-glow/30 via-app-bg/80 to-transparent opacity-60" />
        </div>
        <Toaster
          position="bottom-center"
          richColors
          theme="dark"
          duration={5000}
          closeButton
          className="border-app-toast-border/20 bg-app-toast-bg/95 backdrop-blur-md"
        />
        <NextIntlClientProvider>
          <QueryProvider>{children}</QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
