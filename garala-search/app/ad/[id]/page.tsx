import { Metadata } from 'next';
import { supabase } from '../../../lib/supabase';
import AdClient from './AdClient';

interface Props {
  params: Promise<{ id: string }>;
}

// --- RECONSTITUTION DU SIGNAL : RÉSILIENCE MAXIMALE ---
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    // On récupère les données
    const { data: ad } = await supabase
      .from('ads')
      .select('title, description, image_url')
      .eq('id', id)
      .single();

    // Si l'annonce n'existe pas, on renvoie un signal neutre (Code 200 quand même)
    if (!ad) {
      return { title: "Annonce Garala" };
    }

    return {
      title: ad.title,
      description: ad.description,
      openGraph: {
        title: ad.title,
        description: ad.description,
        url: `https://garala.vercel.app/ad/${id}`,
        siteName: 'Garala Search',
        // WhatsApp a besoin des dimensions pour afficher l'image au premier chargement
        images: ad.image_url ? [
          {
            url: ad.image_url,
            width: 1200,
            height: 630,
            alt: ad.title,
          }
        ] : [],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: ad.title,
        images: ad.image_url ? [ad.image_url] : [],
      }
    };
  } catch (error) {
    // Fail-safe : en cas d'erreur de connexion, on renvoie un titre par défaut
    // Cela garantit un Code 200 au lieu du Code 500
    return { title: "Garala Search" };
  }
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  
  // Récupération pour le contenu de la page
  const { data: ad } = await supabase
    .from('ads')
    .select('*, groups(name)')
    .eq('id', id)
    .single();

  return <AdClient id={id} initialAd={ad} />;
}
