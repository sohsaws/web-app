import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const InterFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Swiipy",
  description: "AI-Powered Idea Discovery Platform",
  icons: {
    icon: "./icon.png"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
        {children}
      </body>
    </html>
  );
}
