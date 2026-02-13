"use client";
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

interface Ad {
  id: number; title: string; price: number; category: string;
  image_url: string | null; seller_phone: string | null;
  created_at: string; group_id: string; clicks_count: number;
  groups: { name: string; id: string; } | null;
}

interface CategoryStat {
  category: string;
  count: number;
}

const CATEGORIES_LIST = ["TECH", "IMMO", "AUTO", "MODE", "MAISON", "SERVICES", "DIVERS"];

export default function Home() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('TOUT');
  const [liveCount, setLiveCount] = useState(0);
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
    // Calcul des annonces des dernières 24h
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    const { count } = await supabase.from('ads').select('*', { count: 'exact', head: true }).gt('created_at', yesterday);
    setLiveCount(count || 0);

    // Stats par catégorie pour la Grille de Tension
    const stats: Record<string, number> = {};
    for (const cat of CATEGORIES_LIST) {
      const { count: c } = await supabase.from('ads').select('*', { count: 'exact', head: true }).eq('category', cat).gt('created_at', yesterday);
      stats[cat] = c || 0;
    }
    setCatStats(stats);
  };

  // 2. DICTIONNAIRE DE RÉSONANCE (Lissage Sémantique)
  const resolveSynonyms = async (term: string) => {
    const cleanTerm = term.toLowerCase().trim();
    const { data } = await supabase.from('search_synonyms').select('target').eq('term', cleanTerm).single();
    return data ? data.target : term;
  };

  const registerClick = async (adId: number) => {
    try { await supabase.rpc('increment_clicks', { row_id: adId }); } catch (e) {}
  };

  const fetchAds = useCallback(async () => {
    setLoading(true);
    try {
      const resolvedSearch = await resolveSynonyms(search);
      let query = supabase.from('ads').select('*, groups(id, name)');

      if (resolvedSearch.trim()) {
        // Axe 1 : Recherche Tolérante (Utilise l'index Trigramme via SQL)
        query = query.or(`title.ilike.%${resolvedSearch}%,description.ilike.%${resolvedSearch}%`);
      }

      if (selectedCategory !== 'TOUT') query = query.eq('category', selectedCategory);
      
      query = query.order('created_at', { ascending: false }).limit(40);

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
    <div className="min-h-screen bg-white text-black font-sans selection:bg-orange-100">
      
      {/* --- LE POINT DE FOCALISATION --- */}
      <header className="pt-12 px-6 pb-6 border-b border-gray-50 sticky top-0 z-30 bg-white/95 backdrop-blur-md">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 onClick={() => {setSearch(''); setSelectedCategory('TOUT');}} className="text-2xl font-black tracking-tighter cursor-pointer">GARALA<span className="text-orange-600">.</span></h1>
            <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                    {liveCount} SIGNAUX LIVE (24H)
                </span>
            </div>
          </div>
          
          <div className="relative group">
            <input 
              ref={searchInputRef}
              type="text" 
              placeholder="Chercher une moto, un iPhone, un frigo..." 
              className="w-full text-3xl md:text-5xl font-black border-none outline-none placeholder-gray-100 uppercase tracking-tighter"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-200 hover:text-orange-600 transition-colors">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            )}
          </div>

          {/* --- GRILLE DE TENSION (CHIPS) --- */}
          <div className="flex gap-3 mt-8 overflow-x-auto no-scrollbar pb-2">
            <button
                onClick={() => setSelectedCategory('TOUT')}
                className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                  selectedCategory === 'TOUT' ? "bg-black text-white border-black" : "border-gray-50 text-gray-300"
                }`}
            >
                TOUT
            </button>
            {CATEGORIES_LIST.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border-2 whitespace-nowrap transition-all ${
                  selectedCategory === cat ? "bg-black text-white border-black shadow-lg" : "border-gray-50 text-gray-300"
                }`}
              >
                {cat} {catStats[cat] > 0 && <span className="ml-1 text-orange-500">({catStats[cat]})</span>}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* --- LE FLUX DE PARTICULES --- */}
      <main className="max-w-7xl mx-auto px-4 py-10">
        
        {loading ? (
          <div className="w-full h-1 bg-gray-50 overflow-hidden"><div className="w-1/3 h-full bg-orange-600 animate-progress"></div></div>
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
                  
                  {/* Surimpression Thermique du Prix */}
                  <div className="absolute bottom-0 right-0 bg-black text-white px-3 py-1.5 font-black text-sm md:text-lg tracking-tighter">
                    {ad.price > 0 ? ad.price.toLocaleString() : '---'}
                  </div>

                  {/* Heat Badge */}
                  {ad.clicks_count > 5 && (
                    <div className="absolute top-2 left-2 bg-orange-600 text-white text-[7px] font-black px-1.5 py-0.5 uppercase">Haute Tension</div>
                  )}
                </Link>

                <div className="p-4 flex flex-col h-full">
                    <div className="flex justify-between items-start text-[8px] font-black text-gray-300 uppercase tracking-widest mb-2">
                        <span>{new Date(ad.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        <span className="text-orange-500">@{ad.groups?.name || 'Group'}</span>
                    </div>
                    
                    <Link href={`/ad/${ad.id}`}>
                        <h3 className="text-xs font-bold leading-tight uppercase line-clamp-2 mb-4 flex-1">{ad.title}</h3>
                    </Link>

                    {ad.seller_phone && (
                        <a 
                            href={`https://wa.me/${ad.seller_phone}?text=SIGNAL : *${ad.title.toUpperCase()}*`}
                            onClick={() => registerClick(ad.id)}
                            target="_blank"
                            className="border-2 border-black text-black text-center py-2 text-[9px] font-black uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all active:scale-95"
                        >
                            Prendre
                        </a>
                    )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* --- ANCRE DE CAPTURE (SCARCITY) --- */
          <div className="max-w-xl mx-auto text-center py-32 px-6">
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-4 italic text-gray-200">Indisponible</h2>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-12">Le signal "{search}" est hors de portée. Voulez-vous qu'on le traque ?</p>
            
            {!showAlertForm ? (
              <button onClick={() => setShowAlertForm(true)} className="bg-orange-600 text-white px-12 py-5 text-xs font-black uppercase tracking-[0.3em] shadow-2xl shadow-orange-200 active:scale-95 transition-transform">Activer la traque</button>
            ) : (
              <div className="bg-gray-50 p-10 rounded-[3rem] animate-in slide-in-from-bottom-10">
                <input 
                    value={userPhone} 
                    onChange={(e) => setUserPhone(e.target.value)} 
                    placeholder="TON WHATSAPP" 
                    className="w-full bg-transparent border-b-4 border-black p-4 text-center text-2xl font-black outline-none mb-8 uppercase" 
                />
                <button onClick={createScarcityAlert} className="w-full bg-black text-white py-5 text-xs font-black uppercase tracking-widest">Bipez-moi au premier signal</button>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="py-20 border-t border-gray-50 text-center">
        <div className="text-[10px] font-black text-gray-200 uppercase tracking-[1em]">Singularité • Garala • Infrastructure</div>
      </footer>
      
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        .animate-progress { animation: progress 2s infinite linear; }
      `}</style>
    </div>
  );
}
