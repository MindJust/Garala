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
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            // MISE À JOUR : Ajout de https://flagcdn.com dans img-src
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com; img-src 'self' data: https://*.supabase.co https://flagcdn.com; style-src 'self' 'unsafe-inline'; connect-src 'self' https://*.supabase.co;",
          }
        ],
      },
    ];
  },

  // 2. Optimisation des images externes
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      // MISE À JOUR : Autorisation pour les drapeaux
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
