import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

// Configuration du client Supabase (version serveur)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const BASE_URL = 'https://garala.vercel.app'; // Remplacer par ton URL réelle

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Récupérer toutes les annonces pour les indexer individuellement
  const { data: ads } = await supabase
    .from('ads')
    .select('id, created_at')
    .order('created_at', { ascending: false });

  const adsUrls = (ads || []).map((ad) => ({
    url: `${BASE_URL}/ad/${ad.id}`,
    lastModified: new Date(ad.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // 2. Récupérer les catégories uniques
  const categories = ["tech", "immo", "auto", "mode", "maison", "services", "divers"];
  const categoryUrls = categories.map((cat) => ({
    url: `${BASE_URL}/category/${cat}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  // 3. Page d'accueil (Le Radar)
  const staticUrls = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'always' as const,
      priority: 1.0,
    },
  ];

  return [...staticUrls, ...categoryUrls, ...adsUrls];
}
