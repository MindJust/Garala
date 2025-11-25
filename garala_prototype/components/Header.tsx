

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, Bell, User, Wifi, WifiOff, MessageCircle } from 'lucide-react';
import { useUI } from '../UIContext';
import { GaralaLogo } from './GaralaLogo';

export const Header: React.FC = () => {
  const { showToast, favorites, offlineMode, toggleOfflineMode, unreadMessagesCount } = useUI();
  const location = useLocation();

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 shadow-sm h-[74px] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          
          {/* Left: Offline Mode Toggle */}
          <div className="flex items-center w-24 md:w-48">
              <button 
                onClick={toggleOfflineMode}
                className={`p-2 rounded-full transition-all duration-300 flex items-center gap-2 border ${
                    offlineMode 
                        ? 'bg-red-100 border-red-200 text-red-600 animate-pulse dark:bg-red-900/50 dark:border-red-800 dark:text-red-400' 
                        : 'bg-green-100 border-green-200 text-green-600 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400'
                }`}
                title={offlineMode ? "Mode Hors Ligne - Déconnecté" : "En Ligne"}
              >
                  {offlineMode ? <WifiOff size={20} /> : <Wifi size={20} />}
                  <span className="text-[10px] font-bold hidden md:inline-block uppercase tracking-wide">
                      {offlineMode ? 'Hors Ligne' : 'Connecté'}
                  </span>
              </button>
          </div>

          {/* Logo & Slogan Centered */}
          <div className="flex flex-col items-center justify-center flex-1">
            <Link to="/" className="flex flex-col items-center group gap-0.5">
              <div className="flex flex-col items-center justify-center leading-none gap-0.5 mb-0.5">
                 <span className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-[0.15em] transition-colors">
                    Tout se vend,
                 </span>
                 <span className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-[0.15em] transition-colors">
                    Tout s'achète
                 </span>
              </div>
              <div className="transform group-hover:scale-105 transition-transform duration-300 text-[#1e1b4b] dark:text-white">
                <GaralaLogo className="h-9 md:h-10 w-auto text-current" showText={true} />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation (Right aligned) */}
          <div className="hidden md:flex items-center justify-end space-x-8 w-48">
            <div className="flex items-center gap-6 text-xs font-semibold text-gray-700 dark:text-gray-300">
               <Link 
                  to="/recherches"
                  className="flex flex-col items-center gap-1.5 hover:text-garala-600 dark:hover:text-garala-400 transition-colors group"
               >
                <Search size={22} className="text-gray-600 dark:text-gray-400 group-hover:text-garala-600 dark:group-hover:text-garala-400" />
                <span>Mes recherches</span>
              </Link>
              <Link 
                  to="/favoris"
                  className="flex flex-col items-center gap-1.5 hover:text-garala-600 dark:hover:text-garala-400 transition-colors group relative"
               >
                <Heart size={22} className={`group-hover:text-garala-600 dark:group-hover:text-garala-400 ${favorites.length > 0 ? 'text-garala-500 fill-current' : 'text-gray-600 dark:text-gray-400'}`} />
                {favorites.length > 0 && (
                    <span className="absolute -top-1 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                )}
                <span>Favoris</span>
              </Link>
              <Link 
                  to="/messages"
                  className="flex flex-col items-center gap-1.5 hover:text-garala-600 dark:hover:text-garala-400 transition-colors group relative"
              >
                <MessageCircle size={22} className="text-gray-600 dark:text-gray-400 group-hover:text-garala-600 dark:group-hover:text-garala-400" />
                {unreadMessagesCount > 0 && (
                     <span className="absolute -top-1 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                )}
                <span>Messages</span>
              </Link>
              <button 
                  onClick={() => showToast("Aucune nouvelle notification", "info")}
                  className="flex flex-col items-center gap-1.5 hover:text-garala-600 dark:hover:text-garala-400 transition-colors group"
              >
                <Bell size={22} className="text-gray-600 dark:text-gray-400 group-hover:text-garala-600 dark:group-hover:text-garala-400" />
                <span>Notifications</span>
              </button>
              <Link to="/menu" className="flex flex-col items-center gap-1.5 hover:text-garala-600 dark:hover:text-garala-400 transition-colors group">
                <User size={22} className="text-gray-600 dark:text-gray-400 group-hover:text-garala-600 dark:group-hover:text-garala-400" />
                <span>Compte</span>
              </Link>
            </div>
          </div>
          
          {/* Mobile Right Icons */}
          <div className="md:hidden flex items-center justify-end w-24 gap-3">
             <Link 
                to="/messages"
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
             >
                <MessageCircle size={24} className="text-gray-700 dark:text-gray-300" />
                {unreadMessagesCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white dark:border-gray-900"></span>
                )}
             </Link>
          </div>
        </div>
      </div>
    </header>
  );
};