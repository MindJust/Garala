

import React, { useState, useMemo, useEffect } from 'react';
import { Search, X, Filter, ArrowUpDown, MapPin, SlidersHorizontal, RefreshCw, Sparkles } from 'lucide-react';
import { AdCard } from '../components/AdCard';
import { Category, Ad, SortOption } from '../types';
import { useSearchParams } from 'react-router-dom';

interface HomePageProps {
  ads: Ad[];
}

// Skeleton Component for loading state
const AdSkeleton = () => (
    <div className="bg-white dark:bg-gray-900 rounded-[24px] overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
        <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 animate-pulse"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2 animate-pulse"></div>
            <div className="flex justify-between items-center mt-2">
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/3 animate-pulse"></div>
                <div className="h-6 w-16 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse"></div>
            </div>
        </div>
    </div>
);

export const HomePage: React.FC<HomePageProps> = ({ ads }) => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>(Category.ALL);
  const [sortOption, setSortOption] = useState<SortOption>('date_desc');
  const [isLoading, setIsLoading] = useState(true);
  
  // Price and Location Filters
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [locationFilter, setLocationFilter] = useState('');

  // Read URL Params on Mount
  useEffect(() => {
    const q = searchParams.get('q');
    const loc = searchParams.get('loc');
    const min = searchParams.get('min');
    const max = searchParams.get('max');

    if (q) setSearchTerm(q);
    if (loc) setLocationFilter(loc);
    if (min) setMinPrice(Number(min));
    if (max) setMaxPrice(Number(max));
    
    // If there are search params, trigger a "loading" effect to simulate search
    if (q || loc || min || max) {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 800);
    } else {
         const timer = setTimeout(() => setIsLoading(false), 1200);
         return () => clearTimeout(timer);
    }
  }, [searchParams]);

  // Update sort option automatically when searching
  useEffect(() => {
    if (searchTerm.length > 0 && sortOption === 'date_desc') {
        setSortOption('relevance');
    } else if (searchTerm.length === 0 && sortOption === 'relevance') {
        setSortOption('date_desc');
    }
  }, [searchTerm]);

  const handleRefresh = () => {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 800);
  };
  
  const clearFilters = () => {
      setSearchTerm('');
      setSelectedCategory(Category.ALL);
      setMinPrice(undefined);
      setMaxPrice(undefined);
      setLocationFilter('');
      handleRefresh();
  }

  const filteredAds = useMemo(() => {
    // 1. Prepare search terms (Tokenization)
    const searchTokens = searchTerm.toLowerCase().trim().split(/\s+/).filter(token => token.length > 0);

    // 2. Score and Filter Items
    let results = ads.map(ad => {
        let score = 0;
        
        // Keyword Matching
        if (searchTokens.length === 0) {
            score = 1; // Base score for non-search queries
        } else {
            const title = ad.title.toLowerCase();
            const desc = ad.description.toLowerCase();
            const cat = ad.category.toLowerCase();
            const location = ad.location.toLowerCase();

            searchTokens.forEach(token => {
                if (title.includes(token)) score += 10;
                if (title.startsWith(token)) score += 5;
                if (cat.includes(token)) score += 5;
                if (desc.includes(token)) score += 1;
                if (location.includes(token)) score += 3;
            });
        }
        
        return { ...ad, score };
    }).filter(item => {
        // Filter by Category
        const matchesCategory = selectedCategory === Category.ALL || item.category === selectedCategory;
        
        // Filter by Search Score (must be > 0)
        const matchesSearch = item.score > 0;
        
        // Filter by Price
        const matchesMinPrice = minPrice === undefined || item.price >= minPrice;
        const matchesMaxPrice = maxPrice === undefined || item.price <= maxPrice;
        
        // Filter by Location (if set via search page)
        const matchesLocation = !locationFilter || locationFilter === 'Tout Bangui' || item.location.toLowerCase().includes(locationFilter.toLowerCase());

        return matchesCategory && matchesSearch && matchesMinPrice && matchesMaxPrice && matchesLocation;
    });

    // 3. Sorting Logic
    return results.sort((a, b) => {
        switch (sortOption) {
            case 'relevance':
                if (b.score === a.score) return b.createdAt - a.createdAt;
                return b.score - a.score;
            case 'price_asc':
                return a.price - b.price;
            case 'price_desc':
                return b.price - a.price;
            case 'date_asc':
                return a.createdAt - b.createdAt;
            case 'date_desc':
            default:
                if (a.isBoosted && !b.isBoosted) return -1;
                if (!a.isBoosted && b.isBoosted) return 1;
                return b.createdAt - a.createdAt;
        }
    });
  }, [ads, searchTerm, selectedCategory, sortOption, minPrice, maxPrice, locationFilter]);

  return (
    <div className="min-h-screen bg-[#f5f6f7] dark:bg-black pb-28 transition-colors">
      
      {/* Sticky Header Zone */}
      <div className="bg-white dark:bg-gray-900 sticky top-[74px] z-40 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)] pb-2 pt-2 md:pt-4 transition-all">
        <div className="max-w-7xl mx-auto px-4">
            
            {/* Search Bar */}
            <div className="relative mb-3 mt-2">
                <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-garala-500 transition-colors">
                        <Search size={20} />
                    </div>
                    <input
                        type="text"
                        placeholder="Que cherchez-vous aujourd'hui ?"
                        className="w-full pl-12 pr-12 py-3.5 bg-gray-100 dark:bg-gray-800 border-none rounded-2xl text-base font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-garala-500 focus:bg-white dark:focus:bg-gray-800 transition-all shadow-inner dark:shadow-none placeholder-gray-500 dark:placeholder-gray-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                         <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 p-1 bg-white dark:bg-gray-700 rounded-full shadow-sm hover:text-gray-900 dark:hover:text-white">
                            <X size={14} />
                        </button>
                    )}
                </div>
            </div>

            {/* Categories & Filters Row */}
            <div className="flex flex-col gap-3 pb-3">
                {/* Categories */}
                <div className="flex gap-3 overflow-x-auto pb-1 pt-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 scroll-smooth items-center">
                    {Object.values(Category).map(cat => (
                        <button
                            key={cat}
                            onClick={() => { setSelectedCategory(cat); setIsLoading(true); setTimeout(() => setIsLoading(false), 300); }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all whitespace-nowrap active:scale-95 ${
                                selectedCategory === cat 
                                ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-md' 
                                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
                        >
                            {selectedCategory === cat && (
                                <div className="w-1.5 h-1.5 bg-garala-500 rounded-full animate-pulse"></div>
                            )}
                            <span className="text-xs font-bold">{cat}</span>
                        </button>
                    ))}
                </div>

                {/* Quick Sort Chips */}
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 md:mx-0 md:px-0 items-center">
                     {searchTerm && (
                        <button 
                            onClick={() => setSortOption('relevance')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${sortOption === 'relevance' ? 'bg-garala-50 dark:bg-garala-900/30 text-garala-700 dark:text-garala-400 ring-1 ring-garala-200 dark:ring-garala-800' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                        >
                            <Sparkles size={12} className={sortOption === 'relevance' ? 'text-garala-500 fill-current' : 'opacity-50'} />
                            Pertinence
                        </button>
                     )}
                     
                     <button 
                        onClick={() => setSortOption('date_desc')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${sortOption === 'date_desc' ? 'bg-garala-50 dark:bg-garala-900/30 text-garala-700 dark:text-garala-400 ring-1 ring-garala-200 dark:ring-garala-800' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                     >
                        <RefreshCw size={12} className={sortOption === 'date_desc' ? '' : 'opacity-50'} />
                        Récents
                     </button>
                     <button 
                        onClick={() => setSortOption('price_asc')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${sortOption === 'price_asc' ? 'bg-garala-50 dark:bg-garala-900/30 text-garala-700 dark:text-garala-400 ring-1 ring-garala-200 dark:ring-garala-800' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                     >
                        <ArrowUpDown size={12} className={sortOption === 'price_asc' ? '' : 'opacity-50'} />
                        Prix croiss.
                     </button>
                     <button 
                        onClick={() => setSortOption('price_desc')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${sortOption === 'price_desc' ? 'bg-garala-50 dark:bg-garala-900/30 text-garala-700 dark:text-garala-400 ring-1 ring-garala-200 dark:ring-garala-800' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                     >
                        <ArrowUpDown size={12} className={sortOption === 'price_desc' ? '' : 'opacity-50'} />
                        Prix décr.
                     </button>
                </div>
                
                {/* Filter Feedback Badge */}
                {(minPrice !== undefined || maxPrice !== undefined || locationFilter) && (
                     <div className="flex items-center gap-2 px-1">
                        <span className="text-[10px] font-bold text-gray-500 uppercase bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                             Filtres actifs:
                        </span>
                        {minPrice && <span className="text-[10px] bg-white border border-gray-200 px-2 py-0.5 rounded">Min: {minPrice}</span>}
                        {maxPrice && <span className="text-[10px] bg-white border border-gray-200 px-2 py-0.5 rounded">Max: {maxPrice}</span>}
                        {locationFilter && <span className="text-[10px] bg-white border border-gray-200 px-2 py-0.5 rounded">{locationFilter}</span>}
                        <button onClick={clearFilters} className="text-[10px] text-red-500 font-bold underline ml-auto">Effacer</button>
                     </div>
                )}
            </div>
        </div>
      </div>

      {/* Feed */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        
        <div className="flex justify-between items-end mb-4 px-1">
             <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                {selectedCategory === Category.ALL ? 'À la une' : selectedCategory}
             </h2>
             {!isLoading && (
                 <span className="text-xs font-bold text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-900 px-2 py-1 rounded-md shadow-sm border border-gray-100 dark:border-gray-800">
                    {filteredAds.length} résultats
                 </span>
             )}
        </div>

        {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                {[...Array(8)].map((_, i) => <AdSkeleton key={i} />)}
            </div>
        ) : filteredAds.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             {filteredAds.map((ad: any) => (
                <AdCard key={ad.id} ad={ad} />
             ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in duration-300">
             <div className="w-24 h-24 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center mb-4 text-gray-300 dark:text-gray-600 shadow-sm border border-gray-100 dark:border-gray-800">
                <Search size={32} />
             </div>
             <p className="font-bold text-gray-900 dark:text-white text-lg">Aucun résultat trouvé</p>
             <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-xs mx-auto">
                 Essayez de changer de catégorie ou utilisez d'autres mots-clés.
             </p>
             <button 
                onClick={clearFilters} 
                className="mt-6 bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
             >
                Réinitialiser les filtres
             </button>
          </div>
        )}
      </main>
    </div>
  );
};