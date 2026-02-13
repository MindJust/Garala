import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  metadataBase: new URL('https://garala.vercel.app'), // Mets ton URL Vercel ici
  
  title: {
    default: "Garala Search - Le Moteur de Recherche WhatsApp",
    template: "%s | Garala Search", // Permettra d'avoir "iPhone 13 | Garala Search"
  },
  
  description: "Trouvez facilement les produits, services et annonces partagés dans les groupes WhatsApp. Ventes, achats, immobilier, tech et plus encore.",
  
  keywords: ["WhatsApp", "Annonces", "Vente", "Achat", "Togo", "Lomé", "Marketplace", "Occasion", "Recherche"],
  
  authors: [{ name: "Garala Team" }],
  
  // Configuration pour les robots Google
  robots: {
    index: true,
    follow: true,
  },

  // Configuration PWA
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Garala",
  },
  
  // Icônes
  icons: {
    icon: "/web-app-manifest-192x192.png",
    apple: "/web-app-manifest-192x192.png",
  },

  // Affichage sur les réseaux sociaux (WhatsApp, FB)
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://garala.vercel.app",
    title: "Garala Search - Ne cherchez plus, trouvez.",
    description: "Le premier moteur de recherche pour les annonces WhatsApp. Tech, Immo, Mode...",
    siteName: "Garala Search",
    images: [
      {
        url: "/opengraph-image.png", // L'image qu'on a créée tout à l'heure
        width: 1200,
        height: 630,
        alt: "Garala Search Aperçu",
      },
    ],
  },

  // Affichage sur Twitter/X
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
