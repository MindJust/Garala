

import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, MessageCircle } from 'lucide-react';
import { Ad } from '../types';
import { useUI } from '../UIContext';

interface AdCardProps {
  ad: Ad;
}

export const AdCard: React.FC<AdCardProps> = ({ ad }) => {
  const { showToast, toggleFavorite, isFavorite } = useUI();
  const isFav = isFavorite(ad.id);
  const isSold = ad.status === 'sold';

  const handleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(ad.id);
    if (!isFav) vibrate();
  };
  
  const handleMessage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    showToast(`Écrire au vendeur: ${ad.sellerName}`, 'info');
  };

  const vibrate = () => {
    if (navigator.vibrate) navigator.vibrate(10);
  };

  return (
    <Link to={`/ad/${ad.id}`} className="group block bg-white dark:bg-gray-900 rounded-[24px] overflow-hidden shadow-[0_2px_15px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_15px_rgba(0,0,0,0.2)] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative mb-4 md:mb-0 border border-transparent dark:border-gray-800">
      
      {/* Image Container */}
      <div className="relative aspect-[4/3] md:aspect-[4/3] bg-gray-100 dark:bg-gray-800 overflow-hidden">
        <img
          src={ad.images[0]}
          alt={ad.title}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${isSold ? 'grayscale opacity-70' : ''}`}
          loading="lazy"
        />
        
        {/* Sold Overlay */}
        {isSold && (
           <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
               <div className="bg-red-600 text-white px-6 py-2 transform -rotate-12 font-black text-xl uppercase tracking-widest shadow-lg border-4 border-white">
                   VENDU
               </div>
           </div>
        )}
        
        {/* Price Tag - Floating on Image */}
        <div className="absolute top-3 left-3">
             <div className="bg-white/95 dark:bg-black/80 backdrop-blur-md text-gray-900 dark:text-white font-black text-sm px-3 py-1.5 rounded-full shadow-sm flex items-baseline gap-1">
                {ad.price.toLocaleString('fr-FR')} <span className="text-[10px] text-gray-500 dark:text-gray-400 font-bold">FCFA</span>
             </div>
        </div>

        <div className="absolute top-3 right-3 flex flex-col gap-2">
            {/* Favorite Button */}
            <button 
                className={`p-2 rounded-full transition-all active:scale-90 shadow-sm ${isFav ? 'bg-red-50 dark:bg-red-900/50 text-red-500' : 'bg-black/20 backdrop-blur-md text-white hover:bg-black/30'}`}
                onClick={handleFav}
            >
            <Heart size={18} className={isFav ? 'fill-current' : ''} strokeWidth={2.5} />
            </button>
            
            {/* Message Button (New) */}
            {!isSold && (
                <button 
                    className="p-2 rounded-full transition-all active:scale-90 shadow-sm bg-black/20 backdrop-blur-md text-white hover:bg-black/30"
                    onClick={handleMessage}
                >
                    <MessageCircle size={18} strokeWidth={2.5} />
                </button>
            )}
        </div>

        {/* Pro Badge */}
        {ad.isPro && (
           <span className="absolute bottom-3 left-3 bg-black dark:bg-white text-white dark:text-black text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
             PRO
           </span>
        )}
      </div>

      {/* Content - Minimalist */}
      <div className="p-4">
        <div className="flex justify-between items-start gap-2 mb-1">
            <h3 className="text-gray-900 dark:text-white font-bold leading-snug line-clamp-2 flex-grow text-[15px]">
              {ad.title}
            </h3>
        </div>

        <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-1 text-gray-400 dark:text-gray-500">
                <MapPin size={14} />
                <span className="text-xs font-medium truncate max-w-[100px]">
                    {ad.location}
                </span>
            </div>
            <span className="text-[10px] font-bold text-gray-300 dark:text-gray-600 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-full">
                {ad.date}
            </span>
        </div>
      </div>
    </Link>
  );
};