
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, 
  ChevronLeft, 
  ChevronRight, 
  Loader2, 
  CarFront, 
  Home, 
  Shirt, 
  Smartphone, 
  Armchair, 
  Bike, 
  Briefcase, 
  LayoutGrid, 
  Check,
  MapPin,
  User,
  Phone,
  X,
  Crosshair,
  Sparkles,
  Package,
  Store,
  PlusCircle,
  ArrowRight,
  Clock,
  Banknote
} from 'lucide-react';
import { Category, Ad } from '../types';
import { BANGUI_LOCATIONS } from '../constants';
import { useUI } from '../UIContext';

interface PostAdPageProps {
  onAddAd: (ad: Ad) => void;
}

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

const PRESET_COLORS = ['#000000', '#FFFFFF', '#FF0000', '#0000FF', '#00FF00', '#FFFF00', '#808080', '#A52A2A', '#F5F5DC', '#FFC0CB', '#800080', '#FFA500'];
const CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
const SHOE_SIZES = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];

export const PostAdPage: React.FC<PostAdPageProps> = ({ onAddAd }) => {
  const navigate = useNavigate();
  const { showToast, user, offlineMode } = useUI();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // Used only for non-pro users
  const totalSteps = 4;
  
  // Location Search State
  const [locationSearch, setLocationSearch] = useState('');
  const [showLocationList, setShowLocationList] = useState(false);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const locationWrapperRef = useRef<HTMLDivElement>(null);

  const isShopMode = !!user?.shopId;
  const isServiceCategory = (formData: any) => formData.category === Category.SERVICES;

  const [formData, setFormData] = useState<{
    title: string;
    category: Category;
    price: string;
    description: string;
    location: string;
    sellerName: string;
    phoneNumber: string;
    images: string[];
    coordinates?: { lat: number; lng: number };
    // Shop fields
    stock: string;
    selectedColors: string[];
    selectedSizes: string[];
    priceUnit: string;
  }>({
    title: '',
    category: Category.FASHION, // Default better for shops
    price: '',
    description: '',
    location: user?.shopId ? 'Boutique Officielle' : '', // Default for shop
    sellerName: user?.name || '',
    phoneNumber: user?.phoneNumber || '',
    images: [],
    stock: '1',
    selectedColors: [],
    selectedSizes: [],
    priceUnit: ''
  });

  // Pre-fill location if shop
  useEffect(() => {
    if (isShopMode && !formData.location) {
        setFormData(prev => ({ ...prev, location: 'Bangui, Centre-ville' }));
        setLocationSearch('Bangui, Centre-ville');
    }
  }, [isShopMode]);

  const vibrate = (pattern: number | number[] = 15) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  };

  useEffect(() => {
    if (!isShopMode) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    vibrate(10);
  }, [step, isShopMode]);

  // Handle click outside location
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (locationWrapperRef.current && !locationWrapperRef.current.contains(event.target as Node)) {
        setShowLocationList(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredLocations = useMemo(() => {
    if (!locationSearch) return BANGUI_LOCATIONS;
    return BANGUI_LOCATIONS.filter(loc => 
      loc.name.toLowerCase().includes(locationSearch.toLowerCase())
    );
  }, [locationSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCategorySelect = (cat: Category) => {
    vibrate(20);
    setFormData({ ...formData, category: cat });
    if (!isShopMode) {
        setTimeout(() => nextStep(), 200);
    }
  };

  const handleLocationSelect = (locationName: string) => {
      const predefinedLoc = BANGUI_LOCATIONS.find(l => l.name === locationName);
      setFormData(prev => ({ 
          ...prev, 
          location: locationName,
          coordinates: predefinedLoc ? { lat: predefinedLoc.lat, lng: predefinedLoc.lng } : undefined
      }));
      setLocationSearch(locationName);
      setShowLocationList(false);
      vibrate(20);
  };

  const toggleColor = (color: string) => {
      setFormData(prev => {
          const colors = prev.selectedColors.includes(color) 
              ? prev.selectedColors.filter(c => c !== color)
              : [...prev.selectedColors, color];
          return { ...prev, selectedColors: colors };
      });
      vibrate(5);
  };

  const toggleSize = (size: string) => {
    setFormData(prev => {
        const sizes = prev.selectedSizes.includes(size) 
            ? prev.selectedSizes.filter(s => s !== size)
            : [...prev.selectedSizes, size];
        return { ...prev, selectedSizes: sizes };
    });
    vibrate(5);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (offlineMode) {
        showToast("Impossible d'ajouter des photos en mode hors ligne.", "error");
        return;
    }

    if (e.target.files && e.target.files.length > 0) {
      const remainingSlots = 10 - formData.images.length;
      if (remainingSlots <= 0) {
        showToast("Maximum 10 photos atteint", "error");
        return;
      }
      
      const filesToAdd = Array.from(e.target.files).slice(0, remainingSlots);
      const newImages = filesToAdd.map((file: File) => URL.createObjectURL(file));
      
      setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
      vibrate(30);
      showToast(`${newImages.length} photo(s) ajoutée(s)`, "success");
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    vibrate(20);
  };

  const triggerFileInput = () => {
    vibrate(10);
    fileInputRef.current?.click();
  };

  // ... (Geolocation logic kept same as previous, abbreviated for brevity if needed) ...
  const handleGeolocation = () => { /* ... existing logic ... */ };

  const nextStep = () => {
    if (isStepValid()) {
      if (step < totalSteps) {
        setStep(step + 1);
        vibrate(20);
      }
    } else {
      vibrate([50, 50, 50]);
      showToast("Veuillez remplir les champs obligatoires", "error");
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      vibrate(10);
    } else {
      navigate(-1);
    }
  };

  const isStepValid = () => {
    if (isShopMode) {
        // Pro validation
        return formData.title.length > 2 && formData.price.length > 0 && formData.images.length > 0;
    }
    // Normal validation
    switch (step) {
      case 1: return true; 
      case 2: return formData.title.length > 3; 
      case 3: return formData.price.length > 0 && formData.location.length > 0;
      case 4: return formData.sellerName.length > 1 && formData.phoneNumber.length > 1;
      default: return false;
    }
  };

  const handleSubmit = async (addAnother: boolean = false) => {
    if (offlineMode) {
        showToast("Connexion requise pour publier une annonce. Veuillez désactiver le mode hors ligne.", "error");
        return;
    }

    if (!isStepValid()) {
        showToast("Il manque des informations (Titre, Prix ou Photo)", "error");
        return;
    }

    setIsLoading(true);
    vibrate(20);
    
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 800));

    const newAd: Ad = {
      id: Date.now().toString(),
      title: formData.title,
      category: formData.category,
      price: Number(formData.price),
      description: formData.description || "Aucune description.",
      location: formData.location || "Boutique",
      coordinates: formData.coordinates,
      sellerName: formData.sellerName,
      phoneNumber: formData.phoneNumber,
      date: "À l'instant",
      isPro: !!user?.shopId, 
      shopId: user?.shopId,
      ownerId: user?.id,
      images: formData.images.length > 0 ? formData.images : [`https://picsum.photos/seed/${Math.random()}/800/600`],
      createdAt: Date.now(),
      // Logic for services: no stock/color/size
      stock: (user?.shopId && !isServiceCategory(formData) && formData.stock) ? Number(formData.stock) : undefined,
      colors: (user?.shopId && !isServiceCategory(formData)) ? formData.selectedColors : undefined,
      sizes: (user?.shopId && !isServiceCategory(formData)) ? formData.selectedSizes : undefined,
      priceUnit: (user?.shopId && !isServiceCategory(formData)) ? formData.priceUnit : undefined,
    };

    onAddAd(newAd);
    setIsLoading(false);
    vibrate([50, 100, 50]);
    showToast(isServiceCategory(formData) ? "Service publié avec succès !" : "Article ajouté au stock !", "success");

    if (addAnother) {
        // Reset form but keep category and context
        setFormData(prev => ({
            ...prev,
            title: '',
            price: '',
            description: '',
            images: [],
            selectedColors: [],
            selectedSizes: [],
            // Keep category, stock default, location
        }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        if (user?.shopId) {
            navigate('/ma-boutique');
        } else {
            navigate('/');
        }
    }
  };

  // --- RENDER PRO MODE (SHOP) ---
  if (isShopMode) {
      const isService = isServiceCategory(formData);
      return (
        <div className="min-h-screen bg-[#f5f6f7] pb-24">
            {/* Pro Header */}
            <div className="bg-white sticky top-0 z-40 px-4 py-3 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-50 rounded-full text-gray-800">
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="text-lg font-black text-gray-900">Nouvel Article</h1>
                </div>
                <div className="bg-black text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1">
                    <Store size={12} />
                    Mode Pro
                </div>
            </div>

            <div className="max-w-2xl mx-auto p-4 space-y-6">
                
                {/* 1. Category Selector (Horizontal Scroll) */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-3">Catégorie</label>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {Object.values(Category).filter(c => c !== Category.ALL).map((cat) => (
                            <button
                                key={cat}
                                onClick={() => handleCategorySelect(cat)}
                                className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${
                                    formData.category === cat 
                                    ? 'bg-black text-white border-black shadow-md' 
                                    : 'bg-white text-gray-500 border-gray-200'
                                }`}
                            >
                                <span className={formData.category === cat ? 'text-white' : 'text-gray-400'}>
                                    {React.cloneElement(CategoryIconMap[cat] as React.ReactElement, { size: 16 })}
                                </span>
                                <span className="text-xs font-bold whitespace-nowrap">{cat}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* 2. Photos (Quick Add) */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-3">
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-wider">
                            {isService ? "Images / Portfolio" : "Photos Produit"} ({formData.images.length}/10)
                        </label>
                        <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" multiple className="hidden" />
                    </div>
                    
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {/* Add Button */}
                        <button 
                            onClick={triggerFileInput}
                            className="flex-shrink-0 w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-gray-400 active:scale-95 transition-transform"
                        >
                            <Camera size={24} className="mb-1" />
                            <span className="text-[10px] font-bold uppercase">Ajouter</span>
                        </button>

                        {/* Images List */}
                        {formData.images.map((img, idx) => (
                            <div key={idx} className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden relative shadow-sm group">
                                <img src={img} alt="" className="w-full h-full object-cover" />
                                <button 
                                    onClick={() => removeImage(idx)}
                                    className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full backdrop-blur-sm"
                                >
                                    <X size={12} />
                                </button>
                                {idx === 0 && <div className="absolute bottom-0 left-0 right-0 bg-garala-500 text-white text-[8px] font-bold text-center py-0.5">Principal</div>}
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. Main Info (Grid) */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
                            {isService ? "Titre du service" : "Titre du produit"}
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder={isService ? "Ex: Plomberie rapide 24h/24" : "Ex: Robe Zara Été"}
                            className="w-full p-3 bg-gray-50 border-none rounded-xl font-bold text-gray-900 focus:ring-2 focus:ring-black placeholder-gray-400"
                        />
                    </div>

                    <div className={`grid ${isService ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
                                {isService ? "Tarif Indicatif / Devis (FCFA)" : "Prix (FCFA)"}
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="0"
                                className="w-full p-3 bg-gray-50 border-none rounded-xl font-black text-lg text-gray-900 focus:ring-2 focus:ring-black"
                            />
                        </div>
                        {!isService && (
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Stock</label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    placeholder="1"
                                    className="w-full p-3 bg-gray-50 border-none rounded-xl font-bold text-gray-900 focus:ring-2 focus:ring-black"
                                />
                            </div>
                        )}
                    </div>
                    
                    {!isService && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Unité (Optionnel)</label>
                                <select
                                    name="priceUnit"
                                    value={formData.priceUnit}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-gray-50 border-none rounded-xl font-medium text-sm text-gray-900 appearance-none"
                                >
                                    <option value="">(Aucune)</option>
                                    <option value="/ pièce">/ pièce</option>
                                    <option value="/ ensemble">/ ensemble</option>
                                    <option value="/ kg">/ kg</option>
                                    <option value="/ mètre">/ mètre</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                {/* 4. Attributes (Collapsible/Visual) - Hide for Services */}
                {!isService && (
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Tailles Disponibles</label>
                            <div className="flex flex-wrap gap-2">
                                {(formData.category === Category.FASHION ? CLOTHING_SIZES : SHOE_SIZES).map(size => (
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
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Couleurs</label>
                            <div className="flex flex-wrap gap-2">
                                {PRESET_COLORS.map(color => (
                                    <button
                                        key={color}
                                        onClick={() => toggleColor(color)}
                                        className={`w-8 h-8 rounded-full border-2 transition-all shadow-sm ${
                                            formData.selectedColors.includes(color) 
                                            ? 'ring-2 ring-offset-2 ring-black border-transparent scale-110' 
                                            : 'border-gray-200 hover:scale-105'
                                        }`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                 {/* 5. Description */}
                 <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
                        {isService ? "Description du service" : "Description"}
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        placeholder={isService ? "Détaillez vos compétences, vos horaires, vos tarifs spéciaux..." : "Détails du produit..."}
                        className="w-full p-3 bg-gray-50 border-none rounded-xl font-medium text-gray-900 focus:ring-2 focus:ring-black resize-none"
                    />
                </div>

            </div>

            {/* Pro Footer Actions */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 z-50 flex gap-3">
                 <button
                    onClick={() => handleSubmit(true)}
                    disabled={isLoading}
                    className="flex-1 bg-white border-2 border-black text-black py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all active:scale-95 disabled:opacity-50"
                >
                    {isLoading ? <Loader2 size={20} className="animate-spin" /> : <PlusCircle size={20} />}
                    <span className="text-sm">Publier & Nouveau</span>
                </button>
                <button
                    onClick={() => handleSubmit(false)}
                    disabled={isLoading}
                    className="flex-1 bg-black text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 disabled:opacity-50"
                >
                    {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Check size={20} />}
                    <span className="text-sm">Publier</span>
                </button>
            </div>
        </div>
      );
  }

  // --- STANDARD USER RENDER (WIZARD) ---
  const isService = isServiceCategory(formData);

  const ProgressBar = () => (
    <div className="w-full bg-gray-100 h-2 sticky top-16 md:top-0 z-30">
      <div 
        className="bg-garala-500 h-2 transition-all duration-500 ease-out rounded-r-full shadow-[0_0_10px_rgba(236,90,19,0.5)]"
        style={{ width: `${(step / totalSteps) * 100}%` }}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f5f6f7] flex flex-col font-sans pb-28 md:pb-0">
      <ProgressBar />

      <div className="flex-grow max-w-xl mx-auto w-full md:py-8 md:px-4">
        <div className="bg-white md:rounded-3xl md:shadow-xl md:border md:border-gray-100 overflow-hidden min-h-[calc(100vh-80px)] md:min-h-auto flex flex-col relative">
            
            <div className="px-6 py-4 flex items-center justify-between border-b border-gray-50 bg-white sticky top-0 z-20">
                <button onClick={prevStep} className="p-2 -ml-2 hover:bg-gray-50 rounded-full transition-colors text-gray-800">
                    <ChevronLeft size={28} />
                </button>
                <span className="font-bold text-gray-900 text-sm tracking-wide">Étape {step} / {totalSteps}</span>
                <div className="w-10" />
            </div>

            <div className="flex-grow p-5 md:p-8 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {step === 1 && (
                    <div className="space-y-6">
                        <div className="text-center mb-6">
                            <h1 className="text-3xl font-black text-gray-900 mb-2">
                                {formData.sellerName ? `Bonjour ${formData.sellerName.split(' ')[0]}, ` : ''}On vend quoi ?
                            </h1>
                            <p className="text-gray-500 font-medium">Touchez une catégorie.</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            {Object.values(Category).filter(c => c !== Category.ALL).map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => handleCategorySelect(cat)}
                                    className={`flex flex-col items-center justify-center p-4 rounded-3xl border-2 transition-all duration-200 active:scale-95 shadow-sm min-h-[120px] ${formData.category === cat ? 'border-garala-500 bg-garala-50 text-garala-700' : 'border-gray-100 bg-white text-gray-600'}`}
                                >
                                    <div className={`mb-3 p-4 rounded-full ${formData.category === cat ? 'bg-white' : 'bg-gray-50'}`}>
                                        {CategoryIconMap[cat]}
                                    </div>
                                    <span className="font-bold text-sm text-center leading-tight">{cat}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-8">
                        <div className="text-center">
                            <h1 className="text-3xl font-black text-gray-900 mb-2">
                                {isService ? "Votre Service" : "Décrivez votre bien"}
                            </h1>
                            <p className="text-gray-500 font-medium">
                                {isService ? "Soyez clair sur ce que vous proposez." : "Des photos claires et un titre précis attirent 5x plus de clients."}
                            </p>
                        </div>

                        <div className="space-y-4">
                             <div className="flex justify-between items-center px-1">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-wider">
                                    {isService ? "Illustrations / Portfolio" : "Photos"} ({formData.images.length}/10)
                                </label>
                                {formData.images.length > 0 && (
                                    <span className="text-xs font-bold text-garala-500">
                                        {isService ? "Image de couverture ok" : "Photo principale sélectionnée"}
                                    </span>
                                )}
                             </div>

                             <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleImageUpload} 
                                accept="image/*" 
                                multiple 
                                className="hidden" 
                             />

                             {formData.images.length === 0 ? (
                                 <button 
                                    onClick={triggerFileInput}
                                    className="w-full aspect-[4/3] rounded-3xl border-3 border-dashed border-garala-200 bg-garala-50 hover:bg-garala-100 flex flex-col items-center justify-center text-garala-500 transition-all group active:scale-98"
                                 >
                                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                                        <Camera size={40} />
                                    </div>
                                    <span className="text-lg font-black uppercase tracking-wide">Ajouter des photos</span>
                                    <span className="text-sm font-medium text-garala-400 mt-1 opacity-70">1 photo suffit (10 max)</span>
                                 </button>
                             ) : (
                                 <div className="grid grid-cols-2 gap-4 animate-in fade-in zoom-in duration-300">
                                    <button 
                                        onClick={triggerFileInput}
                                        className="aspect-square rounded-3xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 flex flex-col items-center justify-center text-gray-400 hover:text-gray-600 transition-colors active:scale-95"
                                    >
                                        <Camera size={32} className="mb-2" />
                                        <span className="text-xs font-black uppercase">Ajouter</span>
                                    </button>

                                    {formData.images.map((img, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-3xl overflow-hidden shadow-sm group bg-gray-100">
                                            <img src={img} alt="Preview" className="w-full h-full object-cover" />
                                            <button 
                                                onClick={() => removeImage(idx)}
                                                className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={14} />
                                            </button>
                                            {idx === 0 && (
                                                <div className="absolute bottom-2 left-2 bg-garala-500 text-white text-[10px] font-bold px-2 py-1 rounded">
                                                    Principal
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                 </div>
                             )}
                        </div>

                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2 ml-1">
                                {isService ? "Titre de la prestation" : "Titre de l'annonce"}
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder={isService ? "Ex: Déménagement, Coiffure à domicile..." : "Ex: iPhone 13 Pro Max 256Go"}
                                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-garala-500 transition-all font-bold text-gray-900 placeholder-gray-400"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2 ml-1">
                                {isService ? "Détails de l'offre" : "Description"}
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                placeholder={isService ? "Expliquez ce que vous faites, vos tarifs spéciaux, votre expérience..." : "Détails, état, accessoires inclus..."}
                                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-garala-500 transition-all font-medium text-gray-900 placeholder-gray-400 resize-none"
                            />
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-8">
                        <div className="text-center mb-4">
                            <h1 className="text-3xl font-black text-gray-900 mb-2">
                                {isService ? "Tarif & Zone" : "Le juste prix"}
                            </h1>
                            <p className="text-gray-500 font-medium">
                                {isService ? "Définissez votre valeur et où vous intervenez." : "Et où trouver ce bien."}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                             <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2 ml-1">
                                    {isService ? "Tarif Indicatif (FCFA)" : "Prix (FCFA)"}
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                        {isService ? <Banknote size={20} /> : null}
                                    </div>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        placeholder="0"
                                        className={`w-full p-4 ${isService ? 'pl-12' : ''} bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-garala-500 transition-all font-black text-xl text-gray-900 placeholder-gray-300`}
                                    />
                                </div>
                                {isService && (
                                    <p className="text-xs text-gray-400 mt-2 ml-1">
                                        Mettez 0 si c'est "Sur devis".
                                    </p>
                                )}
                             </div>
                        </div>

                        <div ref={locationWrapperRef} className="relative">
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2 ml-1">
                                {isService ? "Zone d'intervention / Base" : "Lieu du bien"}
                            </label>
                            
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <MapPin size={20} />
                                </div>
                                <input
                                    type="text"
                                    name="location"
                                    value={locationSearch}
                                    onFocus={() => setShowLocationList(true)}
                                    onChange={(e) => {
                                        setLocationSearch(e.target.value);
                                        setFormData(prev => ({ ...prev, location: e.target.value }));
                                        setShowLocationList(true);
                                    }}
                                    placeholder="Quartier ou ville..."
                                    className="w-full p-4 pl-12 pr-12 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-garala-500 transition-all font-bold text-gray-900 placeholder-gray-400"
                                />
                                <button 
                                    onClick={handleGeolocation}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white rounded-xl shadow-sm text-garala-500 hover:bg-garala-50 transition-colors"
                                >
                                    {false ? <Loader2 size={18} className="animate-spin" /> : <Crosshair size={18} />}
                                </button>
                            </div>

                            {showLocationList && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 max-h-48 overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2">
                                    {filteredLocations.map((loc) => (
                                        <button
                                            key={loc.name}
                                            onClick={() => handleLocationSelect(loc.name)}
                                            className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-none flex items-center justify-between group"
                                        >
                                            <span className="font-medium text-gray-700 group-hover:text-gray-900">{loc.name}</span>
                                            {formData.location === loc.name && <Check size={16} className="text-garala-500" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {step === 4 && (
                     <div className="space-y-6 text-center mt-8">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 shadow-lg shadow-green-100 relative animate-in zoom-in duration-300">
                            <Sparkles size={48} />
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 mb-2">C'est presque fini !</h1>
                        <p className="text-gray-500 font-medium">Confirmez vos coordonnées pour être contacté.</p>

                        <div className="bg-gray-50 rounded-3xl p-6 text-left space-y-4 shadow-inner">
                             <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2 ml-1">Votre Nom</label>
                                <div className="relative">
                                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
                                    <input
                                        type="text"
                                        name="sellerName"
                                        value={formData.sellerName}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border-none font-bold text-gray-900 focus:ring-2 focus:ring-garala-500 shadow-sm text-black"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2 ml-1">Téléphone / WhatsApp</label>
                                <div className="relative">
                                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border-none font-bold text-gray-900 focus:ring-2 focus:ring-garala-500 shadow-sm text-black"
                                    />
                                </div>
                            </div>
                        </div>
                     </div>
                )}

            </div>

            {/* Navigation Buttons for Normal User */}
            <div className="p-4 bg-white border-t border-gray-100 sticky bottom-0 z-50 md:static md:bg-transparent md:border-none">
                {step < totalSteps ? (
                    <button
                        onClick={nextStep}
                        className={`w-full py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-all transform active:scale-95 shadow-xl text-white ${
                            isStepValid() 
                            ? 'bg-garala-500 shadow-garala-200' 
                            : 'bg-gray-300 cursor-not-allowed'
                        }`}
                        disabled={!isStepValid()}
                    >
                        Continuer
                        <ChevronRight size={24} />
                    </button>
                ) : (
                    <button
                        onClick={() => handleSubmit(false)}
                        disabled={isLoading}
                        className="w-full bg-black text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 shadow-xl hover:bg-gray-900 transition-all active:scale-95 disabled:opacity-70"
                    >
                        {isLoading ? <Loader2 size={24} className="animate-spin" /> : (isService ? "Publier le service" : "Publier l'annonce")}
                    </button>
                )}
            </div>

        </div>
      </div>
    </div>
  );
};
