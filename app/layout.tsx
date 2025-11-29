import type { Metadata } from "next";
// import { Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BottomNav } from "@/components/mobile/bottom-nav";
import { CookieConsent } from "@/components/features/legal/cookie-consent";
import { Toaster } from "sonner";

// const outfit = Outfit({
//   subsets: ["latin"],
//   variable: "--font-outfit",
// });

export const metadata: Metadata = {
  title: "Garala - Tout se vend, tout s'achète",
  description: "Plateforme de petites annonces en République Centrafricaine",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Garala",
  },
};

export function generateViewport() {
  return {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    themeColor: "#3b82f6",
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-foreground">
        <Providers>
          <div className="flex flex-col min-h-screen pb-20 md:pb-0">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <BottomNav />
          <CookieConsent />
          <Toaster position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
