
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, ChevronLeft, ShieldAlert, Lock, Upload, Check, Loader2, LayoutGrid, CarFront, Home, Shirt, Smartphone, Armchair, Bike, Briefcase, Sparkles, CreditCard } from 'lucide-react';
import { useUI } from '../UIContext';
import { Category } from '../types';

const CategoryIconMap: Record<Category, React.ReactNode> = {
  [Category.ALL]: <LayoutGrid size={24} />,
  [Category.VEHICLE]: <CarFront size={24} />,
  [Category.REAL_ESTATE]: <Home size={24} />,
  [Category.FASHION]: <Shirt size={24} />,
  [Category.ELECTRONICS]: <Smartphone size={24} />,
  [Category.HOME]: <Armchair size={24} />,
  [Category.HOBBIES]: <Bike size={24} />,
  [Category.SERVICES]: <Briefcase size={24} />
};

export const CreateShopPage: React.FC = () => {
  const { user, createShop, showToast, isTrialPeriod, offlineMode } = useUI();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
      name: '',
      description: '',
      category: Category.FASHION,
      image: ''
  });

  // Access Check
  if (!user) {
      navigate('/login');
      return null;
  }

  // Verification Wall
  if (!user.isVerified) {
      return (
        <div className="min-h-screen bg-[#f5f6f7] flex flex-col">
            <div className="p-4">
                 <button 
                    onClick={() => navigate('/menu')} 
                    className="p-2 bg-white rounded-full shadow-sm text-gray-900 hover:bg-gray-50 transition-colors"
                >
                    <ChevronLeft size={24} />
                </button>
            </div>
            
            <div className="flex-grow flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6 relative">
                    <Store size={48} className="text-gray-400" />
                    <div className="absolute -bottom-2 -right-2 bg-red-500 p-2 rounded-full border-4 border-[#f5f6f7]">
                        <Lock size={20} className="text-white" />
                    </div>
                </div>
                
                <h1 className="text-2xl font-black text-gray-900 mb-3">Réservé aux Pros</h1>
                <p className="text-gray-500 mb-8 leading-relaxed">
                    Pour créer votre boutique officielle sur Garala et accéder aux outils professionnels (gestion d'inventaire, stocks, stats), votre identité doit être vérifiée.
                </p>
                
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 w-full mb-8 text-left">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <ShieldAlert size={18} className="text-orange-500"/>
                        Status actuel
                    </h3>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Identité</span>
                        {user.verificationStatus === 'pending' ? (
                            <span className="text-orange-600 font-bold bg-orange-50 px-2 py-1 rounded-lg text-sm">En cours d'examen</span>
                        ) : (
                            <span className="text-red-500 font-bold bg-red-50 px-2 py-1 rounded-lg text-sm">Non vérifié</span>
                        )}
                    </div>
                </div>

                <button 
                    onClick={() => navigate('/login')} 
                    className="w-full bg-garala-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-garala-200 active:scale-95 transition-transform"
                >
                    Vérifier mon identité
                </button>
            </div>
        </div>
      );
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (offlineMode) {
          showToast("Impossible d'uploader un logo en mode hors ligne.", "error");
          return;
      }
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const url = URL.createObjectURL(file);
          setLogoPreview(url);
          setFormData({...formData, image: url});
      }
  };

  const handleSubmit = async () => {
      if (offlineMode) {
          showToast("Connexion requise pour créer une boutique. Veuillez désactiver le mode hors ligne.", "error");
          return;
      }
      if (!formData.name || !formData.description) {
          showToast("Veuillez remplir tous les champs", "error");
          return;
      }

      setLoading(true);
      await new Promise(r => setTimeout(r, 1500));
      
      createShop({
          name: formData.name,
          description: formData.description,
          category: formData.category,
          image: formData.image || 'https://picsum.photos/seed/shop/200/200'
      });
      
      setLoading(false);
      navigate('/ma-boutique'); // Redirect to dashboard instead of menu
  };

  return (
    <div className="min-h-screen bg-[#f5f6f7] py-6 pb-24">
      <div className="max-w-md mx-auto px-4">
        
        <div className="flex items-center gap-3 mb-6">
            <button 
                onClick={() => navigate(-1)} 
                className="p-2 -ml-2 bg-white rounded-full shadow-sm text-gray-900 hover:bg-gray-50 transition-colors"
            >
                <ChevronLeft size={24} />
            </button>
            <h1 className="text-2xl font-black text-gray-900">Créer ma boutique</h1>
        </div>

        {/* Free Trial Banner */}
        {isTrialPeriod && (
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-3xl text-white shadow-xl mb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
                <div className="flex items-start gap-3 relative z-10">
                    <div className="bg-white/20 p-2 rounded-xl">
                         <Sparkles size={24} className="text-yellow-300" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black mb-1">OFFRE DE LANCEMENT</h3>
                        <p className="text-purple-100 text-sm font-medium mb-3">
                            Profitez de <strong>3 mois offerts</strong> sur l'abonnement Garala Pro pour gérer votre boutique.
                        </p>
                        <span className="bg-white text-purple-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                            Gratuit aujourd'hui
                        </span>
                    </div>
                </div>
            </div>
        )}

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6">
            
            {/* Logo Upload */}
            <div className="flex flex-col items-center mb-4">
                <div className="relative group cursor-pointer">
                    <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                        {logoPreview ? (
                            <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                            <Store size={32} className="text-gray-300" />
                        )}
                    </div>
                    <label className="absolute bottom-0 right-0 bg-garala-500 p-2 rounded-full text-white shadow-md cursor-pointer hover:bg-garala-600 transition-colors">
                        <Upload size={16} />
                        <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                    </label>
                </div>
                <p className="text-xs text-gray-400 mt-2 font-medium">Logo de la boutique</p>
            </div>

            <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Nom de la boutique</label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ex: Super Mode Bangui"
                    className="w-full p-4 bg-gray-50 rounded-xl border-none font-bold text-gray-900 focus:ring-2 focus:ring-garala-500"
                />
            </div>

            <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Catégorie principale</label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto custom-scrollbar">
                    {/* Updated to show ALL categories */}
                    {Object.values(Category).filter(c => c !== Category.ALL).map(cat => (
                         <button
                            key={cat}
                            onClick={() => setFormData({...formData, category: cat})}
                            className={`p-3 rounded-xl text-xs font-bold border flex items-center gap-2 transition-all ${
                                formData.category === cat 
                                ? 'bg-garala-50 border-garala-200 text-garala-700' 
                                : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                            }`}
                        >
                            {CategoryIconMap[cat]}
                            <span className="truncate">{cat}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Description</label>
                <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Dites-nous ce que vous vendez..."
                    className="w-full p-4 bg-gray-50 rounded-xl border-none font-medium text-gray-800 focus:ring-2 focus:ring-garala-500 resize-none"
                />
            </div>

            {!isTrialPeriod && (
                <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-3 border border-gray-200">
                    <div className="p-2 bg-white rounded-full shadow-sm">
                        <CreditCard size={20} className="text-gray-900"/>
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 text-sm">Abonnement Pro Mensuel</p>
                        <p className="text-xs text-gray-500">15 000 FCFA / mois</p>
                    </div>
                </div>
            )}

            <div className="pt-2">
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-garala-500 hover:bg-garala-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-garala-200 transition-all active:scale-95 disabled:opacity-70"
                >
                    {loading ? <Loader2 size={24} className="animate-spin" /> : <Check size={24} />}
                    {isTrialPeriod ? 'Créer gratuitement' : 'Payer et Créer'}
                </button>
                {isTrialPeriod && (
                    <p className="text-center text-[10px] text-gray-400 mt-3 font-medium">
                        Sans engagement. Annulable à tout moment.
                    </p>
                )}
            </div>

        </div>
      </div>
    </div>
  );
};
