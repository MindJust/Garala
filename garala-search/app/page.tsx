"use client";
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

// Structure de données
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
  groups: {
    name: string;
    id: string;
  } | null;
}

const CATEGORIES = ["TOUT", "TECH", "IMMO", "AUTO", "MODE", "MAISON", "SERVICES", "DIVERS"];

export default function Home() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  
  // --- ÉTATS DE FILTRES ---
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('TOUT');
  const [transactionFilter, setTransactionFilter] = useState('TOUT'); 
  const [sortOption, setSortOption] = useState('date_desc');
  const [selectedGroup, setSelectedGroup] = useState<{id: string, name: string} | null>(null);

  // Fonction de récupération (mémorisée pour éviter les boucles)
  const fetchAds = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('ads')
        .select('*, groups(id, name)');

      // 1. Recherche Texte (Titre ou Description)
      if (search.trim()) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
      }

      // 2. Filtre Catégorie
      if (selectedCategory !== 'TOUT') {
        query = query.eq('category', selectedCategory);
      }

      // 3. Filtre Type de transaction (Ventes vs Demandes)
      if (transactionFilter === 'VENTE') {
        query = query.eq('transaction_type', 'VENTE');
      } else if (transactionFilter === 'RECHERCHE') {
        // Gère les différents termes que l'IA pourrait utiliser
        query = query.or('transaction_type.ilike.ACHAT,transaction_type.ilike.RECHERCHE,transaction_type.ilike.DEMANDE');
      }

      // 4. Filtre Groupe (Mode Boutique)
      if (selectedGroup) {
        query = query.eq('group_id', selectedGroup.id);
      }

      // 5. Tris
      if (sortOption === 'price_asc') {
        query = query.order('price', { ascending: true });
      } else if (sortOption === 'price_desc') {
        query = query.order('price', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;
      setAds((data as any[]) || []);
    } catch (err) {
      console.error("Erreur Supabase:", err);
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory, transactionFilter, sortOption, selectedGroup]);

  // Déclencheur automatique
  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  // Réinitialisation complète
  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('TOUT');
    setTransactionFilter('TOUT');
    setSelectedGroup(null);
    setSortOption('date_desc');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-20">
      
      {/* --- HEADER FIXE --- */}
      <header className="bg-white border-b sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <h1 
              onClick={resetFilters}
              className="text-2xl font-extrabold text-orange-600 tracking-tight cursor-pointer flex-shrink-0"
            >
              GARALA<span className="text-gray-800">SEARCH</span>
            </h1>
            
            <div className="flex flex-col sm:flex-row flex-1 gap-2">
              {/* BARRE DE RECHERCHE */}
              <div className="flex flex-1 shadow-sm rounded-xl overflow-hidden border border-gray-200 bg-gray-50 relative">
                <input 
                  type="text" 
                  placeholder="Rechercher..." 
                  className="flex-1 p-3 bg-transparent outline-none text-black min-w-0 pr-20"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                
                <div className="flex items-center absolute right-16 top-1/2 -translate-y-1/2 gap-1">
                    {search && (
                    <button 
                        onClick={() => setSearch('')}
                        className="text-gray-400 hover:text-orange-600 p-2 bg-white rounded-full shadow-sm"
                    >
                        ✕
                    </button>
                    )}
                </div>

                <select 
                  className="bg-white border-l border-gray-200 px-2 text-sm text-gray-600 outline-none cursor-pointer"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="date_desc">🕒 Récents</option>
                  <option value="price_asc">💰 Prix -</option>
                  <option value="price_desc">💎 Prix +</option>
                </select>
              </div>

              {/* FILTRE VENTES / DEMANDES */}
              <div className="flex bg-gray-100 rounded-xl p-1 shadow-inner border border-gray-200">
                <button 
                  onClick={() => setTransactionFilter('TOUT')}
                  className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${transactionFilter === 'TOUT' ? 'bg-white text-black shadow-sm' : 'text-gray-400'}`}
                >
                  TOUT
                </button>
                <button 
                  onClick={() => setTransactionFilter('VENTE')}
                  className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${transactionFilter === 'VENTE' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-400'}`}
                >
                  VENTES
                </button>
                <button 
                  onClick={() => setTransactionFilter('RECHERCHE')}
                  className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${transactionFilter === 'RECHERCHE' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}
                >
                  DEMANDES
                </button>
              </div>
            </div>
          </div>

          {/* BARRE DES CATÉGORIES */}
          <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[11px] font-bold transition-all border ${
                  selectedCategory === cat 
                    ? "bg-black text-white border-black shadow-md" 
                    : "bg-white text-gray-500 border-gray-200 hover:border-orange-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* BANNIÈRE BOUTIQUE */}
      {selectedGroup && (
        <div className="bg-orange-50 border-b border-orange-100">
          <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
            <p className="text-orange-800 text-sm font-bold flex items-center gap-2">
              <span className="bg-orange-200 px-2 py-0.5 rounded text-lg">🏪</span>
              Boutique : {selectedGroup.name}
            </p>
            <button 
              onClick={() => setSelectedGroup(null)}
              className="text-orange-600 text-[10px] font-black tracking-widest border-2 border-orange-200 px-3 py-1 rounded-full bg-white"
            >
              TOUS LES GROUPES ✕
            </button>
          </div>
        </div>
      )}

      {/* GRILLE D'ANNONCES */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">
          {loading ? "Recherche en cours..." : `${ads.length} résultat(s)`}
        </p>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-orange-100 border-t-orange-500"></div>
            <p className="text-xs font-bold text-orange-400 animate-pulse uppercase">Chargement de Garala...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {ads.map((ad) => {
              const isDemand = ad.transaction_type?.toUpperCase().includes('ACHAT') || ad.transaction_type?.toUpperCase().includes('RECHERCHE');
              
              return (
                <div key={ad.id} className="bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col overflow-hidden group">
                  
                  {/* ZONE IMAGE */}
                  <div className="relative h-64 bg-gray-50 overflow-hidden">
                    {ad.image_url ? (
                      <img 
                        src={ad.image_url} 
                        alt={ad.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-200 font-black text-4xl opacity-20 italic">GARALA</div>
                    )}
                    
                    {/* Badge Catégorie */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-xl text-[9px] font-black text-orange-600 shadow-sm border border-orange-100 uppercase tracking-tighter">
                      {ad.category}
                    </div>

                    {/* Badge Type (Vente vs Demande) */}
                    {isDemand && (
                      <div className="absolute top-4 right-4 bg-blue-600 text-white text-[9px] font-black px-3 py-1 rounded-xl shadow-lg uppercase tracking-widest animate-pulse">
                        DEMANDE
                      </div>
                    )}
                  </div>

                  {/* ZONE INFOS */}
                  <div className="p-6 flex-1 flex flex-col">
                    {ad.groups?.name && (
                      <button 
                        onClick={() => setSelectedGroup({id: ad.group_id, name: ad.groups!.name})}
                        className="text-left mb-2 text-[9px] font-black text-orange-500 hover:text-orange-700 uppercase tracking-widest flex items-center gap-1"
                      >
                        <span className="opacity-50">@</span>{ad.groups.name} ›
                      </button>
                    )}

                    <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2 uppercase line-clamp-2 group-hover:text-orange-600 transition-colors">
                      {ad.title}
                    </h3>
                    
                    <p className="text-gray-500 text-xs line-clamp-3 mb-6 flex-1 leading-relaxed">
                      {ad.description}
                    </p>
                    
                    <div className="pt-4 border-t border-gray-100 mt-auto">
                      <div className="flex justify-between items-end mb-4">
                        <div>
                            <span className="block text-[8px] font-black text-gray-400 uppercase tracking-tighter mb-0.5">Prix indicatif</span>
                            <span className="text-2xl font-black text-gray-900">
                            {ad.price > 0 ? `${ad.price.toLocaleString()}` : "N.C."}
                            {ad.price > 0 && <span className="text-[10px] font-bold text-gray-400 ml-1">FCFA</span>}
                            </span>
                        </div>
                        <span className="text-[9px] font-bold text-gray-300">
                          {new Date(ad.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {ad.seller_phone ? (
                        <a 
                          href={`https://wa.me/${ad.seller_phone}?text=${encodeURIComponent(
                            `Bonjour! J'ai vu votre annonce sur Garala Search : *${ad.title.toUpperCase()}*. Est-elle toujours disponible ?`
                          )}`} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full bg-green-500 hover:bg-green-600 text-white text-center py-3.5 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 hover:gap-4 shadow-lg shadow-green-100"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                          WhatsApp
                        </a>
                      ) : (
                        <div className="bg-gray-100 text-gray-400 text-center py-3.5 rounded-2xl text-[9px] font-black tracking-widest uppercase cursor-not-allowed border border-gray-200">
                          Numéro masqué
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* AUCUN RÉSULTAT */}
        {!loading && ads.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-[40px] border-4 border-dashed border-gray-100">
            <p className="text-gray-300 text-6xl mb-4 font-black">∅</p>
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Aucune annonce trouvée</p>
            <button 
              onClick={resetFilters}
              className="mt-6 bg-orange-100 text-orange-600 px-8 py-3 rounded-2xl text-xs font-black hover:bg-orange-600 hover:text-white transition-all uppercase tracking-widest"
            >
              Réinitialiser tout
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
