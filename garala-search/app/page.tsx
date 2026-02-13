"use client";
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

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
  clicks_count: number; // Axe 4 : Tension sociale
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

  // --- AXE 4 : ENREGISTRER LA TENSION (CLIC) ---
  const registerClick = async (adId: number) => {
    try {
      await supabase.rpc('increment_clicks', { row_id: adId }); 
      // Note: Crée la fonction RPC increment_clicks en SQL si besoin (voir bas de page)
    } catch (e) {
      // Échec silencieux pour ne pas bloquer l'utilisateur
      await supabase.from('ads').update({ clicks_count: ads.find(a => a.id === adId)!.clicks_count + 1 }).eq('id', adId);
    }
  };

  // --- AXE 3 : PARTAGE DE MUNITION ---
  const shareAd = (ad: Ad) => {
    const text = `🔥 Bonne affaire sur Garala Search !\n\n📦 *${ad.title.toUpperCase()}*\n💰 Prix : ${ad.price.toLocaleString()} FCFA\n\nVoir l'annonce ici : ${window.location.origin}/?id=${ad.id}`;
    if (navigator.share) {
      navigator.share({ title: ad.title, text: text, url: window.location.href });
    } else {
      navigator.clipboard.writeText(text);
      alert("Annonce copiée ! Prêt à être partagé sur WhatsApp.");
    }
  };

  const fetchAds = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase.from('ads').select('*, groups(id, name)');

      if (search.trim()) {
        // Axe 1 : Recherche tolérante (on cherche dans titre et description)
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
      }

      if (selectedCategory !== 'TOUT') query = query.eq('category', selectedCategory);
      if (transactionFilter === 'VENTE') query = query.eq('transaction_type', 'VENTE');
      else if (transactionFilter === 'RECHERCHE') query = query.or('transaction_type.ilike.ACHAT,transaction_type.ilike.RECHERCHE,transaction_type.ilike.DEMANDE');
      if (selectedGroup) query = query.eq('group_id', selectedGroup.id);

      if (sortOption === 'price_asc') query = query.order('price', { ascending: true });
      else if (sortOption === 'price_desc') query = query.order('price', { ascending: false });
      else query = query.order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
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
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans">
      
      {/* --- TOP BAR (SIGNAL PUR) --- */}
      <header className="bg-white border-b sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <h1 onClick={resetFilters} className="text-2xl font-black text-orange-600 tracking-tighter cursor-pointer uppercase">
              Garala<span className="text-black">.</span>
            </h1>
            
            <div className="flex flex-1 gap-2">
              <div className="flex flex-1 bg-gray-100 rounded-2xl border border-transparent focus-within:border-orange-500 transition-all relative overflow-hidden">
                <input 
                  type="text" 
                  placeholder="Quoi ?" 
                  className="flex-1 p-3 bg-transparent outline-none font-medium pr-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">✕</button>
                )}
              </div>
              <select 
                className="bg-gray-100 rounded-2xl px-4 font-bold text-xs outline-none border-none cursor-pointer"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="date_desc">RÉCENTS</option>
                <option value="price_asc">PRIX ↓</option>
              </select>
            </div>
          </div>

          <div className="flex overflow-x-auto gap-2 mt-4 no-scrollbar">
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

      {/* --- GRID (SKELETON DE SIGNAL) --- */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ads.map((ad) => (
            <div key={ad.id} className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 flex flex-col group relative">
              
              {/* Image & Tension */}
              <div className="relative h-64 bg-gray-50 overflow-hidden">
                {ad.image_url ? (
                  <img src={ad.image_url} alt={ad.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-200 font-bold italic text-2xl">NO IMAGE</div>
                )}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">{ad.category}</div>
                {ad.clicks_count > 0 && (
                  <div className="absolute bottom-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-[8px] font-black animate-bounce shadow-lg">
                    🔥 {ad.clicks_count} INTÉRESSÉS
                  </div>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-1">
                  <button onClick={() => setSelectedGroup({id: ad.group_id, name: ad.groups?.name || 'Groupe'})} className="text-[9px] font-black text-orange-500 uppercase tracking-widest hover:underline">
                    {ad.groups?.name || 'Groupe'}
                  </button>
                  <button onClick={() => shareAd(ad)} className="text-gray-300 hover:text-black transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
                  </button>
                </div>

                <h3 className="text-md font-bold text-gray-900 leading-tight mb-4 uppercase line-clamp-2">{ad.title}</h3>
                
                <div className="mt-auto border-t border-gray-50 pt-4 flex flex-col gap-4">
                  <div className="flex justify-between items-end">
                    <span className="text-2xl font-black tracking-tighter">
                      {ad.price > 0 ? ad.price.toLocaleString() : '---'} <span className="text-xs font-bold text-gray-400">FCFA</span>
                    </span>
                  </div>

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
          ))}
        </div>
      </main>
    </div>
  );
}
