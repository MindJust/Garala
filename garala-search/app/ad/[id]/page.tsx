import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js'; // Import direct pour le serveur
import AdClient from './AdClient';

interface Props {
  params: Promise<{ id: string }>;
}

// Fonction utilitaire pour éviter l'erreur 500
async function getAdData(id: string) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data } = await supabase
      .from('ads')
      .select('*, groups(name)')
      .eq('id', id)
      .single();
    return data;
  } catch (e) {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const ad = await getAdData(id);

  if (!ad) return { title: "Garala Search" };

  return {
    title: ad.title,
    description: ad.description,
    openGraph: {
      title: ad.title,
      description: ad.description,
      url: `https://garala.vercel.app/ad/${id}`,
      siteName: 'Garala Search',
      type: 'website',
      images: ad.image_url ? [
        {
          url: ad.image_url,
          width: 800,
          height: 600,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: ad.title,
      images: ad.image_url ? [ad.image_url] : [],
    }
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const ad = await getAdData(id);

  // On renvoie 200 OK quoi qu'il arrive
  return <AdClient id={id} initialAd={ad} />;
}
