"use client";
import { useState, useEffect } from 'react';
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
  group_id: string; // ID du groupe pour le filtrage
  groups: {
    name: string;
    id: string;
  } | null;
}

// Liste des catégories fixes (doit correspondre au worker)
const CATEGORIES = ["TOUT", "TECH", "IMMO", "AUTO", "MODE", "MAISON", "SERVICES", "DIVERS"];

export default function Home() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  
  // --- ÉTATS DE FILTRES ---
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('TOUT');
  const [sortOption, setSortOption] = useState('date_desc'); // date_desc, price_asc, price_desc
  const [selectedGroup, setSelectedGroup] = useState<{id: string, name: string} | null>(null);

  // Recharger les annonces à chaque changement de filtre
  useEffect(() => {
    fetchAds();
  }, [selectedCategory, sortOption, selectedGroup]); // Dépendances

  async function fetchAds() {
    setLoading(true);
    
    // 1. Base de la requête
    let query = supabase
      .from('ads')
      .select('*, groups(id, name)');

    // 2. Filtre Recherche Texte
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // 3. Filtre Catégorie
    if (selectedCategory !== 'TOUT') {
      query = query.eq('category', selectedCategory);
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
      // Par défaut : Date décroissante
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;
    
    if (error) console.error("Erreur:", error);
    else setAds((data as any[]) || []);
    
    setLoading(false);
  }

  // Action quand on appuie sur Entrée ou le bouton chercher
  const handleSearch = () => {
    fetchAds();
  };

  // Action pour entrer dans une boutique
  const enterShop = (groupId: string, groupName: string) => {
    setSelectedGroup({ id: groupId, name: groupName });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-20">
      
      {/* --- HEADER FIXE --- */}
      <header className="bg-white border-b sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          
          {/* Logo + Recherche + Tri */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <h1 
              onClick={() => {setSelectedGroup(null); setSelectedCategory('TOUT'); setSearch('');}}
              className="text-2xl font-extrabold text-orange-600 tracking-tight cursor-pointer flex-shrink-0"
            >
              GARALA<span className="text-gray-800">SEARCH</span>
            </h1>
            
            <div className="flex flex-1 gap-2">
              <div className="flex flex-1 shadow-sm rounded-xl overflow-hidden border border-gray-200">
                <input 
                  type="text" 
                  placeholder="Rechercher..." 
                  className="flex-1 p-3 outline-none text-black min-w-0"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                {/* Menu de Tri Mobile/Desktop */}
                <select 
                  className="bg-gray-50 border-l border-gray-200 px-3 text-sm text-gray-600 outline-none cursor-pointer"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="date_desc">🕒 Récents</option>
                  <option value="price_asc">💰 Prix -</option>
                  <option value="price_desc">💎 Prix +</option>
                </select>
              </div>
              <button 
                onClick={handleSearch}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 rounded-xl font-bold transition-colors"
              >
                🔍
              </button>
            </div>
          </div>

          {/* --- BARRE DE CATÉGORIES (Défilable) --- */}
          <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                  selectedCategory === cat 
                    ? "bg-black text-white shadow-md transform scale-105" 
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* --- BANNIÈRE MODE BOUTIQUE --- */}
      {selectedGroup && (
        <div className="bg-orange-50 border-b border-orange-100">
          <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-2 text-orange-800">
              <span className="bg-orange-200 p-1 rounded">🏪</span>
              <span className="font-medium text-sm">Boutique : <strong>{selectedGroup.name}</strong></span>
            </div>
            <button 
              onClick={() => setSelectedGroup(null)}
              className="text-orange-600 text-xs font-bold border border-orange-200 px-3 py-1 rounded-full hover:bg-orange-100"
            >
              QUITTER ✕
            </button>
          </div>
        </div>
      )}

      {/* --- GRILLE D'ANNONCES --- */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-4 flex justify-between items-end">
          <p className="text-sm text-gray-500">
            {loading ? "Chargement..." : `${ads.length} annonce(s) trouvée(s)`}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ads.map((ad) => (
              <div key={ad.id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100 flex flex-col overflow-hidden">
                
                {/* IMAGE */}
                <div className="relative h-56 bg-gray-100">
                  {ad.image_url ? (
                    <img 
                      src={ad.image_url} 
                      alt={ad.title} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-300">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-white uppercase">
                    {ad.category}
                  </div>
                </div>

                {/* INFOS */}
                <div className="p-4 flex-1 flex flex-col">
                  {/* LIEN GROUPE CLIQUABLE */}
                  {ad.groups?.name && (
                    <button 
                      onClick={() => enterShop(ad.group_id, ad.groups!.name)}
                      className="text-left mb-1 inline-block text-[10px] font-bold text-orange-600 hover:text-orange-800 uppercase tracking-wide hover:underline"
                    >
                      @{ad.groups.name} ›
                    </button>
                  )}

                  <h3 className="text-base font-bold text-gray-900 leading-tight mb-1 line-clamp-2">
                    {ad.title}
                  </h3>
                  
                  <p className="text-gray-500 text-xs line-clamp-2 mb-4 flex-1">
                    {ad.description}
                  </p>
                  
                  <div className="pt-3 border-t border-gray-50 mt-auto">
                    <div className="flex justify-between items-baseline mb-3">
                      <span className="text-xl font-extrabold text-gray-900">
                        {ad.price > 0 ? `${ad.price.toLocaleString()}` : "N.C."}
                        {ad.price > 0 && <span className="text-xs font-normal text-gray-500 ml-1">FCFA</span>}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(ad.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {ad.seller_phone ? (
                      <a 
                        href={`https://wa.me/${ad.seller_phone}?text=${encodeURIComponent(
                          `Salut! J'ai vu sur Garala: *${ad.title.toUpperCase()}*. Toujours dispo ?`
                        )}`} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full bg-green-500 hover:bg-green-600 text-white text-center py-2.5 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                        WhatsApp
                      </a>
                    ) : (
                      <div className="bg-gray-100 text-gray-400 text-center py-2.5 rounded-lg text-xs font-medium cursor-not-allowed">
                        Numéro masqué
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && ads.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <p className="text-gray-500 text-lg">Aucun résultat trouvé.</p>
            <button 
              onClick={() => { setSearch(''); setSelectedCategory('TOUT'); setSelectedGroup(null); }}
              className="mt-2 text-orange-600 font-bold hover:underline text-sm"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
