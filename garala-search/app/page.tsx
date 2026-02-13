"use client";
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

interface Ad {
  id: number; title: string; description: string; price: number; category: string;
  image_url: string | null; seller_phone: string | null; transaction_type: string;
  created_at: string; group_id: string; clicks_count: number;
  groups: { name: string; id: string; } | null;
}

const CATEGORIES_LIST = ["TOUT", "TECH", "IMMO", "AUTO", "MODE", "MAISON", "SERVICES", "DIVERS"];

export default function Home() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('TOUT');
  const [transactionFilter, setTransactionFilter] = useState('TOUT'); 
  const [sortOption, setSortOption] = useState('date_desc');
  const [selectedGroup, setSelectedGroup] = useState<{id: string, name: string} | null>(null);
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
        if (cat === 'TOUT') continue;
        const { count: c } = await supabase.from('ads').select('*', { count: 'exact', head: true }).eq('category', cat).gt('created_at', yesterday);
        stats[cat] = c || 0;
    }
    setCatStats(stats);
  };

  // 2. DICTIONNAIRE DE RÉSONANCE (Lissage Sémantique)
  const resolveSynonyms = async (term: string) => {
    const cleanTerm = term.toLowerCase().trim();
    if (!cleanTerm) return term;
    const { data } = await supabase.from('search_synonyms').select('target').eq('term', cleanTerm).single();
    return data ? data.target : term;
  };

  // AXE 4 : Gestion des Clics (Tension)
  const registerClick = async (adId: number) => {
    try { await supabase.rpc('increment_clicks', { row_id: adId }); } catch (e) {}
  };

  // AXE 4 : Création d'alerte
  const createScarcityAlert = async () => {
    if (!userPhone || !search) return;
    try {
      const { error } = await supabase.from('scarcity_alerts').insert([
        { query: search.toLowerCase(), user_phone: userPhone }
      ]);
      if (error) throw error;
      alert("TRAQUE ACTIVÉE. Garala vous contactera dès que ce signal apparaît.");
      setShowAlertForm(false);
      setUserPhone('');
    } catch (e) {
      console.error(e);
      alert("Erreur lors de l'activation de la veille.");
    }
  };

  // AXE 3 : Partage Rapide
  const shareAd = (ad: Ad) => {
    const text = `🔥 *${ad.title.toUpperCase()}*\n💰 ${ad.price.toLocaleString()} FCFA\n👉 ${window.location.origin}/ad/${ad.id}`;
    if (navigator.share) {
      navigator.share({ title: ad.title, text: text, url: `${window.location.origin}/ad/${ad.id}` }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      alert("Lien copié !");
    }
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
      
      // Filtre Transaction (Réintégré pour éviter la régression)
      if (transactionFilter === 'VENTE') {
        query = query.eq('transaction_type', 'VENTE');
      } else if (transactionFilter === 'RECHERCHE') {
        query = query.or('transaction_type.ilike.ACHAT,transaction_type.ilike.RECHERCHE,transaction_type.ilike.DEMANDE');
      }

      if (selectedGroup) query = query.eq('group_id', selectedGroup.id);

      const isAsc = sortOption === 'price_asc';
      const sortCol = sortOption.includes('price') ? 'price' : 'created_at';
      query = query.order(sortCol, { ascending: isAsc }).limit(50);

      const { data } = await query;
      setAds((data as any[]) || []);

      if (search.trim().length > 1) {
        await supabase.from('search_logs').insert([{ query: search.trim().toLowerCase(), results_count: data?.length || 0 }]);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [search, selectedCategory, transactionFilter, sortOption, selectedGroup]);

  useEffect(() => { fetchAds(); }, [fetchAds]);

  const resetFilters = () => {
    setSearch(''); setSelectedCategory('TOUT'); setTransactionFilter('TOUT'); setSelectedGroup(null);
    setShowAlertForm(false);
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased selection:bg-orange-100">
      
      {/* --- LE POINT DE FOCALISATION (RADAR) --- */}
      <header className="pt-12 px-6 pb-2 border-b border-gray-50 sticky top-0 z-30 bg-white/95 backdrop-blur-md">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 onClick={resetFilters} className="text-2xl font-black tracking-tighter cursor-pointer">GARALA<span className="text-orange-600">.</span></h1>
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
          
          <div className="relative group mb-6">
            <input 
              ref={searchInputRef}
              type="text" 
              placeholder="QUEL PRODUIT ?" 
              className="w-full text-3xl md:text-5xl font-black border-none outline-none placeholder-gray-100 uppercase tracking-tighter text-black"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-200 hover:text-orange-600 transition-colors">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            )}
          </div>

          {/* Filtres Secondaires (Tri & Transaction) */}
          <div className="flex items-center gap-4 mb-6 overflow-x-auto no-scrollbar">
             <select 
                className="bg-gray-50 rounded-lg px-3 py-1 font-bold text-[10px] outline-none border-none cursor-pointer text-gray-700 uppercase tracking-widest"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="date_desc">RÉCENTS</option>
                <option value="price_asc">PRIX CROISSANT</option>
                <option value="price_desc">PRIX DÉCROISSANT</option>
              </select>

              <div className="flex gap-2 text-[10px] font-black uppercase tracking-widest">
                  <button onClick={() => setTransactionFilter('TOUT')} className={`px-2 py-1 rounded ${transactionFilter === 'TOUT' ? 'bg-black text-white' : 'text-gray-300'}`}>Tout</button>
                  <button onClick={() => setTransactionFilter('VENTE')} className={`px-2 py-1 rounded ${transactionFilter === 'VENTE' ? 'bg-black text-white' : 'text-gray-300'}`}>Ventes</button>
                  <button onClick={() => setTransactionFilter('RECHERCHE')} className={`px-2 py-1 rounded ${transactionFilter === 'RECHERCHE' ? 'bg-blue-600 text-white' : 'text-gray-300'}`}>Demandes</button>
              </div>
          </div>

          {/* Puces Catégories */}
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4">
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
        
        {selectedGroup && (
          <div className="mb-8 flex items-center justify-between bg-black text-white p-4 rounded-xl animate-fade-in">
            <span className="text-[10px] font-black uppercase tracking-widest">FLUX : {selectedGroup.name}</span>
            <button onClick={() => setSelectedGroup(null)} className="text-[10px] font-bold border border-white/30 px-3 py-1 rounded">FERMER ✕</button>
          </div>
        )}

        {loading ? (
          <div className="w-full h-1 bg-gray-50 overflow-hidden"><div className="w-1/3 h-full bg-orange-600 animate-progress"></div></div>
        ) : ads.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-px bg-gray-100 border border-gray-100">
            {ads.map((ad) => {
              const isDemand = ad.transaction_type?.toUpperCase().includes('ACHAT') || ad.transaction_type?.toUpperCase().includes('RECHERCHE') || ad.transaction_type?.toUpperCase().includes('DEMANDE');
              return (
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
                      <div className="absolute top-2 left-2 bg-orange-600 text-white text-[7px] font-black px-1.5 py-0.5 uppercase shadow-xl">Haute Tension</div>
                    )}
                    {isDemand && (
                      <div className="absolute top-2 right-2 bg-blue-600 text-white text-[7px] font-black px-1.5 py-0.5 uppercase">Demande</div>
                    )}
                  </Link>

                  <div className="p-4 flex flex-col h-full">
                      <div className="flex justify-between items-start text-[8px] font-black text-gray-300 uppercase tracking-widest mb-2">
                          <span>{new Date(ad.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          <button 
                            onClick={() => setSelectedGroup({id: ad.group_id, name: ad.groups?.name || 'Inconnu'})}
                            className="text-orange-500 hover:underline"
                          >
                            @{ad.groups?.name || 'Group'}
                          </button>
                      </div>
                      
                      <Link href={`/ad/${ad.id}`}>
                          <h3 className="text-xs font-bold leading-tight uppercase line-clamp-2 mb-4 flex-1 hover:text-orange-600 transition-colors">{ad.title}</h3>
                      </Link>

                      <div className="mt-auto flex gap-2">
                        {ad.seller_phone ? (
                            <a 
                                href={`https://wa.me/${ad.seller_phone}?text=SIGNAL : *${ad.title.toUpperCase()}*`}
                                onClick={() => registerClick(ad.id)}
                                target="_blank"
                                className="flex-1 bg-[#25D366] text-white text-center py-2 text-[9px] font-black uppercase tracking-[0.2em] hover:opacity-90 transition-all active:scale-95"
                            >
                                WhatsApp
                            </a>
                        ) : (
                            <div className="flex-1 bg-gray-100 text-gray-300 text-center py-2 text-[9px] font-black uppercase">Masqué</div>
                        )}
                        <button onClick={() => shareAd(ad)} className="px-3 border-2 border-gray-100 text-gray-400 hover:text-black hover:border-black transition-all">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg>
                        </button>
                      </div>
                  </div>
                </div>
              );
            })}
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
                    className="w-full bg-transparent border-b-4 border-black p-4 text-center text-2xl font-black outline-none mb-8 uppercase text-black" 
                />
                <button onClick={createScarcityAlert} className="w-full bg-black text-white py-5 text-xs font-black uppercase tracking-widest">Bipez-moi au premier signal</button>
                <button onClick={() => setShowAlertForm(false)} className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Annuler</button>
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
