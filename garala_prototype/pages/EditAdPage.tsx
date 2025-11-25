
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ChevronLeft, Loader2, X, Store, Package } from 'lucide-react';
import { Ad, Category } from '../types';
import { useUI } from '../UIContext';
import { BANGUI_LOCATIONS } from '../constants';

const PRESET_COLORS = ['#000000', '#FFFFFF', '#FF0000', '#0000FF', '#00FF00', '#FFFF00', '#808080', '#A52A2A', '#F5F5DC', '#FFC0CB'];
const CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
const SHOE_SIZES = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'];

interface EditAdPageProps {
  ads: Ad[];
}

export const EditAdPage: React.FC<EditAdPageProps> = ({ ads }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, updateAd, showToast, offlineMode } = useUI();
  const [loading, setLoading] = useState(false);

  const existingAd = ads.find(a => a.id === id);

  const [formData, setFormData] = useState<{
    title: string;
    price: string;
    description: string;
    location: string;
    // Shop fields
    stock: string;
    selectedColors: string[];
    selectedSizes: string[];
    priceUnit: string;
  }>({
    title: '',
    price: '',
    description: '',
    location: '',
    stock: '',
    selectedColors: [],
    selectedSizes: [],
    priceUnit: ''
  });

  useEffect(() => {
    if (!existingAd) {
        showToast("Annonce introuvable", "error");
        navigate('/mes-annonces');
        return;
    }
    if (!user || existingAd.ownerId !== user.id) {
        showToast("Accès refusé", "error");
        navigate('/');
        return;
    }

    setFormData({
        title: existingAd.title,
        price: existingAd.price.toString(),
        description: existingAd.description,
        location: existingAd.location,
        stock: existingAd.stock?.toString() || '',
        selectedColors: existingAd.colors || [],
        selectedSizes: existingAd.sizes || [],
        priceUnit: existingAd.priceUnit || ''
    });
  }, [existingAd, user, navigate, showToast]);

  const toggleColor = (color: string) => {
    setFormData(prev => {
        const colors = prev.selectedColors.includes(color) 
            ? prev.selectedColors.filter(c => c !== color)
            : [...prev.selectedColors, color];
        return { ...prev, selectedColors: colors };
    });
  };

  const toggleSize = (size: string) => {
    setFormData(prev => {
        const sizes = prev.selectedSizes.includes(size) 
            ? prev.selectedSizes.filter(s => s !== size)
            : [...prev.selectedSizes, size];
        return { ...prev, selectedSizes: sizes };
    });
  };

  const handleSubmit = async () => {
    if (offlineMode) {
        showToast("Connexion requise pour modifier une annonce. Veuillez désactiver le mode hors ligne.", "error");
        return;
    }

    if (!existingAd) return;

    setLoading(true);
    // Simulate delay
    await new Promise(r => setTimeout(r, 800));

    updateAd({
        ...existingAd,
        title: formData.title,
        price: Number(formData.price),
        description: formData.description,
        location: formData.location,
        stock: user?.shopId ? Number(formData.stock) : undefined,
        colors: user?.shopId ? formData.selectedColors : undefined,
        sizes: user?.shopId ? formData.selectedSizes : undefined,
        priceUnit: user?.shopId ? formData.priceUnit : undefined,
    });

    setLoading(false);
    navigate(user?.shopId ? '/ma-boutique' : '/mes-annonces');
  };

  if (!existingAd) return null;

  return (
    <div className="min-h-screen bg-[#f5f6f7] py-6">
      <div className="max-w-xl mx-auto px-4">
        
        <div className="flex items-center gap-4 mb-6">
            <button onClick={() => navigate(user?.shopId ? '/ma-boutique' : '/mes-annonces')} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50">
                <ChevronLeft size={24} />
            </button>
            <h1 className="text-2xl font-black text-gray-900">Modifier l'annonce</h1>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6">
            
            <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Titre</label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full p-4 bg-gray-50 rounded-xl border-none font-bold text-gray-900 focus:ring-2 focus:ring-garala-500"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Prix (FCFA)</label>
                    <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="w-full p-4 bg-gray-50 rounded-xl border-none font-bold text-gray-900 focus:ring-2 focus:ring-garala-500"
                    />
                </div>
                {user?.shopId && (
                     <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Unité</label>
                        <select
                            value={formData.priceUnit}
                            onChange={(e) => setFormData({...formData, priceUnit: e.target.value})}
                            className="w-full p-4 bg-gray-50 rounded-xl border-none font-bold text-sm text-gray-900 appearance-none h-[56px]"
                        >
                            <option value="">(Aucune)</option>
                            <option value="/ pièce">/ pièce</option>
                            <option value="/ kg">/ kg</option>
                            <option value="/ mètre">/ mètre</option>
                            <option value="/ ensemble">/ ensemble</option>
                        </select>
                     </div>
                 )}
            </div>

            {/* Shop Fields */}
            {user?.shopId && (
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-4">
                    <div className="flex items-center gap-2 text-garala-600 font-bold uppercase text-xs tracking-wider">
                        <Store size={14} />
                        Détails Boutique
                    </div>

                     <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2">Stock disponible</label>
                        <div className="relative">
                            <Package size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
                            <input
                                type="number"
                                value={formData.stock}
                                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                                placeholder="0"
                                className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border-none font-bold text-gray-900 focus:ring-2 focus:ring-garala-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2">Tailles / Pointures</label>
                        <div className="space-y-3">
                            <div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Vêtements</span>
                                <div className="flex flex-wrap gap-2">
                                    {CLOTHING_SIZES.map(size => (
                                        <button
                                            key={size}
                                            onClick={() => toggleSize(size)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                                                formData.selectedSizes.includes(size)
                                                ? 'bg-black text-white border-black'
                                                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                             <div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Chaussures</span>
                                <div className="flex flex-wrap gap-2">
                                    {SHOE_SIZES.map(size => (
                                        <button
                                            key={size}
                                            onClick={() => toggleSize(size)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                                                formData.selectedSizes.includes(size)
                                                ? 'bg-black text-white border-black'
                                                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2">Couleurs</label>
                        <div className="flex flex-wrap gap-3">
                            {PRESET_COLORS.map(color => (
                                <button
                                    key={color}
                                    onClick={() => toggleColor(color)}
                                    className={`w-8 h-8 rounded-full border-2 transition-all shadow-sm ${
                                        formData.selectedColors.includes(color) 
                                        ? 'ring-2 ring-offset-2 ring-garala-500 border-transparent scale-110' 
                                        : 'border-gray-200 hover:scale-105'
                                    }`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Description</label>
                <textarea
                    rows={6}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full p-4 bg-gray-50 rounded-xl border-none font-medium text-gray-800 focus:ring-2 focus:ring-garala-500 resize-none"
                />
            </div>

             <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Lieu</label>
                <select
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full p-4 bg-gray-50 rounded-xl border-none font-bold text-gray-900 focus:ring-2 focus:ring-garala-500 appearance-none"
                >
                    {BANGUI_LOCATIONS.map(loc => (
                        <option key={loc.name} value={loc.name}>{loc.name}</option>
                    ))}
                </select>
            </div>

            <div className="pt-4">
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-garala-500 hover:bg-garala-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-garala-200 transition-all active:scale-95"
                >
                    {loading ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} />}
                    Enregistrer les modifications
                </button>
            </div>

        </div>
      </div>
    </div>
  );
};
