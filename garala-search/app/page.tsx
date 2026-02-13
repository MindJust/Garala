"use client";
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

interface Ad {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  image_url: string | null;
  seller_phone: string | null;
  transaction_type: string;
  created_at: string;
  group_id: string;
  clicks_count: number;
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
  
  // États Axe 4 (Veille de tension)
  const [showAlertForm, setShowAlertForm] = useState(false);
  const [userPhone, setUserPhone] = useState('');

  // --- AXE 4 : CRÉER UNE ALERTE DE RARETÉ ---
  const createScarcityAlert = async () => {
    if (!userPhone || !search) return;
    const { error } = await supabase.from('scarcity_alerts').insert([
      { query: search.toLowerCase(), user_phone: userPhone }
    ]);
    if (!error) {
      alert("⚡ VEILLE ACTIVÉE. Garala vous bipera dès que cet objet sortira dans un groupe.");
      setShowAlertForm(false);
      setUserPhone('');
    }
  };

  // --- AXE 3 & 4 : PRESSION SOCIALE ---
  const registerClick = async (adId: number) => {
    try {
      await supabase.rpc('increment_clicks', { row_id: adId }); 
    } catch (e) {
      console.error("Erreur Tension:", e);
    }
  };

  const shareAd = (ad: Ad) => {
    const text = `🔥 Bonne affaire sur Garala Search !\n\n📦 *${ad.title.toUpperCase()}*\n💰 Prix : ${ad.price.toLocaleString()} FCFA\n\nVoir l'annonce ici : ${window.location.origin}/ad/${ad.id}`;
    if (navigator.share) {
      navigator.share({ title: ad.title, text: text, url: `${window.location.origin}/ad/${ad.id}` });
    } else {
      navigator.clipboard.writeText(text);
      alert("Lien copié !");
    }
  };

  const fetchAds = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase.from('ads').select('*, groups(id, name)');

