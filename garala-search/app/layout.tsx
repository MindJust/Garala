import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 1. CONFIGURATION VIEWPORT (Mobile & Thème)
export const viewport: Viewport = {
  themeColor: "#ea580c", // Couleur orange de la barre d'état Android/Chrome
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Empêche le zoom accidentel (sensation app native)
};

// 2. CONFIGURATION SEO & METADATA
export const metadata: Metadata = {
  metadataBase: new URL('https://garala.vercel.app'), 
  
  // VÉRIFICATION GOOGLE SEARCH CONSOLE
  verification: {
    google: "R-F40Wosi7m-qwT_yfOlFF7H6Huc-jA3qgNODCdt348",
  },

  title: {
    default: "Garala Search - Le Moteur de Recherche WhatsApp",
    template: "%s | Garala Search",
  },
  
  description: "Trouvez facilement les produits, services et annonces partagés dans les groupes WhatsApp. Ventes, achats, immobilier, tech et plus encore.",
  
  keywords: ["WhatsApp", "Annonces", "Vente", "Achat", "RCA", "Bangui", "Marketplace", "Occasion", "Recherche"],
  
  authors: [{ name: "Garala Team" }],
  
  robots: {
    index: true,
    follow: true,
  },

  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Garala",
  },
  
  icons: {
    icon: "/web-app-manifest-192x192.png",
    apple: "/web-app-manifest-192x192.png",
  },

  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://garala.vercel.app",
    title: "Garala Search - Ne cherchez plus, trouvez.",
    description: "Le premier moteur de recherche pour les annonces WhatsApp. Tech, Immo, Mode...",
    siteName: "Garala Search",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Garala Search Aperçu",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Garala Search",
    description: "Trouvez tout ce qui se vend sur WhatsApp.",
    images: ["/opengraph-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-slate-900`}
      >
        {children}
        <Analytics />

        {/* Script Service Worker pour PWA */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(registration) {
                    console.log('SW registered: ', registration.scope);
                  }, function(err) {
                    console.log('SW failed: ', err);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
