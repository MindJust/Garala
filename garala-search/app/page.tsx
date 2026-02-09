"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Définition de la structure d'une annonce
interface Ad {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  image_url: string | null;
  seller_phone: string | null; // Peut être null si masqué
  transaction_type: string;
  created_at: string;
  // Relation avec la table groups (récupérée via le select)
  groups: {
    name: string;
  } | null;
}

export default function Home() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAds();
  }, []);

  async function fetchAds() {
    setLoading(true);
    
    // On sélectionne toutes les colonnes de 'ads' ET le nom du groupe lié
    let query = supabase
      .from('ads')
      .select('*, groups(name)')
      .order('created_at', { ascending: false });

    if (search) {
      // Recherche dans le titre, la description OU le nom du groupe
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error } = await query;
    
    if (error) {
      console.error("Erreur de chargement:", error);
    } else {
      // TypeScript a parfois du mal avec les jointures Supabase, on force le type
      setAds((data as any[]) || []);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* HEADER */}
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <h1 className="text-3xl font-extrabold text-orange-600 tracking-tight">
              GARALA<span className="text-gray-800">SEARCH</span>
            </h1>
            
            <div className="flex w-full md:w-2/3 shadow-sm">
              <input 
                type="text" 
                placeholder="Chercher un produit, un service..." 
                className="flex-1 p-3 border rounded-l-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && fetchAds()}
              />
              <button 
                onClick={fetchAds}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-r-xl font-bold transition-all"
              >
                Chercher
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* CONTENU */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-black">
            {search ? `Résultats pour "${search}"` : "Dernières annonces"} ({ads.length})
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {ads.map((ad) => (
              <div key={ad.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col">
                
                {/* IMAGE */}
                <div className="relative h-56 bg-gray-200">
                  {ad.image_url ? (
                    <img 
                      src={ad.image_url} 
                      alt={ad.title} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 italic">
                      Pas d'image
                    </div>
                  )}
                  {/* Badge Catégorie */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-orange-600 shadow-sm uppercase">
                    {ad.category}
                  </div>
                </div>

                {/* INFOS */}
                <div className="p-5 flex-1 flex flex-col">
                  {/* Nom du groupe source */}
                  {ad.groups?.name && (
                    <div className="mb-1 text-xs text-gray-400 font-medium uppercase tracking-wide flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                      {ad.groups.name}
                    </div>
                  )}

                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-800 leading-tight line-clamp-2">
                      {ad.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
                    {ad.description}
                  </p>
                  
                  <div className="pt-4 border-t mt-auto">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-black text-gray-900">
                        {ad.price > 0 ? `${ad.price.toLocaleString()} FCFA` : "Prix à discuter"}
                      </span>
                    </div>
                    
                    {/* LOGIQUE BOUTON : Actif si numéro, Inactif si masqué */}
                    {ad.seller_phone ? (
                      <a 
                        href={`https://wa.me/${ad.seller_phone}?text=${encodeURIComponent(
                          `Bonjour, je vous contacte depuis Garala Search. Je suis intéressé par : *${ad.title.toUpperCase()}* (${ad.price > 0 ? ad.price.toLocaleString() + ' FCFA' : 'Prix à discuter'}). Dispo ?`
                        )}`} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 block w-full bg-green-500 hover:bg-green-600 text-white text-center py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                        Contacter le vendeur
                      </a>
                    ) : (
                      <div className="mt-4 w-full bg-gray-100 text-gray-400 text-center py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 cursor-not-allowed">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
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
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <p className="text-gray-500 text-xl font-medium">Aucune annonce trouvée.</p>
            <button onClick={() => { setSearch(''); fetchAds(); }} className="mt-4 text-orange-600 font-bold hover:underline">
              Tout voir
            </button>
          </div>
        )}
      </main>

      <footer className="max-w-6xl mx-auto px-4 py-12 border-t text-center text-gray-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Garala Search - Le moteur de recherche WhatsApp.</p>
      </footer>
    </div>
  );
}
