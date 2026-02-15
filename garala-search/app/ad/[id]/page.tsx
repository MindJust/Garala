import { Metadata, ResolvingMetadata } from 'next';
import { supabase } from '../../../lib/supabase';
import AdClient from './AdClient'; // Nous allons créer ce fichier juste après

interface Props {
  params: Promise<{ id: string }>;
}

// --- PRIORITÉ SEO : SIGNAL POUR WHATSAPP (SERVEUR) ---
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;

  const { data: ad } = await supabase
    .from('ads')
    .select('title, description, image_url')
    .eq('id', id)
    .single();

  if (!ad) return { title: "Annonce introuvable" };

  return {
    title: ad.title,
    description: ad.description,
    openGraph: {
      title: ad.title,
      description: ad.description,
      images: ad.image_url ? [ad.image_url] : [],
      type: 'article',
      url: `https://garala.vercel.app/ad/${id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: ad.title,
      description: ad.description,
      images: ad.image_url ? [ad.image_url] : [],
    },
  };
}

// --- LA PAGE (SERVEUR) ---
export default async function Page({ params }: Props) {
  const { id } = await params;

  // On récupère les données une seule fois côté serveur
  const { data: ad } = await supabase
    .from('ads')
    .select('*, groups(name)')
    .eq('id', id)
    .single();

  // On passe les données au composant Client pour l'interactivité
  return <AdClient id={id} initialAd={ad} />;
}
