

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Plus, Heart, User, MessageCircle } from 'lucide-react';
import { useUI } from '../UIContext';

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const { favorites, unreadMessagesCount } = useUI();
  const isPosting = location.pathname === '/poster';
  const [isHidden, setIsHidden] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        setIsHidden(true);
      }
    };

    const handleBlur = (e: FocusEvent) => {
       setTimeout(() => {
         const active = document.activeElement as HTMLElement;
         if (active.tagName !== 'INPUT' && active.tagName !== 'TEXTAREA' && active.tagName !== 'SELECT') {
           setIsHidden(false);
         }
       }, 100);
    };

    window.addEventListener('focusin', handleFocus);
    window.addEventListener('focusout', handleBlur);

    return () => {
      window.removeEventListener('focusin', handleFocus);
      window.removeEventListener('focusout', handleBlur);
    };
  }, []);

  if (isHidden) return null;

  return (
    <div className="md:hidden fixed bottom-6 left-4 right-4 z-50 animate-in slide-in-from-bottom-20 duration-300">
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.5)] border border-white/20 dark:border-gray-800/50 p-3 flex justify-between items-center px-3 transition-colors">
        
        {/* Home */}
        <Link
          to="/"
          className={`p-3.5 rounded-2xl transition-all duration-300 ${
            isActive('/') ? 'bg-garala-50 dark:bg-garala-900/30 text-garala-600 dark:text-garala-400' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
        >
          <Home size={26} strokeWidth={isActive('/') ? 3 : 2.5} />
        </Link>

        {/* Search */}
        <Link
          to="/recherches"
          className={`p-3.5 rounded-2xl transition-all duration-300 ${
            isActive('/recherches') ? 'bg-garala-50 dark:bg-garala-900/30 text-garala-600 dark:text-garala-400' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
        >
          <Search size={26} strokeWidth={isActive('/recherches') ? 3 : 2.5} />
        </Link>

        {/* Post Ad - Floating Action Button - Hidden if already posting */}
        <div className="relative -mt-16 z-10 w-16 h-16 flex items-center justify-center pointer-events-none">
             {!isPosting && (
                <Link
                to="/poster"
                className="pointer-events-auto flex items-center justify-center w-16 h-16 bg-garala-500 rounded-full shadow-xl shadow-garala-500/40 text-white transform transition-all active:scale-90 hover:scale-105 border-[5px] border-[#f5f6f7] dark:border-black"
                >
                <Plus size={32} strokeWidth={3.5} />
                </Link>
             )}
        </div>

        {/* Favorites */}
        <Link
          to="/favoris"
          className={`p-3.5 rounded-2xl transition-all duration-300 relative ${
            isActive('/favoris') ? 'bg-garala-50 dark:bg-garala-900/30 text-garala-600 dark:text-garala-400' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
        >
          <Heart size={26} strokeWidth={isActive('/favoris') ? 3 : 2.5} className={isActive('/favoris') ? 'fill-current' : ''} />
          {favorites.length > 0 && !isActive('/favoris') && (
               <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-gray-900"></span>
           )}
        </Link>
        
        {/* Messages (Replaces User icon if desired, or add separately. Assuming we keep User/Menu) */}
        {/* Actually, User requested access to chat. Usually Menu contains link to chat, but seeing the previous BottomNav had 4 icons + FAB. Let's keep User/Menu as it has many links. */}
        
        {/* Menu/Profile */}
        <Link
          to="/menu"
          className={`p-3.5 rounded-2xl transition-all duration-300 relative ${
            isActive('/menu') ? 'bg-garala-50 dark:bg-garala-900/30 text-garala-600 dark:text-garala-400' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
        >
          <User size={26} strokeWidth={isActive('/menu') ? 3 : 2.5} />
           {unreadMessagesCount > 0 && !isActive('/menu') && (
               <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-gray-900"></span>
           )}
        </Link>
      </div>
    </div>
  );
};