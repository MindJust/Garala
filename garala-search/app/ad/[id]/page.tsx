import { Metadata, ResolvingMetadata } from 'next';
import { supabase } from '../../../lib/supabase';
import AdClient from './AdClient';

interface Props {
  params: Promise<{ id: string }>;
}

// --- PRIORITÉ SEO : SIGNAL POUR WHATSAPP (RÉSILIENCE MAXIMALE) ---
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const { data: ad, error } = await supabase
      .from('ads')
      .select('title, description, image_url')
      .eq('id', id)
      .single();

    // Si erreur ou pas d'annonce, on renvoie un signal neutre au lieu de planter
    if (error || !ad) {
      return { title: "Annonce Garala Search" };
    }

    return {
      title: ad.title,
      description: ad.description,
      openGraph: {
        title: ad.title,
        description: ad.description,
        url: `https://garala.vercel.app/ad/${id}`,
        siteName: 'Garala Search',
        images: ad.image_url ? [{ url: ad.image_url, width: 1200, height: 630 }] : [],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: ad.title,
        description: ad.description,
        images: ad.image_url ? [ad.image_url] : [],
      }
    };
  } catch (e) {
    // Fail-safe absolu pour éviter l'erreur 500
    return { title: "Garala Search" };
  }
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  // Récupération sécurisée pour le rendu
  const { data: ad } = await supabase
    .from('ads')
    .select('*, groups(name)')
    .eq('id', id)
    .single();

  return <AdClient id={id} initialAd={ad} />;
}
