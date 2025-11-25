
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Heart, Share2, Flag, MessageCircle, Phone, ArrowLeft, MoreVertical, Store, Package, Palette, Ruler, AlertCircle, Check } from 'lucide-react';
import { Ad } from '../types';
import { useUI } from '../UIContext';

interface AdDetailsPageProps {
  ads: Ad[];
}

export const AdDetailsPage: React.FC<AdDetailsPageProps> = ({ ads }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const ad = ads.find(a => a.id === id);
  const { showToast, toggleFavorite, isFavorite, user, updateAd, offlineMode } = useUI();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!ad) return null;

  const isFav = isFavorite(ad.id);
  const isShopItem = !!ad.shopId;
  const isOwner = user && (user.id === ad.ownerId || user.name === ad.sellerName);
  const isSold = ad.status === 'sold';

  const handleWhatsApp = () => {
      const cleanNumber = ad.phoneNumber.replace(/\s/g, '').replace(/^0/, '225');
      window.open(`https://wa.me/${cleanNumber}?text=J'ai vu votre article "${ad.title}" sur Garala.`, '_blank');
  };

  const handleCall = () => {
      window.location.href = `tel:${ad.phoneNumber}`;
  };

  const handleMarkAsSold = () => {
      if (offlineMode) {
          showToast("Connexion requise pour modifier le statut. Veuillez désactiver le mode hors ligne.", "error");
          return;
      }
      if (isSold) {
          updateAd({ ...ad, status: 'active' });
          showToast("Annonce remise en vente", "success");
      } else {
          updateAd({ ...ad, status: 'sold' });
          showToast("Félicitations ! Annonce marquée comme vendue", "success");
      }
  };

  const handleChat = () => {
      navigate('/messages');
      showToast(`Conversation ouverte avec ${ad.sellerName}`, 'info');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black pb-48 md:pb-0 transition-colors">
      
      {/* Navbar Transparente/Flottante Mobile */}
      <div className="fixed top-0 left-0 right-0 p-4 z-50 flex justify-between items-center md:hidden pointer-events-none">
          <button onClick={() => navigate(-1)} className="p-2.5 bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-full shadow-sm text-gray-900 dark:text-white pointer-events-auto active:scale-90 transition-transform">
              <ArrowLeft size={20} />
          </button>
          <div className="flex gap-3 pointer-events-auto">
             <button onClick={() => toggleFavorite(ad.id)} className={`p-2.5 bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-full shadow-sm transition-transform active:scale-90 ${isFav ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
                <Heart size={20} className={isFav ? 'fill-current' : ''} />
             </button>
             <button className="p-2.5 bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-full shadow-sm text-gray-900 dark:text-white active:scale-90 transition-transform">
                <MoreVertical size={20} />
             </button>
          </div>
      </div>

      <div className="max-w-6xl mx-auto md:py-8 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Images Section */}
        <div className="relative bg-gray-100 dark:bg-gray-800 aspect-[4/4] md:rounded-3xl overflow-hidden shadow-sm">
            <img 
              src={ad.images[activeImageIndex]} 
              alt={ad.title} 
              className={`w-full h-full object-cover transition-all ${isSold ? 'grayscale opacity-50' : ''}`}
            />
            
            {/* Sold Banner Large */}
            {isSold && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm z-10">
                    <div className="bg-red-600 text-white px-12 py-4 transform -rotate-6 font-black text-4xl uppercase tracking-widest shadow-2xl border-4 border-white">
                        VENDU
                    </div>
                </div>
            )}

            {/* Dots Indicator */}
            {ad.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 px-3 py-1.5 bg-black/30 backdrop-blur-sm rounded-full z-20">
                    {ad.images.map((_, idx) => (
                        <div key={idx} className={`w-1.5 h-1.5 rounded-full transition-all ${idx === activeImageIndex ? 'bg-white scale-125' : 'bg-white/50'}`} />
                    ))}
                </div>
            )}
             {/* Desktop Back Button */}
             <button onClick={() => navigate(-1)} className="hidden md:flex absolute top-4 left-4 p-2 bg-white dark:bg-gray-800 dark:text-white rounded-full shadow-md hover:scale-105 transition-transform z-20">
                 <ArrowLeft size={20} />
             </button>
        </div>

        {/* Content Section */}
        <div className="px-5 pt-2 pb-6 md:p-0">
             
             {/* Owner Controls */}
             {isOwner && (
                 <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl p-4 mb-6 flex items-center justify-between">
                     <div>
                         <h3 className="font-bold text-blue-900 dark:text-blue-100">Ceci est votre annonce</h3>
                         <p className="text-xs text-blue-600 dark:text-blue-300">Gérez la disponibilité.</p>
                     </div>
                     <button 
                        onClick={handleMarkAsSold}
                        className={`px-4 py-2 rounded-xl font-bold text-sm shadow-sm transition-colors ${isSold ? 'bg-white text-gray-900' : 'bg-red-500 text-white'}`}
                     >
                        {isSold ? 'Remettre en vente' : 'Marquer Vendu'}
                     </button>
                 </div>
             )}

             {/* Header Info */}
             <div className="flex justify-between items-start mb-4">
                 <div>
                     {isShopItem && (
                         <span className="bg-black dark:bg-white text-white dark:text-black text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider mb-2 inline-block">
                             Boutique Officielle
                         </span>
                     )}
                     <h1 className="text-2xl font-black text-gray-900 dark:text-white leading-tight mb-1">{ad.title}</h1>
                     <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm font-medium">
                         <span className="flex items-center gap-1"><MapPin size={14} /> {ad.location}</span>
                         <span>•</span>
                         <span>{ad.date}</span>
                     </div>
                 </div>
                 <div className="text-right">
                     <div className="text-2xl font-black text-garala-500 flex flex-col items-end">
                        <span>{ad.price.toLocaleString('fr-FR')}</span>
                     </div>
                     <div className="flex items-center justify-end gap-1">
                        <span className="text-xs font-bold text-gray-400 dark:text-gray-500">FCFA</span>
                        {ad.priceUnit && <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{ad.priceUnit}</span>}
                     </div>
                 </div>
             </div>
             
             {/* Shop Specific UI: Stock & Colors & Sizes */}
             {isShopItem && (
                 <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 mb-6 space-y-4 border border-gray-100 dark:border-gray-800">
                     {/* Availability */}
                     <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-bold text-sm">
                            <Package size={18} />
                            Disponibilité
                         </div>
                         {ad.stock && ad.stock > 0 ? (
                             <span className="text-green-600 dark:text-green-400 font-bold text-sm bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-md">
                                 En Stock ({ad.stock})
                             </span>
                         ) : (
                              <span className="text-red-500 dark:text-red-400 font-bold text-sm bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-md">
                                 Rupture de stock
                             </span>
                         )}
                     </div>
                     
                     {/* Colors */}
                     {ad.colors && ad.colors.length > 0 && (
                         <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-800 pt-4">
                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-bold text-sm">
                                <Palette size={18} />
                                Couleurs
                            </div>
                            <div className="flex gap-2">
                                {ad.colors.map((color, idx) => (
                                    <div 
                                        key={idx} 
                                        className="w-6 h-6 rounded-full shadow-sm border border-gray-300 dark:border-gray-600 ring-2 ring-transparent hover:ring-gray-300 cursor-pointer"
                                        style={{ backgroundColor: color }}
                                        title={color}
                                    />
                                ))}
                            </div>
                         </div>
                     )}

                     {/* Sizes */}
                     {ad.sizes && ad.sizes.length > 0 && (
                         <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-800 pt-4">
                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-bold text-sm">
                                <Ruler size={18} />
                                Tailles
                            </div>
                            <div className="flex gap-2 flex-wrap justify-end max-w-[60%]">
                                {ad.sizes.map((size, idx) => (
                                    <div key={idx} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-1 rounded-lg text-xs font-bold text-gray-700 dark:text-gray-300 shadow-sm">
                                        {size}
                                    </div>
                                ))}
                            </div>
                         </div>
                     )}
                 </div>
             )}

             <div className="h-px bg-gray-100 dark:bg-gray-800 my-4" />

             {/* Seller Info */}
             <div className="flex items-center gap-4 mb-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-3 rounded-2xl shadow-sm">
                 <div className="w-12 h-12 bg-garala-100 dark:bg-garala-900/30 text-garala-600 dark:text-garala-400 rounded-full flex items-center justify-center font-bold text-lg">
                     {isShopItem ? <Store size={24}/> : ad.sellerName.charAt(0)}
                 </div>
                 <div className="flex-grow">
                     <p className="font-bold text-gray-900 dark:text-white">{ad.sellerName}</p>
                     <p className="text-xs text-gray-500 dark:text-gray-400">{isShopItem ? 'Vendeur Pro Vérifié' : 'Membre depuis 2024'}</p>
                 </div>
                 <button className="text-sm font-bold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                     {isShopItem ? 'Visiter' : 'Profil'}
                 </button>
             </div>

             {/* Description */}
             <div className="mb-8">
                 <h3 className="font-bold text-gray-900 dark:text-white mb-2">Description</h3>
                 <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line text-sm md:text-base">
                     {ad.description}
                 </p>
             </div>

             {/* Action Buttons (Desktop) */}
             {!isOwner && !isSold && (
                 <div className="hidden md:flex gap-4">
                     <button onClick={handleChat} className="flex-1 bg-black dark:bg-white text-white dark:text-black py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-lg shadow-gray-200 dark:shadow-none">
                         <MessageCircle size={20} /> Écrire
                     </button>
                     <button onClick={handleWhatsApp} className="flex-1 bg-[#25D366] text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition-colors shadow-lg shadow-green-100 dark:shadow-none">
                         <MessageCircle size={20} /> WhatsApp
                     </button>
                     <button onClick={handleCall} className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                         <Phone size={20} /> Appeler
                     </button>
                 </div>
             )}
        </div>
      </div>

      {/* Sticky Mobile Bottom Bar - Positioned HIGHER to avoid BottomNav overlap */}
      <div className="md:hidden fixed bottom-[88px] left-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border border-gray-200 dark:border-gray-800 p-3 rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-none z-40">
          {isOwner ? (
               <button 
                    onClick={handleMarkAsSold}
                    className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg ${isSold ? 'bg-white text-gray-900 border border-gray-200' : 'bg-red-500 text-white shadow-red-200'}`}
                >
                    {isSold ? <Check size={20}/> : <AlertCircle size={20}/>}
                    {isSold ? 'Remettre en vente' : 'Marquer comme Vendu'}
                </button>
          ) : !isSold ? (
              <div className="flex gap-3">
                <button 
                    onClick={handleCall}
                    className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white py-3 rounded-xl font-bold flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-transform text-xs"
                >
                    <Phone size={20} />
                    Appeler
                </button>
                <button 
                    onClick={handleChat}
                    className="flex-[1.5] bg-black dark:bg-white text-white dark:text-black py-3 rounded-xl font-bold flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-transform text-xs"
                >
                    <MessageCircle size={20} />
                    Message
                </button>
                <button 
                    onClick={handleWhatsApp}
                    className="flex-[1.5] bg-[#25D366] text-white py-3 rounded-xl font-bold flex flex-col items-center justify-center gap-0.5 shadow-lg shadow-green-100 dark:shadow-none active:scale-95 transition-transform text-xs"
                >
                    <MessageCircle size={20} />
                    WhatsApp
                </button>
              </div>
          ) : (
              <div className="w-full py-3.5 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 rounded-xl font-bold flex items-center justify-center gap-2 cursor-not-allowed">
                  Cet article est vendu
              </div>
          )}
      </div>

    </div>
  );
};
