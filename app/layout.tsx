import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BottomNav } from "@/components/mobile/bottom-nav";
import { CookieConsent } from "@/components/features/legal/cookie-consent";
import { GlobalVibrations } from "@/components/global-vibrations";
import { Toaster } from "sonner";
// });

export const metadata: Metadata = {
  title: "Garala - Petites annonces en Centrafrique",
  description:
    "Achetez et vendez facilement en République Centrafricaine. Trouvez des annonces locales pour immobilier, véhicules, électronique et plus.",
  keywords: [
    "petites annonces",
    "Centrafrique",
    "Bangui",
    "vendre",
    "acheter",
    "immobilier",
    "voitures",
  ],
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  manifest: '/manifest.json',
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
          <GlobalVibrations />
          <Toaster position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
