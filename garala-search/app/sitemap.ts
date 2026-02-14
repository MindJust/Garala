import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

// On force la génération dynamique pour éviter les caches périmés
export const revalidate = 3600; // Rafraîchir toutes les heures

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const BASE_URL = 'https://garala.vercel.app';
  
  // Initialisation du client à l'intérieur pour éviter les fuites de mémoire
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const categories = ["tech", "immo", "auto", "mode", "maison", "services", "divers"];
  
  // 1. Pages Statiques (Le Radar)
  const staticUrls = [{
    url: BASE_URL,
    lastModified: new Date().toISOString(),
    changeFrequency: 'always' as const,
    priority: 1.0,
  }];

  // 2. Pages de Catégories (Matrice de Capture)
  const categoryUrls = categories.map((cat) => ({
    url: `${BASE_URL}/category/${cat}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  try {
    // 3. Tentative d'aspiration des annonces
    const { data: ads, error } = await supabase
      .from('ads')
      .select('id, created_at')
      .order('created_at', { ascending: false })
      .limit(1000);

    if (error || !ads) throw new Error("Supabase unreachable");

    const adsUrls = ads.map((ad) => ({
      url: `${BASE_URL}/ad/${ad.id}`,
      lastModified: new Date(ad.created_at).toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    return [...staticUrls, ...categoryUrls, ...adsUrls];

  } catch (err) {
    // En cas d'erreur BDD, on renvoie au moins les bases pour ne pas bloquer Google
    console.error("Sitemap Fetch Error:", err);
    return [...staticUrls, ...categoryUrls];
  }
}
