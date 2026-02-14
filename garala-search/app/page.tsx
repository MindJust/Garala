"use client";
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

interface Ad {
  id: number; title: string; price: number; category: string;
  image_url: string | null; seller_phone: string | null;
  created_at: string; group_id: string; clicks_count: number;
  transaction_type: string; description: string;
  groups: { name: string; id: string; } | null;
}

// Axe 2 : Macro-Flux (Blueprint V4)
const MACRO_FLUX = [
  { id: "PRODUIT", label: "PRODUITS", icon: "📦" },
  { id: "SERVICE", label: "SERVICES", icon: "🛠️" },
  { id: "EMPLOI", label: "EMPLOIS", icon: "🎓" },
  { id: "ÉVÉNEMENT", label: "ÉVÉNEMENTS", icon: "📅" }
];

const PRODUITS_SUB = ["TECH", "IMMO", "AUTO", "MODE", "MAISON", "DIVERS"];

export default function Home() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // États V4
  const [selectedMacro, setSelectedMacro] = useState('PRODUIT');
  const [selectedSub, setSelectedSub] = useState('TOUT');
  
  const [liveCount, setLiveCount] = useState(0);
  const [lastAdTime, setLastAdTime] = useState<string>("");
  const [catStats, setCatStats] = useState<Record<string, number>>({});
  
  const [showAlertForm, setShowAlertForm] = useState(false);
  const [userPhone, setUserPhone] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchInputRef.current) searchInputRef.current.focus();
    fetchSystemSignals();
  }, []);

  const fetchSystemSignals = async () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data, count } = await supabase.from('ads').select('created_at', { count: 'exact' }).gt('created_at', yesterday).order('created_at', { ascending: false }).limit(1);
    setLiveCount(count || 0);
    if (data && data.length > 0) {
      const diff = Math.floor((new Date().getTime() - new Date(data[0].created_at).getTime()) / 60000);
      setLastAdTime(diff < 1 ? "À L'INSTANT" : diff < 60 ? `IL Y A ${diff} MIN` : `IL Y A ${Math.floor(diff/60)} H`);
    }
  };

  const resolveSynonyms = async (term: string) => {
    const cleanTerm = term.toLowerCase().trim();
    // CORRECTION 406 : On ne requête pas si le terme est vide
    if (!cleanTerm) return term;
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
    } catch (e) { alert("Erreur."); }
  };

  const fetchAds = useCallback(async () => {
    setLoading(true);
    try {
      const resolvedSearch = await resolveSynonyms(search);
      let query = supabase.from('ads').select('*, groups(id, name)');

      const term = resolvedSearch.trim();
      if (term) {
        query = query.or(`title.ilike.%${term}%,description.ilike.%${term}%`);
      }

      // --- LOGIQUE DE FILTRAGE V4 (CORRIGÉE SANS ERREUR 400) ---
      if (selectedMacro === "PRODUIT") {
        if (selectedSub !== "TOUT") {
          query = query.eq('category', selectedSub);
        } else {
          // CORRECTION 400 : Syntaxe de chaîne pour le filtre 'in'
          query = query.not('category', 'in', '(SERVICE,SERVICES,EMPLOI,EMPLOIS,ÉVÉNEMENT,ÉVÉNEMENTS)');
        }
      } else {
        // Capture flexible du type (ex: SERVICE ou SERVICES) via filtre ilike
        query = query.filter('category', 'ilike', `${selectedMacro}%`);
      }
      
      query = query.order('created_at', { ascending: false }).limit(50);
      const { data, error } = await query;
      if (error) throw error;
      setAds((data as any[]) || []);
    } catch (err) { 
      console.error("Erreur de flux:", err); 
    }
    finally { setLoading(false); }
  }, [search, selectedMacro, selectedSub]);

  useEffect(() => { fetchAds(); }, [fetchAds]);

  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased selection:bg-orange-100">
      
      <header className="pt-8 px-4 border-b border-gray-100 sticky top-0 z-30 bg-white/95 backdrop-blur-md">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 onClick={() => {setSearch(''); setSelectedMacro('PRODUIT'); setSelectedSub('TOUT');}} className="text-xl font-black tracking-tighter cursor-pointer uppercase">GARALA. (RCA)</h1>
            <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span></span>
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                    {liveCount < 5 && lastAdTime ? `DERNIERE PUBLICATION : ${lastAdTime}` : `${liveCount} PUBLICATIONS LIVE`}
                </span>
            </div>
          </div>
          
          <div className="relative mb-6">
            <input 
              ref={searchInputRef}
              type="text" 
              placeholder="VOUS RECHERCHEZ QUOI ?" 
              className="w-full text-4xl font-black border-none outline-none placeholder-gray-200 uppercase tracking-tighter text-black bg-transparent"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && <button onClick={() => setSearch('')} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-300 text-xl hover:text-black">✕</button>}
          </div>

          {/* AXE 2 : NAVIGATION MACRO-FLUX */}
          <div className="flex justify-between border-t border-gray-50 pt-4 pb-4">
            {MACRO_FLUX.map((m) => (
              <button
                key={m.id}
                onClick={() => { setSelectedMacro(m.id); setSelectedSub('TOUT'); }}
                className={`flex flex-col items-center gap-1 transition-all ${selectedMacro === m.id ? "opacity-100 scale-110" : "opacity-30 grayscale"}`}
              >
                <span className="text-xl">{m.icon}</span>
                <span className="text-[8px] font-black tracking-widest uppercase text-black">{m.label}</span>
              </button>
            ))}
          </div>

          {/* AXE 2 : SOUS-CATÉGORIES PRODUITS */}
          {selectedMacro === "PRODUIT" && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4">
              <button onClick={() => setSelectedSub('TOUT')} className={`px-4 py-1 text-[9px] font-black uppercase tracking-widest border-b-2 transition-all ${selectedSub === 'TOUT' ? "border-black text-black" : "border-transparent text-gray-300"}`}>TOUT</button>
              {PRODUITS_SUB.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSelectedSub(sub)}
                  className={`px-4 py-1 text-[9px] font-black uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${selectedSub === sub ? "border-black text-black" : "border-transparent text-gray-300"}`}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-2 py-6">
        {loading ? (
          <div className="w-full h-1 bg-gray-50 overflow-hidden"><div className="w-1/3 h-full bg-orange-600 animate-progress"></div></div>
        ) : ads.length > 0 ? (
          <div className={selectedMacro === "PRODUIT" ? "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3" : "flex flex-col gap-3"}>
            {ads.map((ad) => {
              const isProduit = selectedMacro === "PRODUIT";
              const hideTitle = false; 

              if (isProduit) {
                return (
                  <div key={ad.id} className="bg-white border border-gray-100 flex flex-col justify-between group">
                    <Link href={`/ad/${ad.id}`} className="block relative aspect-square overflow-hidden bg-gray-50">
                      {ad.image_url ? (
                        <img src={ad.image_url} alt={ad.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center p-4 text-center text-[10px] font-black uppercase text-gray-200 italic">PAS D'IMAGE</div>
                      )}
                      <div className="absolute bottom-0 right-0 bg-black text-white px-3 py-1 font-black text-sm tracking-tighter">
                        {ad.price > 0 ? ad.price.toLocaleString() : 'N.C'}
                      </div>
                    </Link>
                    <div className="p-3">
                      {!hideTitle && <h3 className="text-[10px] font-bold leading-tight uppercase line-clamp-2 mb-2 h-8">{ad.title}</h3>}
                      <div className="flex justify-between items-center text-[8px] font-bold text-gray-400 uppercase tracking-wide mb-3">
                          <span className="truncate flex-1 mr-2">@{ad.groups?.name || 'WhatsApp'}</span>
                          {ad.clicks_count > 0 && <span className="text-orange-600 font-black">🔥 {ad.clicks_count}</span>}
                      </div>
                      <a href={`https://wa.me/${ad.seller_phone}?text=${encodeURIComponent("Bonjour, je vous contacte pour l'annonce *" + ad.title + "* vue sur Garala.")}`} onClick={() => registerClick(ad.id)} target="_blank" className="block w-full bg-[#25D366] text-white text-center py-3 text-[10px] font-black uppercase tracking-[0.2em]">WHATSAPP</a>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div key={ad.id} className="bg-white border-b border-gray-100 p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                    <Link href={`/ad/${ad.id}`} className="w-16 h-16 bg-gray-100 overflow-hidden flex-shrink-0">
                      {ad.image_url ? <img src={ad.image_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[8px] font-black text-gray-300 uppercase italic">Garala</div>}
                    </Link>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[8px] font-black text-orange-500 uppercase tracking-widest">@{ad.groups?.name || 'WhatsApp'}</span>
                        <span className="text-[8px] font-bold text-gray-300 uppercase">{new Date(ad.created_at).toLocaleDateString()}</span>
                      </div>
                      <h3 className="text-sm font-black uppercase leading-tight mb-1">{ad.title}</h3>
                      <p className="text-[10px] font-medium text-gray-500 line-clamp-1">{ad.description}</p>
                    </div>
                    <div className="text-right flex flex-col gap-2">
                       <p className="text-sm font-black tracking-tighter">{ad.price > 0 ? `${ad.price.toLocaleString()} F` : 'N.C'}</p>
                       <a href={`https://wa.me/${ad.seller_phone}`} onClick={() => registerClick(ad.id)} target="_blank" className="bg-[#25D366] text-white px-4 py-2 text-[8px] font-black uppercase tracking-widest">WHATSAPP</a>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        ) : (
          <div className="max-w-md mx-auto text-center py-32 border-2 border-dashed border-gray-100 rounded-3xl">
            <h2 className="text-2xl font-black uppercase mb-8 italic text-gray-200">"{search || (selectedMacro === 'PRODUIT' ? 'PRODUITS' : selectedMacro + 'S')}" EST RARE</h2>
            {!showAlertForm ? (
              <button onClick={() => setShowAlertForm(true)} className="bg-black text-white px-10 py-5 text-[10px] font-black uppercase tracking-widest">Activer la traque</button>
            ) : (
              <div className="px-6 animate-in zoom-in">
                <input value={userPhone} onChange={(e) => setUserPhone(e.target.value)} placeholder="TON WHATSAPP" className="w-full bg-gray-50 border-b-2 border-black p-4 text-center font-black outline-none mb-4 uppercase text-sm" />
                <button onClick={createScarcityAlert} className="w-full bg-orange-600 text-white py-4 text-[10px] font-black uppercase">Bipez-moi</button>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="py-20 border-t border-gray-50 text-center">
        <p className="text-[9px] font-black text-gray-200 uppercase tracking-[1em]">GARALA RCA</p>
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
