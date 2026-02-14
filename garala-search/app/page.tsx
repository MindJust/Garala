"use client";
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

interface Ad {
  id: number; title: string; price: number; category: string;
  image_url: string | null; seller_phone: string | null;
  created_at: string; group_id: string; clicks_count: number;
  transaction_type: string; location: string;
  groups: { name: string; id: string; } | null;
}

const MACRO_FILTERS = [
  { id: 'PRODUIT', label: 'PRODUITS', icon: '🛍️' },
  { id: 'SERVICE', label: 'SERVICES', icon: '🛠️' },
  { id: 'EMPLOI', label: 'EMPLOIS', icon: '🎓' },
  { id: 'ÉVÉNEMENT', label: 'ÉVÉNEMENTS', icon: '📅' },
];

export default function Home() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedMacro, setSelectedMacro] = useState('PRODUIT'); // Par défaut sur l'objet physique
  const [liveCount, setLiveCount] = useState(0);
  const [lastAdTime, setLastAdTime] = useState<string>("");
  
  const [showAlertForm, setShowAlertForm] = useState(false);
  const [userPhone, setUserPhone] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // 1. SIGNAL DE VIE (Pulsation Live)
  useEffect(() => {
    if (searchInputRef.current) searchInputRef.current.focus();
    fetchSystemSignals();
  }, []);

  const fetchSystemSignals = async () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data, count } = await supabase.from('ads').select('created_at', { count: 'exact' }).gt('created_at', yesterday).order('created_at', { ascending: false }).limit(1);
    setLiveCount(count || 0);
    if (data && data[0]) {
      const diff = Math.floor((new Date().getTime() - new Date(data[0].created_at).getTime()) / 60000);
      setLastAdTime(diff < 1 ? "À L'INSTANT" : diff < 60 ? `IL Y A ${diff} MIN` : `IL Y A ${Math.floor(diff/60)} H`);
    }
  };

  // 2. DICTIONNAIRE DE RÉSONANCE (Fuzzy Search)
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
    await supabase.from('scarcity_alerts').insert([{ query: search.toLowerCase(), user_phone: userPhone }]);
    alert("VEILLE ACTIVÉE.");
    setShowAlertForm(false);
  };

  const fetchAds = useCallback(async () => {
    setLoading(true);
    try {
      const resolvedSearch = await resolveSynonyms(search);
      let query = supabase.from('ads').select('*, groups(id, name)');

      // Filtre de Macro-Flux
      if (selectedMacro === 'PRODUIT') {
        // Exclure les catégories de type service/emploi/event
        query = query.not('category', 'in', '("SERVICE","EMPLOI","ÉVÉNEMENT")');
      } else {
        query = query.eq('category', selectedMacro);
      }

      if (resolvedSearch.trim()) {
        query = query.or(`title.ilike.%${resolvedSearch}%,description.ilike.%${resolvedSearch}%`);
      }

      const { data } = await query.order('created_at', { ascending: false }).limit(40);
      setAds((data as any[]) || []);
      
      if (search.trim().length > 1) {
        await supabase.from('search_logs').insert([{ query: search.trim().toLowerCase(), results_count: data?.length || 0 }]);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [search, selectedMacro]);

  useEffect(() => { fetchAds(); }, [fetchAds]);

  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased">
      
      {/* --- LE RADAR (SEARCH-FIRST) --- */}
      <header className="pt-8 px-6 pb-2 border-b border-gray-50 sticky top-0 z-30 bg-white/95 backdrop-blur-md">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 onClick={() => {setSearch(''); setSelectedMacro('PRODUIT');}} className="text-xl font-black tracking-tighter cursor-pointer">GARALA.</h1>
            <div className="flex items-center gap-2">
                <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                </span>
                <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">
                    {liveCount < 3 && lastAdTime ? `SIGNAL : ${lastAdTime}` : `${liveCount} LIVE`}
                </span>
            </div>
          </div>
          
          <div className="relative mb-8">
            <input 
              ref={searchInputRef}
              type="text" 
              placeholder="QUOI ?" 
              className="w-full text-4xl md:text-6xl font-black border-none outline-none placeholder-gray-100 uppercase tracking-tighter text-black"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* --- MACRO-FLUX (AXE 2) --- */}
          <div className="flex justify-between border-t border-gray-100 py-4">
            {MACRO_FILTERS.map((macro) => (
              <button
                key={macro.id}
                onClick={() => setSelectedMacro(macro.id)}
                className={`flex flex-col items-center gap-1 transition-all ${selectedMacro === macro.id ? "opacity-100 scale-110" : "opacity-30"}`}
              >
                <span className="text-xl">{macro.icon}</span>
                <span className="text-[7px] font-black uppercase tracking-tighter">{macro.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* --- LE FLUX DE PARTICULES --- */}
      <main className="max-w-6xl mx-auto px-2 py-6">
        {loading ? (
          <div className="w-full h-0.5 bg-gray-50 overflow-hidden"><div className="w-1/3 h-full bg-black animate-progress"></div></div>
        ) : ads.length > 0 ? (
          <div className={selectedMacro === 'PRODUIT' ? "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2" : "flex flex-col gap-4"}>
            {ads.map((ad) => {
              const isMacroProduct = !['SERVICE', 'EMPLOI', 'ÉVÉNEMENT'].includes(ad.category);

              return isMacroProduct ? (
                /* MODE PRODUIT : ATOME VISUEL */
                <div key={ad.id} className="flex flex-col bg-white border border-gray-50 group">
                  <Link href={`/ad/${ad.id}`} className="relative aspect-square overflow-hidden bg-gray-50">
                    {ad.image_url ? (
                      <img src={ad.image_url} alt={ad.title} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[8px] font-black text-gray-200 uppercase italic">Garala Signal</div>
                    )}
                    <div className="absolute bottom-0 right-0 bg-black text-white px-2 py-1 font-black text-xs tracking-tighter">
                      {ad.price > 0 ? ad.price.toLocaleString() : '---'}
                    </div>
                  </Link>
                  <div className="p-2">
                    <div className="flex justify-between text-[7px] font-black text-gray-300 uppercase mb-1">
                        <span>@{ad.groups?.name?.slice(0, 10) || 'WA'}</span>
                        {ad.clicks_count > 0 && <span className="text-orange-500">{ad.clicks_count} SUR LE COUP</span>}
                    </div>
                    {ad.seller_phone && (
                        <a 
                            href={`https://wa.me/${ad.seller_phone}?text=PRENDRE : *${ad.title.toUpperCase()}*`}
                            onClick={() => registerClick(ad.id)}
                            target="_blank"
                            className="block w-full bg-[#25D366] text-white text-center py-2.5 text-[9px] font-black uppercase tracking-widest active:scale-95"
                        >
                            PRENDRE
                        </a>
                    )}
                  </div>
                </div>
              ) : (
                /* MODE LISTE : SERVICES / EMPLOIS / EVENTS */
                <div key={ad.id} className="border-b border-gray-100 pb-4 flex gap-4 items-center animate-in fade-in slide-in-from-left-2">
                    <div className="w-16 h-16 bg-gray-50 flex-shrink-0">
                        {ad.image_url && <img src={ad.image_url} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1">
                        <p className="text-[7px] font-black text-orange-500 uppercase tracking-widest">{ad.category} @{ad.groups?.name || 'WA'}</p>
                        <Link href={`/ad/${ad.id}`}>
                            <h3 className="text-sm font-bold uppercase leading-tight">{ad.title}</h3>
                        </Link>
                        <p className="text-[10px] text-gray-400 font-medium">{ad.location} • {ad.price > 0 ? `${ad.price.toLocaleString()} FCFA` : 'Prix indicatif'}</p>
                    </div>
                    <a 
                        href={`https://wa.me/${ad.seller_phone}?text=INTÉRÊT : *${ad.title.toUpperCase()}*`}
                        onClick={() => registerClick(ad.id)}
                        target="_blank"
                        className="bg-black text-white px-4 py-2 text-[8px] font-black uppercase tracking-widest"
                    >
                        CONTACTER
                    </a>
                </div>
              );
            })}
          </div>
        ) : (
          /* VEILLE DE TENSION */
          <div className="max-w-md mx-auto text-center py-32">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 text-gray-100 italic">Hors Portée</h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-10">Le signal "{search}" est rare. Nos bots le traquent.</p>
            {!showAlertForm ? (
              <button onClick={() => setShowAlertForm(true)} className="bg-orange-600 text-white px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">Activer la traque</button>
            ) : (
              <div className="animate-in zoom-in">
                <input value={userPhone} onChange={(e) => setUserPhone(e.target.value)} placeholder="NUMÉRO WHATSAPP" className="w-full border-b-2 border-black p-4 text-center font-black outline-none mb-6 text-xl uppercase" />
                <button onClick={createScarcityAlert} className="w-full bg-black text-white py-4 text-[10px] font-black uppercase">Bipez-moi au premier signal</button>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="py-20 text-center opacity-10">
        <p className="text-[8px] font-black uppercase tracking-[1em]">Singularité v4.0</p>
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
