
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Plus, Package, TrendingUp, Users, ChevronLeft, Settings, Edit2, Minus, AlertCircle, ShoppingBag } from 'lucide-react';
import { useUI } from '../UIContext';
import { Ad } from '../types';

export const ShopDashboardPage: React.FC = () => {
  const { user, userAds, shops, updateAd, showToast } = useUI();
  const navigate = useNavigate();

  if (!user || !user.shopId) {
    navigate('/creer-boutique');
    return null;
  }

  const myShop = shops.find(s => s.id === user.shopId);
  if (!myShop) return null;

  // Mock Stats
  const stats = [
      { label: 'Vues totales', value: '1.2k', icon: <Users size={18} />, color: 'bg-blue-100 text-blue-600' },
      { label: 'Ventes', value: '45', icon: <TrendingUp size={18} />, color: 'bg-green-100 text-green-600' },
      { label: 'Articles', value: userAds.length, icon: <Package size={18} />, color: 'bg-orange-100 text-orange-600' },
  ];

  const handleStockChange = (e: React.MouseEvent, ad: Ad, delta: number) => {
    e.preventDefault();
    e.stopPropagation();
    const currentStock = ad.stock || 0;
    const newStock = Math.max(0, currentStock + delta);
    
    if (newStock !== currentStock) {
        updateAd({ ...ad, stock: newStock });
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f6f7] py-6 pb-24">
      <div className="max-w-2xl mx-auto px-4">
        
        {/* Shop Header */}
        <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-3">
                <button 
                    onClick={() => navigate('/menu')} 
                    className="p-2 -ml-2 bg-white rounded-full shadow-sm text-gray-900 hover:bg-gray-50 transition-colors"
                >
                    <ChevronLeft size={24} />
                </button>
                <div>
                     <h1 className="text-2xl font-black text-gray-900">{myShop.name}</h1>
                     <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tableau de bord</p>
                </div>
            </div>
            <button className="p-2 bg-white rounded-full text-gray-500 shadow-sm border border-gray-100">
                <Settings size={20} />
            </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-8">
            {stats.map((stat, idx) => (
                <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                    <div className={`p-2 rounded-full mb-2 ${stat.color}`}>
                        {stat.icon}
                    </div>
                    <span className="text-xl font-black text-gray-900">{stat.value}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">{stat.label}</span>
                </div>
            ))}
        </div>

        {/* Action Button */}
        <button 
            onClick={() => navigate('/poster')}
            className="w-full bg-black text-white py-4 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 mb-8 hover:bg-gray-900 transition-colors active:scale-95 transform duration-100"
        >
            <Plus size={24} />
            Ajouter un produit
        </button>

        {/* Inventory List */}
        <div>
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Package size={20} className="text-garala-500" />
                Gestion rapide de stock
            </h3>
            
            {userAds.length > 0 ? (
                <div className="space-y-3">
                    {userAds.map(ad => {
                        const isOutOfStock = (ad.stock || 0) <= 0;
                        return (
                            <div key={ad.id} className={`bg-white p-3 rounded-2xl shadow-sm border flex items-center gap-3 transition-colors ${isOutOfStock ? 'border-red-200 bg-red-50/30' : 'border-gray-100'}`}>
                                <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 relative">
                                    <img src={ad.images[0]} alt={ad.title} className={`w-full h-full object-cover ${isOutOfStock ? 'grayscale opacity-60' : ''}`} />
                                    {isOutOfStock && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                            <AlertCircle size={20} className="text-white" />
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex-grow min-w-0">
                                    <h4 className={`font-bold text-sm truncate ${isOutOfStock ? 'text-gray-500' : 'text-gray-900'}`}>{ad.title}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs font-bold text-gray-500">
                                            {ad.price.toLocaleString('fr-FR')} F
                                        </span>
                                        {ad.priceUnit && (
                                            <span className="text-[10px] text-gray-400">{ad.priceUnit}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Quick Stock Stepper */}
                                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-1 border border-gray-100">
                                    <button 
                                        onClick={(e) => handleStockChange(e, ad, -1)}
                                        disabled={(ad.stock || 0) <= 0}
                                        className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-gray-600 shadow-sm disabled:opacity-30 active:scale-90 transition-transform"
                                    >
                                        <Minus size={14} strokeWidth={3} />
                                    </button>
                                    <span className={`text-sm font-black min-w-[1.5rem] text-center ${(ad.stock || 0) < 5 ? 'text-red-500' : 'text-gray-900'}`}>
                                        {ad.stock || 0}
                                    </span>
                                    <button 
                                        onClick={(e) => handleStockChange(e, ad, 1)}
                                        className="w-8 h-8 flex items-center justify-center bg-black text-white rounded-lg shadow-sm active:scale-90 transition-transform"
                                    >
                                        <Plus size={14} strokeWidth={3} />
                                    </button>
                                </div>

                                <button 
                                    onClick={() => navigate(`/modifier/${ad.id}`)}
                                    className="p-2.5 bg-gray-50 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors ml-1"
                                >
                                    <Edit2 size={16} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-white rounded-3xl p-8 text-center border border-gray-100 border-dashed flex flex-col items-center justify-center py-12">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                        <ShoppingBag size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Votre boutique est vide</h3>
                    <p className="text-gray-400 text-sm font-medium mb-6">Ajoutez vos premiers produits.</p>
                    <button 
                        onClick={() => navigate('/poster')}
                        className="bg-garala-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-garala-200"
                    >
                        Créer un article
                    </button>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};
