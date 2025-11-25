

import React, { useState, useMemo } from 'react';
import { Search, Bell, Clock, X, MapPin, Check, SlidersHorizontal, LayoutGrid, ChevronLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useUI } from '../UIContext';
import { BANGUI_LOCATIONS } from '../constants';

export const SearchPage: React.FC = () => {
  const { showToast, searchHistory, addToSearchHistory, clearSearchHistory, offlineMode } = useUI();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const filteredLocations = useMemo(() => {
    if (!locationSearch) return BANGUI_LOCATIONS;
    return BANGUI_LOCATIONS.filter(loc => 
      loc.name.toLowerCase().includes(locationSearch.toLowerCase())
    );
  }, [locationSearch]);

  const handleLocationSelect = (locName: string) => {
      setSelectedLocation(locName);
      setLocationSearch('');
      showToast(`Localisation définie : ${locName}`, 'success');
  };

  const handleSearch = () => {
      if (offlineMode) {
          showToast("Connexion requise pour effectuer une recherche. Veuillez désactiver le mode hors ligne.", "error");
          return;
      }

      // Build URL Search Params
      const params = new URLSearchParams();
      if (keyword.trim()) params.append('q', keyword.trim());
      if (selectedLocation) params.append('loc', selectedLocation);
      if (minPrice) params.append('min', minPrice);
      if (maxPrice) params.append('max', maxPrice);

      if (keyword.trim()) addToSearchHistory(keyword.trim());

      navigate(`/?${params.toString()}`);
  };

  const handleHistoryClick = (term: string) => {
      if (offlineMode) {
          showToast("Connexion requise pour effectuer une recherche.", "error");
          return;
      }
      addToSearchHistory(term);
      navigate(`/?q=${encodeURIComponent(term)}`);
  };

  return (
    <div className="min-h-screen bg-[#f5f6f7] dark:bg-black py-6 pb-24 transition-colors">
      <div className="max-w-md mx-auto px-4">
        
        <div className="flex items-center gap-3 mb-6">
            <button 
                onClick={() => navigate(-1)} 
                className="p-2 -ml-2 bg-white dark:bg-gray-800 rounded-full shadow-sm text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
                <ChevronLeft size={24} />
            </button>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                <Search className="text-garala-500" size={24} />
                Recherche
            </h1>
        </div>

        {/* Filters Section */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 mb-8 space-y-6">
            
            {/* Keyword Input */}
             <div>
                <label className="block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1">
                    <Search size={12} /> Mots-clés
                </label>
                <div className="relative group">
                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="Que cherchez-vous ?"
                        autoFocus
                        className="w-full p-3.5 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-base font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-garala-500 transition-all placeholder-gray-500 dark:placeholder-gray-400"
                    />
                    {keyword && (
                        <button 
                            onClick={() => setKeyword('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 p-1 hover:text-gray-600"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
            </div>

            {/* Location Selector */}
            <div>
                <label className="block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1">
                    <MapPin size={12} /> Localisation
                </label>
                
                {selectedLocation ? (
                    <div className="flex items-center justify-between bg-garala-50 dark:bg-garala-900/20 p-3 rounded-2xl border border-garala-100 dark:border-garala-900">
                        <span className="font-bold text-garala-700 dark:text-garala-400 flex items-center gap-2">
                            <MapPin size={16} /> {selectedLocation}
                        </span>
                        <button onClick={() => setSelectedLocation('')} className="p-1 hover:bg-white dark:hover:bg-gray-800 rounded-full transition-colors">
                            <X size={16} className="text-garala-500" />
                        </button>
                    </div>
                ) : (
                    <div className="relative group">
                        <input
                            type="text"
                            value={locationSearch}
                            onChange={(e) => setLocationSearch(e.target.value)}
                            placeholder="Quelle ville ou quartier ?"
                            className="w-full p-3.5 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-base font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-garala-500 transition-all placeholder-gray-500 dark:placeholder-gray-400"
                        />
                    </div>
                )}

                {/* Location Suggestions List */}
                {!selectedLocation && locationSearch && (
                    <div className="mt-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-lg max-h-60 overflow-y-auto absolute z-50 w-[calc(100%-48px)]">
                         <button 
                            onClick={() => handleLocationSelect('Tout Bangui')} 
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-sm font-bold text-garala-600 dark:text-garala-400 border-b border-gray-50 dark:border-gray-700"
                        >
                            <LayoutGrid size={16}/> Tout Bangui
                        </button>
                        {filteredLocations.map(loc => (
                            <button 
                                key={loc.name}
                                onClick={() => handleLocationSelect(loc.name)}
                                className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium border-b border-gray-50 dark:border-gray-700 text-gray-700 dark:text-gray-200"
                            >
                                {loc.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Price Filter Inputs */}
            <div>
                <label className="block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1">
                    <SlidersHorizontal size={12} /> Budget (FCFA)
                </label>
                <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                        <input
                            type="number"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            placeholder="Min"
                            className="w-full p-3.5 bg-gray-50 dark:bg-gray-800 rounded-xl border-none font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-garala-500 transition-all pr-12 placeholder-gray-400"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 pointer-events-none">FCFA</span>
                    </div>
                    <div className="relative">
                        <input
                            type="number"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            placeholder="Max"
                            className="w-full p-3.5 bg-gray-50 dark:bg-gray-800 rounded-xl border-none font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-garala-500 transition-all pr-12 placeholder-gray-400"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 pointer-events-none">FCFA</span>
                    </div>
                </div>
            </div>

             <button 
                onClick={handleSearch}
                className="w-full bg-garala-500 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-garala-200 dark:shadow-none active:scale-95 transition-transform"
            >
                Voir les résultats
            </button>
        </div>

        {/* Recent History */}
        {searchHistory.length > 0 && (
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Clock size={20} className="text-gray-500 dark:text-gray-400" />
                        Recherches récentes
                    </h2>
                    <button 
                        className="text-xs font-bold text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors" 
                        onClick={clearSearchHistory}
                    >
                        Effacer tout
                    </button>
                </div>
                
                <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                    {searchHistory.map((term, idx) => (
                        <div 
                            key={idx} 
                            onClick={() => handleHistoryClick(term)}
                            className="flex items-center justify-between p-4 border-b border-gray-50 dark:border-gray-800 last:border-none hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer group transition-colors"
                        >
                            <div className="flex items-center gap-3 flex-grow">
                                <Clock size={16} className="text-gray-300 dark:text-gray-600 group-hover:text-garala-500 transition-colors" />
                                <span className="text-gray-700 dark:text-gray-300 font-medium group-hover:text-garala-600 dark:group-hover:text-garala-400 transition-colors">{term}</span>
                            </div>
                            <button className="text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 p-1">
                                <ChevronLeft size={16} className="rotate-180" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        )}

      </div>
    </div>
  );
};