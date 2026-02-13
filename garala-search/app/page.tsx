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

const CATEGORIES = ["TOUT", "TECH", "IMMO", "AUTO", "MODE", "MAISON", "SERVICES", "DIVERS"];

export default function Home() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('TOUT');
  const [transactionFilter, setTransactionFilter] = useState('TOUT'); 
  const [sortOption, setSortOption] = useState('date_desc');
  const [selectedGroup, setSelectedGroup] = useState<{id: string, name: string} | null>(null);
  const [systemTension, setSystemTension] = useState(0);
  
  const [showAlertForm, setShowAlertForm] = useState(false);
  const [userPhone, setUserPhone] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus automatique sur la recherche (Loi de l'Aspiration)
  useEffect(() => {
    if (searchInputRef.current) searchInputRef.current.focus();
    fetchSystemTension();
  }, []);

  const fetchSystemTension = async () => {
    const { count } = await supabase.from('search_logs').select('*', { count: 'exact', head: true });
    setSystemTension(count || 0);
  };

  const registerClick = async (adId: number) => {
    try { await supabase.rpc('increment_clicks', { row_id: adId }); } catch (e) { console.error(e); }
  };

  const createScarcityAlert = async () => {
    if (!userPhone || !search) return;
    const { error } = await supabase.from('scarcity_alerts').insert([{ query: search.toLowerCase(), user_phone: userPhone }]);
    if (!error) {
      alert("VEILLE ACTIVÉE.");
      setShowAlertForm(false);
      setUserPhone('');
    }
  };

  const fetchAds = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase.from('ads').select('*, groups(id, name)');
      if (search.trim()) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
      if (selectedCategory !== 'TOUT') query = query.eq('category', selectedCategory);
      if (transactionFilter === 'VENTE') query = query.eq('transaction_type', 'VENTE');
      else if (transactionFilter === 'RECHERCHE') query = query.or('transaction_type.ilike.ACHAT,transaction_type.ilike.RECHERCHE,transaction_type.ilike.DEMANDE');
      if (selectedGroup) query = query.eq('group_id', selectedGroup.id);

      const isAsc = sortOption === 'price_asc';
      query = query.order(sortOption.includes('price') ? 'price' : 'created_at', { ascending: isAsc });

      const { data } = await query;
      setAds((data as any[]) || []);

      if (search.trim().length > 1) {
        await supabase.from('search_logs').insert([{ query: search.trim().toLowerCase(), results_count: data?.length || 0 }]);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [search, selectedCategory, transactionFilter, sortOption, selectedGroup]);

  useEffect(() => { fetchAds(); }, [fetchAds]);

  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased">
      
      {/* --- L'ASPIRATEUR (SEARCH-FIRST) --- */}
      <header className="pt-8 px-4 border-b border-gray-100 bg-white sticky top-0 z-30">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 onClick={() => {setSearch(''); setSelectedCategory('TOUT'); setSelectedGroup(null);}} className="text-xl font-black tracking-tighter cursor-pointer">GARALA.</h1>
            <div className="text-[10px] font-bold text-orange-500 uppercase tracking-widest animate-pulse">
              ● {systemTension} RECHERCHES RÉCENTES
            </div>
          </div>
          
          <div className="relative mb-6">
            <input 
              ref={searchInputRef}
              type="text" 
              placeholder="QUEL PRODUIT ?" 
              className="w-full text-2xl md:text-4xl font-black border-none outline-none placeholder-gray-200 uppercase"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-300 text-xl">✕</button>
            )}
          </div>

          <div className="flex gap-4 border-t border-gray-50 py-4 overflow-x-auto no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${
                  selectedCategory === cat ? "text-black border-b-2 border-black" : "text-gray-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* --- FLUX DE SIGNAL --- */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {selectedGroup && (
          <div className="mb-8 flex items-center justify-between bg-black text-white p-4 rounded-xl">
            <span className="text-[10px] font-black uppercase tracking-widest">FLUX : {selectedGroup.name}</span>
            <button onClick={() => setSelectedGroup(null)} className="text-[10px] font-bold">FERMER ✕</button>
          </div>
        )}

        {loading ? (
          <div className="h-1 bg-orange-500 animate-progress"></div>
        ) : ads.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10">
            {ads.map((ad) => {
              const isDemand = ad.transaction_type?.toUpperCase().includes('ACHAT') || ad.transaction_type?.toUpperCase().includes('RECHERCHE');
              return (
                <div key={ad.id} className="flex flex-col group">
                  <Link href={`/ad/${ad.id}`} className="relative aspect-[3/4] bg-gray-50 mb-3 overflow-hidden">
                    {ad.image_url ? (
                      <img src={ad.image_url} alt={ad.title} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-200 uppercase">Image manquante</div>
                    )}
                    
                    {/* Tension Badge */}
                    {ad.clicks_count > 0 && (
                      <div className="absolute top-2 left-2 bg-orange-600 text-white text-[8px] font-black px-2 py-1 uppercase shadow-2xl">
                        🔥 {ad.clicks_count}
                      </div>
                    )}
                    {isDemand && (
                      <div className="absolute top-2 right-2 bg-blue-600 text-white text-[8px] font-black px-2 py-1 uppercase">Besoin</div>
                    )}
                  </Link>

                  <div className="flex flex-col">
                    <button 
                      onClick={() => setSelectedGroup({id: ad.group_id, name: ad.groups?.name || 'Inconnu'})}
                      className="text-[8px] font-black text-gray-400 uppercase tracking-widest text-left mb-1 hover:text-black"
                    >
                      {ad.groups?.name || 'WhatsApp'}
                    </button>
                    <Link href={`/ad/${ad.id}`}>
                      <h3 className="text-sm font-bold leading-tight uppercase line-clamp-2 mb-2">{ad.title}</h3>
                    </Link>
                    <p className="text-xl font-black tracking-tighter mb-4">
                      {ad.price > 0 ? ad.price.toLocaleString() : '---'} <span className="text-[10px] font-bold text-gray-300">FCFA</span>
                    </p>
                    
                    {ad.seller_phone ? (
                      <a 
                        href={`https://wa.me/${ad.seller_phone}?text=INTÉRÊT : *${ad.title.toUpperCase()}*`}
                        onClick={() => registerClick(ad.id)}
                        target="_blank"
                        className="bg-[#25D366] text-white text-center py-3 text-[10px] font-black uppercase tracking-widest transition-transform active:scale-95"
                      >
                        WhatsApp
                      </a>
                    ) : (
                      <div className="bg-gray-100 text-gray-300 text-center py-3 text-[10px] font-black uppercase">Masqué</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* --- VEILLE DE TENSION --- */
          <div className="max-w-md mx-auto text-center py-20 border-2 border-dashed border-gray-100 rounded-3xl">
            <p className="text-gray-300 text-[10px] font-black uppercase mb-4 tracking-widest">Rupture de stock</p>
            <h2 className="text-2xl font-black uppercase mb-8">"{search}" est rare</h2>
            
            {search && !showAlertForm ? (
              <button onClick={() => setShowAlertForm(true)} className="bg-black text-white px-10 py-5 text-[10px] font-black uppercase tracking-widest">Activer la veille</button>
            ) : search && (
              <div className="px-6">
                <input value={userPhone} onChange={(e) => setUserPhone(e.target.value)} placeholder="NUMÉRO WHATSAPP" className="w-full p-4 bg-gray-50 mb-4 outline-none font-black text-center text-sm border-b-2 border-black" />
                <button onClick={createScarcityAlert} className="w-full bg-orange-600 text-white py-4 text-[10px] font-black uppercase">Alertez-moi</button>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="py-20 text-center border-t border-gray-50">
        <p className="text-[9px] font-bold text-gray-200 uppercase tracking-[0.5em]">Garala Singularité v3.1</p>
      </footer>
    </div>
  );
}
