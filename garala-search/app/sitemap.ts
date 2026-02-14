import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

// Directive pour forcer le rendu dynamique à chaque requête de Google
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const BASE_URL = 'https://garala.vercel.app';
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const categories = ["tech", "immo", "auto", "mode", "maison", "services", "divers"];
  
  // 1. Pages de base
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1,
    },
    ...categories.map((cat) => ({
      url: `${BASE_URL}/category/${cat}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }))
  ];

  try {
    // 2. Récupération des annonces
    const { data: ads } = await supabase
      .from('ads')
      .select('id, created_at')
      .order('created_at', { ascending: false })
      .limit(2000);

    if (!ads) return staticUrls;

    const adsUrls: MetadataRoute.Sitemap = ads.map((ad) => ({
      url: `${BASE_URL}/ad/${ad.id}`,
      lastModified: new Date(ad.created_at),
      changeFrequency: 'weekly',
      priority: 0.6,
    }));

    return [...staticUrls, ...adsUrls];

  } catch (err) {
    return staticUrls;
  }
}
