"use client";
import { useState, useEffect, use } from 'react';
import { supabase } from '../../../lib/supabase';
import Link from 'next/link';

interface Ad {
  id: number; title: string; price: number; category: string;
  image_url: string | null; seller_phone: string | null; created_at: string;
  clicks_count: number; groups: { name: string } | null;
}

export default function CategorySink({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  const categoryName = slug.toUpperCase();

  useEffect(() => {
    const fetchCategoryAds = async () => {
      const { data, error } = await supabase
        .from('ads')
        .select('*, groups(name)')
        .eq('category', categoryName)
        .order('created_at', { ascending: false })
        .limit(50); // Agrégat de tension : les 50 derniers

      if (!error) setAds(data || []);
      setLoading(false);
    };
    fetchCategoryAds();
  }, [categoryName]);

  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased">
      {/* 1. ENSEIGNE PERMANENTE (SEO SINK) */}
      <header className="p-6 border-b border-gray-100 sticky top-0 bg-white z-20">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="text-[10px] font-black text-orange-600 uppercase tracking-[0.3em] mb-4 block">
            ‹ Retour Garala
          </Link>
          <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">
            {categoryName} <span className="text-gray-200">À BANGUI</span>
          </h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            {ads.length} dernières opportunités extraites de WhatsApp
          </p>
        </div>
      </header>

      {/* 2. GRILLE DE SIGNAL (LENTILLE) */}
      <main className="max-w-6xl mx-auto p-6">
        {loading ? (
          <div className="py-20 flex justify-center"><div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div></div>
        ) : ads.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12">
            {ads.map((ad) => (
              <div key={ad.id} className="flex flex-col group">
                <Link href={`/ad/${ad.id}`} className="relative aspect-[3/4] bg-gray-50 mb-3 overflow-hidden block">
                  {ad.image_url ? (
                    <img src={ad.image_url} alt={ad.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-200 font-black italic text-xl">GARALA</div>
                  )}
                  {ad.clicks_count > 0 && (
                    <div className="absolute top-2 left-2 bg-orange-600 text-white text-[7px] font-black px-2 py-1 uppercase shadow-xl">
                      🔥 {ad.clicks_count}
                    </div>
                  )}
                </Link>
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    {ad.groups?.name || 'WhatsApp'}
                  </span>
                  <Link href={`/ad/${ad.id}`}>
                    <h3 className="text-xs font-bold leading-tight uppercase line-clamp-2 mb-2 hover:text-orange-600">
                      {ad.title}
                    </h3>
                  </Link>
                  <p className="text-lg font-black tracking-tighter mb-4">
                    {ad.price > 0 ? ad.price.toLocaleString() : '---'} <span className="text-[8px] font-bold text-gray-300">FCFA</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* AXE 4 : CAPTURE DE LA RARETÉ */
          <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-[3rem]">
            <h2 className="text-xl font-black uppercase mb-4">0 {categoryName} DISPONIBLE</h2>
            <p className="text-gray-400 text-[10px] font-bold uppercase mb-8">La tension est maximale. Nous scannons les groupes...</p>
            <Link href="/" className="bg-black text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest">
              Alertez-moi
            </Link>
          </div>
        )}
      </main>

      {/* FOOTER SEO (PUITS SÉMANTIQUE) */}
      <footer className="mt-20 p-10 bg-gray-50 text-center border-t border-gray-100">
        <p className="text-[9px] font-black text-gray-300 uppercase leading-loose tracking-[0.2em]">
          Indexation automatisée RCA • Bangui • {categoryName} • Petites Annonces WhatsApp • Garala Singularité
        </p>
      </footer>
    </div>
  );
}