      if (search.trim()) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
      }

      if (selectedCategory !== 'TOUT') query = query.eq('category', selectedCategory);
      
      if (transactionFilter === 'VENTE') {
        query = query.eq('transaction_type', 'VENTE');
      } else if (transactionFilter === 'RECHERCHE') {
        query = query.or('transaction_type.ilike.ACHAT,transaction_type.ilike.RECHERCHE,transaction_type.ilike.DEMANDE');
      }

      if (selectedGroup) query = query.eq('group_id', selectedGroup.id);

      const isAsc = sortOption === 'price_asc';
      const sortCol = sortOption.includes('price') ? 'price' : 'created_at';
      query = query.order(sortCol, { ascending: isAsc });

      const { data, error } = await query;
      if (error) throw error;
      setAds((data as any[]) || []);

      // Log de recherche KPI
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
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans pb-10">
      
      {/* --- HEADER --- */}
      <header className="bg-white border-b sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center justify-between">
                <h1 onClick={resetFilters} className="text-2xl font-black text-orange-600 tracking-tighter cursor-pointer uppercase">
                Garala<span className="text-black">.</span>
                </h1>
                <div className="flex md:hidden gap-1 bg-gray-100 p-1 rounded-xl">
                    <button onClick={() => setTransactionFilter('VENTE')} className={`px-3 py-1 rounded-lg text-[9px] font-black ${transactionFilter === 'VENTE' ? 'bg-white shadow-sm' : 'opacity-40'}`}>VENTES</button>
                    <button onClick={() => setTransactionFilter('RECHERCHE')} className={`px-3 py-1 rounded-lg text-[9px] font-black ${transactionFilter === 'RECHERCHE' ? 'bg-white shadow-sm text-blue-600' : 'opacity-40'}`}>DEMANDES</button>
                </div>
            </div>
            
            <div className="flex flex-1 gap-2">
              <div className="flex flex-1 bg-gray-100 rounded-2xl border border-transparent focus-within:border-orange-500 transition-all relative overflow-hidden text-black">
                <input 
                  type="text" 
                  placeholder="Quoi ?" 
                  className="flex-1 p-3 bg-transparent outline-none font-medium pr-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 bg-white rounded-full w-6 h-6 flex items-center justify-center shadow-sm">✕</button>
                )}
              </div>
              <select 
                className="bg-gray-100 rounded-2xl px-4 font-bold text-[10px] outline-none border-none cursor-pointer text-gray-700"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="date_desc">RÉCENTS</option>
                <option value="price_asc">PRIX ↓</option>
                <option value="price_desc">PRIX ↑</option>
              </select>
              <div className="hidden md:flex gap-1 bg-gray-100 p-1 rounded-xl">
                    <button onClick={() => setTransactionFilter('VENTE')} className={`px-4 py-1 rounded-lg text-[10px] font-black ${transactionFilter === 'VENTE' ? 'bg-white shadow-sm' : 'opacity-40'}`}>VENTES</button>
                    <button onClick={() => setTransactionFilter('RECHERCHE')} className={`px-4 py-1 rounded-lg text-[10px] font-black ${transactionFilter === 'RECHERCHE' ? 'bg-white shadow-sm text-blue-600' : 'opacity-40'}`}>DEMANDES</button>
               </div>
            </div>
          </div>

          <div className="flex overflow-x-auto gap-2 mt-4 no-scrollbar pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-xl text-[10px] font-black transition-all border-2 ${
                  selectedCategory === cat ? "bg-black text-white border-black" : "bg-white text-gray-400 border-gray-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* --- MAIN --- */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {selectedGroup && (
            <div className="mb-6 flex items-center justify-between bg-orange-600 text-white p-4 rounded-2xl shadow-lg">
                <span className="font-black uppercase text-xs tracking-widest">Boutique: {selectedGroup.name}</span>
                <button onClick={() => setSelectedGroup(null)} className="text-xs font-bold border border-white/30 px-3 py-1 rounded-lg">QUITTER ✕</button>
            </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-4 border-orange-100 border-t-orange-600"></div></div>
        ) : ads.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ads.map((ad) => {
               const isDemand = ad.transaction_type?.toUpperCase().includes('ACHAT') || ad.transaction_type?.toUpperCase().includes('RECHERCHE') || ad.transaction_type?.toUpperCase().includes('DEMANDE');
               return (
                <div key={ad.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 flex flex-col group relative">
                
                <Link href={`/ad/${ad.id}`} className="relative h-64 bg-gray-50 overflow-hidden block">
                  {ad.image_url ? (
                    <img src={ad.image_url} alt={ad.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-200 font-bold italic text-2xl">GARALA</div>
                  )}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest text-black shadow-sm">{ad.category}</div>
                  
                  {isDemand && (
                    <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-[8px] font-black shadow-lg animate-pulse uppercase">DEMANDE</div>
                  )}

                  {ad.clicks_count > 0 && (
                    <div className="absolute bottom-4 left-4 bg-orange-600 text-white px-3 py-1 rounded-full text-[8px] font-black shadow-lg">
                      🔥 {ad.clicks_count} INTÉRESSÉS
                    </div>
                  )}
                </Link>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-1">
                    <button onClick={() => setSelectedGroup({id: ad.group_id, name: ad.groups?.name || 'Groupe'})} className="text-[9px] font-black text-orange-500 uppercase tracking-widest hover:underline text-left">
                      {ad.groups?.name || 'Groupe Privé'}
                    </button>
                    <button onClick={() => shareAd(ad)} className="text-gray-300 hover:text-black transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
                    </button>
                  </div>

                  <Link href={`/ad/${ad.id}`}>
                      <h3 className="text-sm font-bold text-gray-900 leading-tight mb-4 uppercase line-clamp-2 hover:text-orange-600 transition-colors">
                          {ad.title}
                      </h3>
                  </Link>
                  
                  <div className="mt-auto border-t border-gray-50 pt-4 flex flex-col gap-4">
                    <span className="text-2xl font-black tracking-tighter text-black">
                        {ad.price > 0 ? ad.price.toLocaleString() : '---'} <span className="text-xs font-bold text-gray-400">FCFA</span>
                    </span>

                    {ad.seller_phone ? (
                      <a 
                        href={`https://wa.me/${ad.seller_phone}?text=${encodeURIComponent(`Bonjour, je vous contacte via Garala pour : *${ad.title.toUpperCase()}*. Est-il disponible ?`)}`}
                        onClick={() => registerClick(ad.id)}
                        target="_blank"
                        className="w-full bg-[#25D366] text-white text-center py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase hover:scale-95 transition-transform shadow-xl shadow-green-100"
                      >
                        Prendre sur WhatsApp
                      </a>
                    ) : (
                      <div className="w-full bg-gray-100 text-gray-400 text-center py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase cursor-not-allowed">NUMÉRO MASQUÉ</div>
                    )}
                  </div>
                </div>
              </div>
               )
            })}
          </div>
        ) : (
          /* --- ÉTAT AXE 4 : VEILLE DE TENSION --- */
          <div className="max-w-md mx-auto text-center py-10 bg-white rounded-[3rem] shadow-sm border border-gray-100 p-8">
            <div className="text-6xl mb-6 grayscale">🕵️‍♂️</div>
            <h2 className="text-xl font-black uppercase mb-2">Objet introuvable ?</h2>
            <p className="text-gray-400 text-xs mb-8 font-bold uppercase tracking-tighter italic">
                {search ? `L'objet "${search}" est rare.` : "Aucune annonce disponible."} 
                Nos bots surveillent 100+ groupes pour vous.
            </p>
            
            {search && !showAlertForm ? (
              <button onClick={() => setShowAlertForm(true)} className="bg-orange-600 text-white w-full py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-lg shadow-orange-100">Activer la Veille</button>
            ) : search && (
              <div className="animate-in fade-in zoom-in duration-300">
                <p className="text-[10px] font-black text-gray-400 uppercase mb-4 tracking-widest">Votre numéro WhatsApp</p>
                <input value={userPhone} onChange={(e) => setUserPhone(e.target.value)} placeholder="Ex: 22890..." className="w-full p-5 bg-gray-50 rounded-2xl mb-4 outline-none border-2 border-transparent focus:border-orange-500 font-black text-black text-center" />
                <button onClick={createScarcityAlert} className="w-full bg-black text-white py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest">Bipez-moi dès qu'il sort</button>
                <button onClick={() => setShowAlertForm(false)} className="mt-4 text-[9px] font-black text-gray-300 uppercase tracking-widest">Annuler</button>
              </div>
            )}
            
            {!search && (
                 <button onClick={resetFilters} className="text-orange-600 font-black text-xs uppercase tracking-widest underline">Réinitialiser</button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
