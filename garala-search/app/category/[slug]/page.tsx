"use client";
import { useState, useEffect, use, useCallback } from 'react';
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
  const [lastSignalTime, setLastSignalTime] = useState<string>("");

  const categoryName = slug.toUpperCase();

  const fetchCategoryAds = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('ads')
      .select('*, groups(name)')
      .eq('category', categoryName)
      .order('created_at', { ascending: false })
      .limit(50); 

    if (!error && data && data.length > 0) {
      setAds(data);
      // Calcul du temps depuis le dernier signal pour l'indice de fraîcheur Google
      const lastAdDate = new Date(data[0].created_at);
      const diffInMinutes = Math.floor((new Date().getTime() - lastAdDate.getTime()) / 60000);
      setLastSignalTime(diffInMinutes < 60 ? `${diffInMinutes} min` : `${Math.floor(diffInMinutes/60)} h`);
    }
    setLoading(false);
  }, [categoryName]);

  useEffect(() => {
    fetchCategoryAds();
  }, [fetchCategoryAds]);

  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased">
      
      {/* --- 1. ENSEIGNE PERMANENTE (SEO SINK) --- */}
      <header className="p-8 border-b border-gray-50 sticky top-0 bg-white/95 backdrop-blur-md z-20">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="text-[9px] font-black text-orange-600 uppercase tracking-[0.4em] mb-6 block">
            ‹ ACCUEIL RADAR
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">
                {categoryName} <br/>
                <span className="text-gray-200 text-3xl md:text-5xl">BANGUI • RCA</span>
              </h1>
            </div>
            
            {lastSignalTime && (
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                  Dernier signal : {lastSignalTime}
                </span>
              </div>
            )}
          </div>

          <div className="mt-8 flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <p>{ads.length} OPPORTUNITÉS ACTIVES</p>
            <p>MISE À JOUR LIVE</p>
          </div>
        </div>
      </header>

      {/* --- 2. GRILLE DE SIGNAL (LENTILLE) --- */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="py-20 flex justify-center"><div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div></div>
        ) : ads.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-px bg-gray-100 border border-gray-100">
            {ads.map((ad) => (
              <div key={ad.id} className="bg-white flex flex-col group relative">
                <Link href={`/ad/${ad.id}`} className="relative aspect-square overflow-hidden block">
                  {ad.image_url ? (
                    <img src={ad.image_url} alt={ad.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-100 uppercase italic">Garala Signal</div>
                  )}
                  
                  {/* Prix en surimpression noire */}
                  <div className="absolute bottom-0 right-0 bg-black text-white px-3 py-1.5 font-black text-sm md:text-lg tracking-tighter">
                    {ad.price > 0 ? ad.price.toLocaleString() : '---'}
                  </div>

                  {ad.clicks_count > 0 && (
                    <div className="absolute top-2 left-2 bg-orange-600 text-white text-[7px] font-black px-1.5 py-0.5 uppercase shadow-xl">
                      🔥 {ad.clicks_count}
                    </div>
                  )}
                </Link>

                <div className="p-4 flex flex-col h-full">
                  <span className="text-[8px] font-black text-orange-500 uppercase tracking-widest mb-1">
                    @{ad.groups?.name || 'WhatsApp'}
                  </span>
                  <Link href={`/ad/${ad.id}`}>
                    <h3 className="text-xs font-bold leading-tight uppercase line-clamp-2 mb-4 flex-1 hover:text-orange-600 transition-colors">
                      {ad.title}
                    </h3>
                  </Link>
                  <a 
                    href={`https://wa.me/${ad.seller_phone}?text=SIGNAL : *${ad.title.toUpperCase()}*`}
                    target="_blank"
                    className="border-2 border-black text-black text-center py-2 text-[9px] font-black uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all active:scale-95"
                  >
                    Prendre
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* --- ÉTAT RARETÉ --- */
          <div className="py-40 text-center max-w-xl mx-auto border-2 border-dashed border-gray-100 rounded-[4rem]">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 italic text-gray-200">Rupture</h2>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-10 px-10">Le flux {categoryName} est actuellement vide à Bangui. Nos bots explorent de nouveaux groupes WhatsApp.</p>
            <Link href="/" className="bg-black text-white px-10 py-5 text-[10px] font-black uppercase tracking-widest rounded-2xl">
              ACTIVER LA TRAQUE
            </Link>
          </div>
        )}
      </main>

      {/* --- 3. FOOTER SEO (MASSE GRAVITATIONNELLE) --- */}
      <footer className="mt-40 p-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[10px] font-black text-gray-300 uppercase leading-loose tracking-[0.3em]">
            RÉPERTOIRE {categoryName} À BANGUI • RCA <br/>
            INDEXATION AUTOMATIQUE DES GROUPES WHATSAPP COMMERCIAUX <br/>
            GARALA SINGULARITÉ : L'INFRASTRUCTURE COMMERCIALE DE LA RÉPUBLIQUE CENTRAFRICAINE
          </p>
          <div className="mt-10 flex justify-center gap-6 opacity-30">
            {['TECH', 'IMMO', 'AUTO', 'MODE', 'SERVICES'].map(c => (
              <Link key={c} href={`/category/${c.toLowerCase()}`} className="text-[9px] font-black hover:opacity-100 transition-opacity uppercase">{c}</Link>
            ))}
          </div>
        </div>
      </footer>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes progress { 0% { transform: translateX(-100%); } 100% { transform: translateX(300%); } }
        .animate-progress { animation: progress 2s infinite linear; }
      `}</style>
    </div>
  );
}
