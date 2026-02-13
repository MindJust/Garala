"use client";
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

interface Ad {
  id: number; title: string; price: number; category: string;
  image_url: string | null; seller_phone: string | null;
  created_at: string; group_id: string; clicks_count: number;
  transaction_type: string;
  groups: { name: string; id: string; } | null;
}

const CATEGORIES_LIST = ["TECH", "IMMO", "AUTO", "MODE", "MAISON", "SERVICES", "DIVERS"];

export default function Home() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('TOUT');
  const [liveCount, setLiveCount] = useState(0);
  const [lastAdTime, setLastAdTime] = useState<string>(""); // Pour le signal de vie
  const [catStats, setCatStats] = useState<Record<string, number>>({});
  
  const [showAlertForm, setShowAlertForm] = useState(false);
  const [userPhone, setUserPhone] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // 1. LOI DE L'ASPIRATION : Focus & Signal de Vie
  useEffect(() => {
    if (searchInputRef.current) searchInputRef.current.focus();
    fetchSystemSignals();
  }, []);

  const fetchSystemSignals = async () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    // Récupérer le compte ET la dernière annonce pour le temps relatif
    const { data, count } = await supabase.from('ads')
      .select('created_at', { count: 'exact' })
      .gt('created_at', yesterday)
      .order('created_at', { ascending: false })
      .limit(1);

    setLiveCount(count || 0);

    if (data && data.length > 0) {
      const diff = Math.floor((new Date().getTime() - new Date(data[0].created_at).getTime()) / 60000);
      setLastAdTime(diff < 1 ? "À L'INSTANT" : diff < 60 ? `IL Y A ${diff} MIN` : `IL Y A ${Math.floor(diff/60)} H`);
    }

    const stats: Record<string, number> = {};
    for (const cat of CATEGORIES_LIST) {
      const { count: c } = await supabase.from('ads').select('*', { count: 'exact', head: true }).eq('category', cat).gt('created_at', yesterday);
      stats[cat] = c || 0;
    }
    setCatStats(stats);
  };

  const resolveSynonyms = async (term: string) => {
    const cleanTerm = term.toLowerCase().trim();
    const { data } = await supabase.from('search_synonyms').select('target').eq('term', cleanTerm).single();
    return data ? data.target : term;
  };

  const registerClick = async (adId: number) => {
    try { await supabase.rpc('increment_clicks', { row_id: adId }); } catch (e) {}
  };

  const createScarcityAlert = async () => {
    if (!userPhone || !search) return;
    try {
      await supabase.from('scarcity_alerts').insert([{ query: search.toLowerCase(), user_phone: userPhone }]);
      alert("TRAQUE ACTIVÉE.");
      setShowAlertForm(false);
      setUserPhone('');
    } catch (e) { alert("Erreur."); }
  };

  const fetchAds = useCallback(async () => {
    setLoading(true);
    try {
      const resolvedSearch = await resolveSynonyms(search);
      let query = supabase.from('ads').select('*, groups(id, name)');

      if (resolvedSearch.trim()) {
        query = query.or(`title.ilike.%${resolvedSearch}%,description.ilike.%${resolvedSearch}%`);
      }

      if (selectedCategory !== 'TOUT') query = query.eq('category', selectedCategory);
      
      // Tri par défaut : Récents
      query = query.order('created_at', { ascending: false }).limit(50);

      const { data } = await query;
      setAds((data as any[]) || []);

      if (search.trim().length > 1) {
        await supabase.from('search_logs').insert([{ query: search.trim().toLowerCase(), results_count: data?.length || 0 }]);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [search, selectedCategory]);

  useEffect(() => { fetchAds(); }, [fetchAds]);

  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased selection:bg-orange-100">
      
      {/* --- LE RADAR (HEADER) --- */}
      <header className="pt-8 px-4 pb-4 border-b border-gray-100 sticky top-0 z-30 bg-white/95 backdrop-blur-md">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 onClick={() => {setSearch(''); setSelectedCategory('TOUT');}} className="text-xl font-black tracking-tighter cursor-pointer">GARALA.</h1>
            
            {/* SIGNAL DE PULSATION (Amplification) */}
            <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                    {/* Si peu d'annonces, on montre la fraicheur, sinon le volume */}
                    {liveCount < 5 && lastAdTime ? `DERNIER SIGNAL : ${lastAdTime}` : `${liveCount} SIGNAUX LIVE`}
                </span>
            </div>
          </div>
          
          <div className="relative group">
            <input 
              ref={searchInputRef}
              type="text" 
              placeholder="QUOI ?" 
              className="w-full text-4xl font-black border-none outline-none placeholder-gray-200 uppercase tracking-tighter"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-300 text-xl hover:text-black">✕</button>
            )}
          </div>

          <div className="flex gap-2 mt-6 overflow-x-auto no-scrollbar pb-1">
            <button onClick={() => setSelectedCategory('TOUT')} className={`px-4 py-1.5 rounded-none text-[10px] font-black uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${selectedCategory === 'TOUT' ? "border-black text-black" : "border-transparent text-gray-300"}`}>TOUT</button>
            {CATEGORIES_LIST.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-none text-[10px] font-black uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${
                  selectedCategory === cat ? "border-black text-black" : "border-transparent text-gray-300"
                }`}
              >
                {cat} {catStats[cat] > 0 && <span className="text-orange-500 ml-1">·</span>}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* --- LE FLUX DE MATIÈRE --- */}
      <main className="max-w-6xl mx-auto px-2 py-6">
        
        {loading ? (
          <div className="w-full h-1 bg-gray-50 overflow-hidden"><div className="w-1/3 h-full bg-orange-600 animate-progress"></div></div>
        ) : ads.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {ads.map((ad) => {
              // Distinction Services vs Produits
              const isService = ad.category === 'SERVICES';
              // Pour Tech/Mode, on cache le titre si image présente (Pure Signal)
              const hideTitle = ['TECH', 'MODE', 'AUTO'].includes(ad.category) && ad.image_url; 

              return (
                <div key={ad.id} className="bg-white border border-gray-100 relative group flex flex-col justify-between">
                  
                  {/* ZONE VISUELLE : Lien vers Détails */}
                  <Link href={`/ad/${ad.id}`} className="block relative aspect-square overflow-hidden bg-gray-50">
                    {ad.image_url ? (
                      <img src={ad.image_url} alt={ad.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                        <span className="text-[10px] font-bold text-gray-300 uppercase italic">Pas d'image</span>
                        <span className="text-[10px] font-black uppercase mt-2 line-clamp-3">{ad.title}</span>
                      </div>
                    )}
                    
                    {/* Badge Service/Opportunité */}
                    {isService && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="border-2 border-white text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest">Opportunité</span>
                      </div>
                    )}

                    {/* Prix en Surimpression (Bloc Noir Haute Densité) */}
                    <div className="absolute bottom-0 right-0 bg-black text-white px-3 py-1 font-black text-sm tracking-tighter">
                      {ad.price > 0 ? ad.price.toLocaleString() : 'N.C'}
                    </div>
                  </Link>

                  {/* ZONE INFO & ACTION */}
                  <div className="p-3 pb-0">
                    {/* Titre (Affiché seulement si nécessaire ou si pas d'image) */}
                    {(!hideTitle || !ad.image_url || isService) && (
                        <h3 className="text-[10px] font-bold leading-tight uppercase line-clamp-2 mb-2 h-8">{ad.title}</h3>
                    )}

                    {/* Meta-données (FOMO intégré, pas flottant) */}
                    <div className="flex justify-between items-center text-[8px] font-bold text-gray-400 uppercase tracking-wide mb-3">
                        <span>@{ad.groups?.name?.slice(0, 10) || 'WhatsApp'}</span>
                        {ad.clicks_count > 0 && <span className="text-orange-600">🔥 {ad.clicks_count} sur le coup</span>}
                    </div>

                    {/* LEVIER D'ACTION (Bouton Vert Fusionné) */}
                    {ad.seller_phone ? (
                        <a 
                            href={`https://wa.me/${ad.seller_phone}?text=${encodeURIComponent(`Bonjour, je suis intéressé par ce ${ad.category} vu sur Garala (${window.location.origin}/ad/${ad.id})`)}`}
                            onClick={() => registerClick(ad.id)}
                            target="_blank"
                            className="block w-full bg-[#25D366] text-white text-center py-3 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#128C7E] transition-colors mb-3"
                        >
                            PRENDRE
                        </a>
                    ) : (
                        <div className="w-full bg-gray-100 text-gray-300 text-center py-3 text-[10px] font-black uppercase tracking-widest mb-3 cursor-not-allowed">Masqué</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* --- ANCRE DE CAPTURE --- */
          <div className="max-w-md mx-auto text-center py-32">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 text-gray-200">Zone Vide</h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">Le signal "{search}" n'est pas détecté.</p>
            
            {!showAlertForm ? (
              <button onClick={() => setShowAlertForm(true)} className="bg-black text-white px-8 py-4 text-[10px] font-black uppercase tracking-widest">Lancer une traque</button>
            ) : (
              <div className="animate-in fade-in zoom-in">
                <input value={userPhone} onChange={(e) => setUserPhone(e.target.value)} placeholder="VOTRE WHATSAPP" className="w-full bg-gray-50 border-b-2 border-black p-3 text-center font-bold outline-none mb-4 uppercase" />
                <button onClick={createScarcityAlert} className="w-full bg-orange-600 text-white py-4 text-[10px] font-black uppercase tracking-widest">Bipez-moi</button>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="py-20 border-t border-gray-50 text-center">
        <p className="text-[9px] font-black text-gray-200 uppercase tracking-[1em]">Infrastucture Garala</p>
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
