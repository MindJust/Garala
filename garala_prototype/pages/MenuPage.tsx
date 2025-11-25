

import React from 'react';
import { User, Settings, HelpCircle, Shield, ChevronRight, Package, Bell, CreditCard, LogIn, LogOut, ChevronLeft, Store, Megaphone, Home, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUI } from '../UIContext';
import { GaralaLogo } from '../components/GaralaLogo';

export const MenuPage: React.FC = () => {
  const { user, logout, notifications, userAds, openInfoPage } = useUI();
  const navigate = useNavigate();
  
  const unreadNotifications = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
      logout();
      navigate('/');
  };

  // Determine Shop Link destination
  // If user has a shopId, go to Dashboard (/ma-boutique), else go to Creation
  const shopLink = user?.shopId ? '/ma-boutique' : '/creer-boutique';
  const shopLabel = user?.shopId ? 'Ma Boutique' : 'Créer une boutique';

  const menuItems = [
    { 
        icon: <Package size={20} />, 
        label: 'Mes annonces', 
        path: '/mes-annonces',
        badge: user ? userAds.length : undefined
    },
    { 
        icon: <Store size={20} />, 
        label: shopLabel, 
        path: shopLink,
        isProFeature: !user?.shopId // Show indicator if it's creation
    },
    { 
        icon: <Bell size={20} />, 
        label: 'Notifications', 
        path: '/notifications',
        badge: unreadNotifications > 0 ? unreadNotifications : undefined,
        badgeColor: 'bg-red-500 text-white'
    },
    { 
        icon: <Megaphone size={20} />, 
        label: 'Garala Publicité', 
        path: '/publicite',
        badge: 'New',
        badgeColor: 'bg-black dark:bg-white text-white dark:text-black'
    },
    { 
        icon: <Home size={20} />, 
        label: 'Garala Immo', 
        path: '/immo',
    },
    {
        icon: <Briefcase size={20} />,
        label: 'Espace Emploi & RH',
        path: '/recrutement',
        badge: 'New',
        badgeColor: 'bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300'
    },
    { 
        icon: <CreditCard size={20} />, 
        label: 'Paiements & Transactions', 
        path: '/paiements' 
    },
    { 
        icon: <Settings size={20} />, 
        label: 'Paramètres', 
        path: '/parametres' 
    },
  ];

  const supportItems = [
    { icon: <HelpCircle size={20} />, label: 'Aide & Contact', action: () => openInfoPage('CONTACT') },
    { icon: <Shield size={20} />, label: 'Confidentialité & Légal', action: () => openInfoPage('PRIVACY') },
  ];

  return (
    <div className="min-h-screen bg-[#f5f6f7] dark:bg-black py-6 pb-32 transition-colors">
      <div className="max-w-md mx-auto px-4">
        
        {/* Header with Back Button */}
        <div className="flex items-center gap-3 mb-6">
          <button 
                onClick={() => navigate(-1)} 
                className="p-2 -ml-2 bg-white dark:bg-gray-800 rounded-full shadow-sm text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors md:hidden"
            >
                <ChevronLeft size={24} />
          </button>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Mon Compte</h1>
        </div>
        
        {/* Profile Card */}
        {user ? (
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 mb-6 flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
                <img src={user.avatar} alt="Avatar" className="w-16 h-16 rounded-full border-2 border-white dark:border-gray-800 shadow-md object-cover" />
                <div className="flex-grow">
                    <h2 className="text-xl font-black text-gray-900 dark:text-white">{user.name}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                    <div className="flex gap-2 mt-1 flex-wrap">
                        {user.isPro && <span className="text-[10px] bg-black dark:bg-white text-white dark:text-black px-2 py-0.5 rounded font-bold uppercase inline-block">Pro</span>}
                        {user.verificationStatus === 'pending' && (
                             <span className="text-[10px] bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-2 py-0.5 rounded font-bold uppercase inline-block border border-orange-200 dark:border-orange-800">En attente</span>
                        )}
                        {user.isVerified && (
                             <span className="text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded font-bold uppercase inline-block border border-blue-200 dark:border-blue-800">Vérifié</span>
                        )}
                    </div>
                </div>
            </div>
        ) : (
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 mb-6 flex flex-col items-center text-center gap-4">
                 <div className="w-16 h-16 bg-garala-100 dark:bg-garala-900/30 rounded-full flex items-center justify-center text-garala-600 dark:text-garala-400 border-2 border-white dark:border-gray-800 shadow-md">
                    <User size={32} />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex flex-col items-center gap-1">
                        Bienvenue sur
                        <GaralaLogo className="h-6 w-auto" />
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Connectez-vous pour gérer vos annonces et accéder à toutes les fonctionnalités.</p>
                </div>
                <button 
                    onClick={() => navigate('/login')}
                    className="w-full bg-garala-500 hover:bg-garala-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-garala-200 dark:shadow-none transition-all active:scale-95"
                >
                    <LogIn size={20} />
                    Se connecter / S'inscrire
                </button>
            </div>
        )}
        
        {/* Menu Grid */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden mb-6">
            {menuItems.map((item, idx) => (
                <div key={idx} className="border-b border-gray-50 dark:border-gray-800 last:border-none">
                     <button
                        onClick={() => {
                            if (!user && (item.path === '/mes-annonces' || item.path === '/paiements' || item.path === '/parametres' || item.path.includes('boutique'))) {
                                navigate('/login');
                            } else {
                                navigate(item.path);
                            }
                        }}
                        className="w-full flex items-center justify-between p-5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left group"
                     >
                        <div className="flex items-center gap-4">
                            <div className="text-gray-400 dark:text-gray-500 group-hover:text-garala-500 dark:group-hover:text-garala-400 transition-colors">
                                {item.icon}
                            </div>
                            <span className="font-bold text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white">{item.label}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            {item.isProFeature && user && !user.shopId && (
                                <span className="text-[10px] bg-garala-100 dark:bg-garala-900/30 text-garala-600 dark:text-garala-400 font-bold px-2 py-0.5 rounded uppercase">Nouveau</span>
                            )}
                            {item.badge !== undefined && (
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${item.badgeColor || 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}>
                                    {item.badge}
                                </span>
                            )}
                            <ChevronRight size={18} className="text-gray-300 dark:text-gray-600 group-hover:text-garala-500 dark:group-hover:text-garala-400" />
                        </div>
                     </button>
                </div>
            ))}
        </div>

        {/* Support */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden mb-6">
            {supportItems.map((item, idx) => (
                <button
                    key={idx}
                    onClick={item.action}
                    className="w-full flex items-center justify-between p-5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left border-b border-gray-50 dark:border-gray-800 last:border-none group"
                >
                    <div className="flex items-center gap-4">
                         <div className="text-gray-400 dark:text-gray-500 group-hover:text-garala-500 dark:group-hover:text-garala-400 transition-colors">
                            {item.icon}
                        </div>
                        <span className="font-medium text-gray-700 dark:text-gray-200">{item.label}</span>
                    </div>
                </button>
            ))}
        </div>
        
        {/* Logout */}
        {user && (
            <button 
                onClick={handleLogout} 
                className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-red-500 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shadow-sm"
            >
                <LogOut size={20} />
                Se déconnecter
            </button>
        )}
        
        <div className="text-center mt-8 text-xs text-gray-400 pb-4">
            Version 1.0.0 • Garala RCA
        </div>
      </div>
    </div>
  );
};