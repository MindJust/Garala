
import React from 'react';
import { Heart, ChevronLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AdCard } from '../components/AdCard';
import { Ad } from '../types';
import { useUI } from '../UIContext';

interface FavoritesPageProps {
  ads: Ad[];
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({ ads }) => {
  const { favorites } = useUI();
  const navigate = useNavigate();

  // Filter ads that are in the favorites list
  const favoriteAds = ads.filter(ad => favorites.includes(ad.id));

  return (
    <div className="min-h-screen bg-[#f5f6f7] py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6">
          <button 
                onClick={() => navigate(-1)} 
                className="p-2 -ml-2 bg-white rounded-full shadow-sm text-gray-900 hover:bg-gray-50 transition-colors md:hidden"
            >
                <ChevronLeft size={24} />
          </button>
          <div className="p-2 bg-red-100 rounded-full text-red-500">
             <Heart size={24} className="fill-current" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">Mes Favoris ({favoriteAds.length})</h1>
        </div>

        {favoriteAds.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteAds.map(ad => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
             <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300">
                <Heart size={48} />
             </div>
             <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun favori pour le moment</h3>
             <p className="text-gray-500 text-center max-w-xs mb-8">
               Sauvegardez des annonces pour les retrouver plus tard.
             </p>
             <Link 
                to="/"
                className="bg-garala-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform"
             >
                Découvrir des annonces
             </Link>
          </div>
        )}
      </div>
    </div>
  );
};
