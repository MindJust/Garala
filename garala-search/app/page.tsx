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

  // --- LOGIQUE DE RÉCUPÉRATION ---
  const fetchAds = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase.from('ads').select('*, groups(id, name)');

      if (search.trim()) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
      if (selectedCategory !== 'TOUT') query = query.eq('category', selectedCategory);
      if (selectedGroup) query = query.eq('group_id', selectedGroup.id);
      
      if (transactionFilter === 'VENTE') query = query.eq('transaction_type', 'VENTE');
      else if (transactionFilter === 'RECHERCHE') query = query.or('transaction_type.ilike.ACHAT,transaction_type.ilike.RECHERCHE,transaction_type.ilike.DEMANDE');

      // Tri de base par date
      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;

      let processedAds = (data as Ad[]) || [];

      // --- LOGIQUE DE TRI PREMIUM (0/N.C. à la fin) ---
      processedAds.sort((a, b) => {
        if (sortOption === 'price_asc') {
          if (a.price === 0 && b.price !== 0) return 1;
          if (a.price !== 0 && b.price === 0) return -1;
          return a.price - b.price;
        }
        if (sortOption === 'price_desc') {
          if (a.price === 0 && b.price !== 0) return 1;
          if (a.price !== 0 && b.price === 0) return -1;
          return b.price - a.price;
        }
        return 0; 
      });

      setAds(processedAds);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory, transactionFilter, sortOption, selectedGroup]);

  useEffect(() => { fetchAds(); }, [fetchAds]);

  // --- ACTIONS ---
  const resetFilters = () => {
    setSearch(''); setSelectedCategory('TOUT'); setTransactionFilter('TOUT');
    setSelectedGroup(null); setSortOption('date_desc');
  };

  const enterShop = (groupId: string, groupName: string) => {
    setSelectedGroup({ id: groupId, name: groupName });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-[#1A1C1E] font-sans pb-10">
      
      {/* --- NAV PREMIUM STICKY --- */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row items-center gap-5">
            <h1 onClick={resetFilters} className="text-2xl font-black tracking-tighter cursor-pointer text-orange-600 italic">
              GARALA<span className="text-slate-900 not-italic">.</span>
            </h1>
            
            <div className="flex-1 w-full flex items-center gap-3">
              <div className="relative flex-1 group">
                <input 
                  type="text" 
                  placeholder="Rechercher l'exceptionnel..." 
                  className="w-full pl-12 pr-12 py-3.5 bg-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 transition-all text-sm font-medium"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && fetchAds()}
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full text-[10px] transition-all">✕</button>
                )}
              </div>
              
              <select 
                className="hidden sm:block bg-gray-100 border-none rounded-2xl px-4 py-3.5 text-xs font-bold appearance-none cursor-pointer hover:bg-gray-200 transition-colors"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="date_desc">🕒 Nouveautés</option>
                <option value="price_asc">💰 Prix Croissant</option>
                <option value="price_desc">💎 Prix Décroissant</option>
              </select>

              <button onClick={fetchAds} className="bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-bold text-sm hover:bg-orange-600 transition-all shadow-lg shadow-slate-200">
                Lancer
              </button>
            </div>
          </div>

          <div className="flex overflow-x-auto gap-3 mt-5 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-[11px] font-black transition-all ${
                  selectedCategory === cat 
                    ? "bg-orange-600 text-white shadow-xl shadow-orange-100 scale-105" 
                    : "bg-white text-gray-400 hover:text-slate-900 border border-gray-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* --- CAROUSEL HERO --- */}
      {!search && selectedCategory === 'TOUT' && ads.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 mt-8">
          <h2 className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase mb-4">À la une</h2>
          <div className="flex overflow-x-auto gap-4 no-scrollbar snap-x">
            {ads.filter(a => a.image_url).slice(0, 5).map((ad) => (
              <div 
                key={`hero-${ad.id}`}
                className="min-w-[85%] md:min-w-[45%] h-64 relative rounded-[2.5rem] overflow-hidden snap-center group cursor-pointer"
                onClick={() => enterShop(ad.group_id, ad.groups?.name || 'Boutique')}
              >
                <img src={ad.image_url!} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="text-[9px] font-black text-white/70 uppercase tracking-widest">{ad.category}</span>
                  <h3 className="text-white text-xl font-bold line-clamp-1 uppercase">{ad.title}</h3>
                  <p className="text-orange-400 font-bold text-sm mt-1">{ad.price > 0 ? `${ad.price.toLocaleString()} FCFA` : "Prix sur demande"}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* --- FILTRES SECONDAIRES --- */}
      <div className="max-w-6xl mx-auto px-6 mt-10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
          {['TOUT', 'VENTE', 'RECHERCHE'].map((t) => (
            <button
              key={t}
              onClick={() => setTransactionFilter(t)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black transition-all ${
                transactionFilter === t ? "bg-slate-900 text-white shadow-lg" : "text-gray-400 hover:text-slate-600"
              }`}
            >
              {t === 'RECHERCHE' ? 'DEMANDES' : t}
            </button>
          ))}
        </div>
        {selectedGroup && (
          <button onClick={() => setSelectedGroup(null)} className="bg-orange-100 text-orange-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter">
            Boutique: {selectedGroup.name} ✕
          </button>
        )}
      </div>

      {/* --- GRID D'ANNONCES --- */}
      <main className="max-w-6xl mx-auto px-6 mt-8">
        {loading ? (
          <div className="flex flex-col items-center py-20 animate-pulse">
            <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mb-4" />
            <span className="text-[10px] font-black text-gray-400 tracking-[0.3em] uppercase">Chargement</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {ads.map((ad) => {
              const isDemand = ad.transaction_type?.toUpperCase().includes('ACHAT') || ad.transaction_type?.toUpperCase().includes('RECHERCHE');
              return (
                <div key={ad.id} className="group bg-white rounded-[2rem] overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-50 flex flex-col h-full">
                  <div className="relative h-72 overflow-hidden">
                    {ad.image_url ? (
                      <img src={ad.image_url} alt={ad.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full bg-slate-50 flex items-center justify-center text-[4rem] font-black text-slate-100 italic">G</div>
                    )}
                    <div className="absolute top-5 left-5 px-4 py-1.5 bg-white/90 backdrop-blur rounded-full text-[9px] font-black text-slate-900 shadow-sm uppercase tracking-tighter border border-white/20">
                      {ad.category}
                    </div>
                    {isDemand && (
                      <div className="absolute top-5 right-5 px-4 py-1.5 bg-blue-600 text-white rounded-full text-[9px] font-black shadow-lg uppercase tracking-widest animate-pulse">
                        Demande
                      </div>
                    )}
                  </div>

                  <div className="p-7 flex-1 flex flex-col">
                    {ad.groups?.name && (
                      <button 
                        onClick={() => enterShop(ad.group_id, ad.groups!.name)}
                        className="text-left mb-3 text-[9px] font-black text-orange-500 hover:text-orange-700 uppercase tracking-widest flex items-center gap-1"
                      >
                        <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-ping" /> {ad.groups.name}
                      </button>
                    )}
                    <h3 className="text-lg font-bold text-slate-900 leading-tight mb-2 line-clamp-2 uppercase group-hover:text-orange-600 transition-colors">
                      {ad.title}
                    </h3>
                    <p className="text-gray-400 text-xs line-clamp-3 mb-6 flex-1 leading-relaxed font-medium">
                      {ad.description}
                    </p>
                    
                    <div className="pt-6 border-t border-gray-50 flex flex-col gap-4">
                      <div className="flex justify-between items-end">
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Estimation</span>
                          <span className="text-2xl font-black text-slate-900 tracking-tighter">
                            {ad.price > 0 ? `${ad.price.toLocaleString()}` : "N.C."}
                            {ad.price > 0 && <span className="text-xs font-bold text-gray-400 ml-1">FCFA</span>}
                          </span>
                        </div>
                        <span className="text-[9px] font-bold text-gray-300 bg-gray-50 px-2 py-1 rounded-md">
                          {new Date(ad.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {ad.seller_phone ? (
                        <a 
                          href={`https://wa.me/${ad.seller_phone}?text=${encodeURIComponent(`Bonjour ! J'ai repéré votre annonce sur Garala Search : *${ad.title.toUpperCase()}* (${ad.price > 0 ? ad.price.toLocaleString() + ' FCFA' : 'Prix à discuter'}). Est-elle toujours disponible ?`)}`} 
                          target="_blank" rel="noopener noreferrer"
                          className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-4 rounded-[1.2rem] font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-100 group-hover:scale-[1.02]"
                        >
                          Contacter le vendeur
                        </a>
                      ) : (
                        <div className="w-full bg-gray-100 text-gray-400 text-center py-4 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest border border-gray-200/50">
                          Identité masquée
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && ads.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-[3rem] shadow-sm border border-gray-50">
            <div className="text-6xl mb-6 opacity-20">🏝️</div>
            <p className="text-gray-400 text-xs font-black uppercase tracking-[0.4em]">Le catalogue est vide</p>
            <button onClick={resetFilters} className="mt-8 text-orange-600 text-[10px] font-black uppercase tracking-widest border-b-2 border-orange-200 pb-1 hover:border-orange-600 transition-all">
              Réinitialiser l'expérience
            </button>
          </div>
        )}
      </main>

      <footer className="max-w-6xl mx-auto px-6 py-20 text-center">
        <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.5em]">&copy; {new Date().getFullYear()} Garala Search.</p>
      </footer>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
