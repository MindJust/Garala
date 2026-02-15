import { Metadata, ResolvingMetadata } from 'next';
import { supabase } from '../../../lib/supabase'; // On utilise ton instance existante
import AdClient from './AdClient'; // Nous allons créer ce fichier juste après

interface Props {
  params: Promise<{ id: string }>;
}

// --- PRIORITÉ SEO : SIGNAL POUR WHATSAPP (SERVEUR) ---
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  // REQUÊTE RÉPARÉE
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
      url: `https://garala.vercel.app/ad/${id}`,
      siteName: 'Garala Search',
      images: ad.image_url ? [{ url: ad.image_url }] : [], // WhatsApp préfère la simplicité ici
      type: 'website',
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
