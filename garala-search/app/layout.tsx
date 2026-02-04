import type { Metadata } from "next";
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

// Métadonnées complètes pour le Web, Android et iOS
export const metadata: Metadata = {
  title: "Garala Search",
  description: "Le moteur de recherche des annonces WhatsApp",
  manifest: "/manifest.json",
  // Configuration spécifique pour iOS
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Garala Search",
  },
  // Icônes pour différents supports
  icons: {
    icon: "/web-app-manifest-192x192.png",
    apple: "/web-app-manifest-192x192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        {/* Couleur de la barre d'adresse sur mobile */}
        <meta name="theme-color" content="#ea580c" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}

        {/* Script pour enregistrer le Service Worker (Nécessaire pour PWA & Score PWABuilder) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(registration) {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                  }, function(err) {
                    console.log('ServiceWorker registration failed: ', err);
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
