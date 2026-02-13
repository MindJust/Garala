import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Configuration des en-têtes de sécurité
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY', // Empêche l'affichage dans un iframe (anti-clickjacking)
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff', // Empêche le navigateur d'interpréter les fichiers comme autre chose
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()', // Sécurité : bloque l'accès aux capteurs
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com; img-src 'self' data: https://*.supabase.co; style-src 'self' 'unsafe-inline'; connect-src 'self' https://*.supabase.co;",
          }
        ],
      },
    ];
  },

  // 2. Optimisation des images externes (Supabase)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co', // Autorise toutes les images venant de ton Supabase
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
