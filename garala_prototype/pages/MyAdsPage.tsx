
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Edit2, Trash2, Plus, AlertCircle, Eye, ChevronLeft, X, Check, Rocket, Tag } from 'lucide-react';
import { useUI } from '../UIContext';

export const MyAdsPage: React.FC = () => {
  const { user, userAds, deleteAd, updateAd, showToast, offlineMode } = useUI();
  const navigate = useNavigate();
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const toggleSold = (ad: any) => {
      if (offlineMode) {
          showToast("Connexion requise pour modifier le statut. Veuillez désactiver le mode hors ligne.", "error");
          return;
      }
      const newStatus = ad.status === 'sold' ? 'active' : 'sold';
      updateAd({ ...ad, status: newStatus });
      showToast(newStatus === 'sold' ? "Marqué comme Vendu" : "Remis en vente", "success");
  };

  const handleDeleteClick = (id: string) => {
      if (offlineMode) {
          showToast("Connexion requise pour supprimer une annonce. Veuillez désactiver le mode hors ligne.", "error");
          return;
      }
      deleteAd(id);
  };

  if (!user) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
             <button 
                onClick={() => navigate(-1)} 
                className="absolute top-6 left-6 p-2 bg-gray-100 rounded-full text-gray-900"
            >
                <ChevronLeft size={24} />
            </button>
            <h1 className="text-2xl font-black text-gray-900 mb-2">Connectez-vous</h1>
            <p className="text-gray-500 mb-6">Vous devez être connecté pour voir vos annonces.</p>
            <Link to="/menu" className="bg-garala-500 text-white px-6 py-3 rounded-xl font-bold">Aller au menu</Link>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f6f7] py-6 pb-24">
      <div className="max-w-2xl mx-auto px-4">
        
        <div className="flex items-center gap-4 mb-6">
            <button 
                onClick={() => navigate(-1)} 
                className="p-2 -ml-2 bg-white rounded-full shadow-sm text-gray-900 hover:bg-gray-50 transition-colors"
            >
                <ChevronLeft size={24} />
            </button>
            <div>
                <h1 className="text-2xl font-black text-gray-900">Mes Annonces</h1>
                <span className="bg-gray-200 text-gray-700 text-xs font-bold px-2 py-1 rounded-full">{userAds.length} résultat(s)</span>
            </div>
        </div>

        {userAds.length > 0 ? (
            <div className="space-y-4">
                {userAds.map(ad => {
                    const isSold = ad.status === 'sold';
                    return (
                        <div key={ad.id} className={`bg-white rounded-2xl p-4 shadow-sm border flex gap-4 animate-in fade-in slide-in-from-bottom-2 ${isSold ? 'border-gray-200 opacity-80' : 'border-gray-100'}`}>
                            <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden relative">
                                <img src={ad.images[0]} alt={ad.title} className={`w-full h-full object-cover ${isSold ? 'grayscale' : ''}`} />
                                {ad.isBoosted && !isSold && (
                                    <div className="absolute top-1 left-1 bg-garala-500 text-white p-1 rounded-full shadow-sm">
                                        <Rocket size={10} strokeWidth={3} />
                                    </div>
                                )}
                                {isSold && (
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                        <span className="text-[10px] font-black text-white bg-red-600 px-2 py-0.5 -rotate-12">VENDU</span>
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex-grow flex flex-col justify-between">
                                <div>
                                    <h3 className="font-bold text-gray-900 line-clamp-1">{ad.title}</h3>
                                    <p className="text-garala-500 font-bold">{ad.price.toLocaleString('fr-FR')} FCFA</p>
                                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                        <Eye size={12}/> {Math.floor(Math.random() * 50)} vues • {ad.date}
                                    </p>
                                </div>

                                <div className="flex gap-2 mt-2 justify-end items-center">
                                    {confirmDeleteId === ad.id ? (
                                        <div className="flex items-center gap-2 bg-red-50 p-2 rounded-xl animate-in fade-in slide-in-from-right-4 border border-red-100">
                                            <span className="text-xs font-bold text-red-600 px-1">Supprimer ?</span>
                                            <button 
                                                onClick={() => handleDeleteClick(ad.id)}
                                                className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-sm"
                                            >
                                                <Check size={16} />
                                            </button>
                                            <button 
                                                onClick={() => setConfirmDeleteId(null)}
                                                className="p-1.5 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => toggleSold(ad)}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${isSold ? 'bg-gray-200 text-gray-600' : 'bg-green-50 text-green-600 border border-green-100'}`}
                                                title={isSold ? "Remettre en vente" : "Marquer Vendu"}
                                            >
                                                <Tag size={14} />
                                                {isSold ? 'Vendu' : 'Dispo'}
                                            </button>
                                            
                                            {!isSold && (
                                                <button
                                                    onClick={() => navigate(`/paiements?action=boost&adId=${ad.id}`)}
                                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${ad.isBoosted ? 'bg-garala-50 text-garala-600 border border-garala-100' : 'bg-black text-white hover:bg-gray-800'}`}
                                                >
                                                    <Rocket size={14} />
                                                </button>
                                            )}

                                            <Link 
                                                to={`/modifier/${ad.id}`}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors"
                                            >
                                                <Edit2 size={14} />
                                            </Link>
                                            <button 
                                                onClick={() => setConfirmDeleteId(ad.id)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        ) : (
            <div className="text-center py-12 bg-white rounded-3xl shadow-sm border border-gray-100">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <AlertCircle size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Aucune annonce</h3>
                <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">Vous n'avez pas encore publié d'annonce. Commencez à vendre dès maintenant !</p>
                <Link 
                    to="/poster"
                    className="inline-flex items-center gap-2 bg-garala-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-garala-200"
                >
                    <Plus size={20} />
                    Déposer une annonce
                </Link>
            </div>
        )}
      </div>
    </div>
  );
};
