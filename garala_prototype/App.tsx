
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { BottomNav } from './components/BottomNav';
import { InfoModal } from './components/InfoModal';
import { AppLockScreen } from './components/AppLockScreen'; 
import { HomePage } from './pages/HomePage';
import { AdDetailsPage } from './pages/AdDetailsPage';
import { PostAdPage } from './pages/PostAdPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { MenuPage } from './pages/MenuPage';
import { MyAdsPage } from './pages/MyAdsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { SettingsPage } from './pages/SettingsPage';
import { EditAdPage } from './pages/EditAdPage';
import { SearchPage } from './pages/SearchPage';
import { LoginPage } from './pages/LoginPage';
import { CreateShopPage } from './pages/CreateShopPage';
import { ShopDashboardPage } from './pages/ShopDashboardPage';
import { AdsPage } from './pages/AdsPage';
import { ImmoPage } from './pages/ImmoPage';
import { RecruitmentPage } from './pages/RecruitmentPage';
import { MessagesPage } from './pages/MessagesPage';
import { Ad, UIContextType, User, Notification, Shop, Theme, InfoPageKey } from './types';
import { MOCK_ADS, APP_LAUNCH_DATE } from './constants';
import { UIContext, UIProvider } from './UIContext';

const Layout: React.FC<{ children: React.ReactNode, isChatOpen: boolean }> = ({ children, isChatOpen }) => {
  const location = useLocation();
  const isPoster = location.pathname === '/poster';
  const isLogin = location.pathname === '/login';

  return (
    <>
      {!isPoster && !isLogin && !isChatOpen && <Header />}
      {children}
      {!isPoster && !isLogin && !isChatOpen && <Footer />}
      {/* Hide BottomNav in Login, Poster AND Chat Mode */}
      {!isLogin && !isChatOpen && <BottomNav />}
    </>
  );
};

// Toast Component
const ToastContainer: React.FC<{ toasts: Array<{ id: number, message: string, type: string }>, removeToast: (id: number) => void }> = ({ toasts, removeToast }) => {
    return (
        <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
            {toasts.map(toast => (
                <div 
                    key={toast.id}
                    className={`pointer-events-auto min-w-[300px] max-w-xs bg-white dark:bg-gray-800 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 dark:border-gray-700 p-4 flex items-center gap-3 transform transition-all animate-in slide-in-from-right-full duration-300`}
                >
                    <div className={`p-2 rounded-full ${
                        toast.type === 'success' ? 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400' : 
                        toast.type === 'error' ? 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400' : 
                        'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
                    }`}>
                        {toast.type === 'success' ? <CheckCircle size={20}/> : 
                         toast.type === 'error' ? <AlertCircle size={20}/> : 
                         <Info size={20}/>}
                    </div>
                    <div className="flex-grow">
                        <p className="font-bold text-gray-900 dark:text-gray-100 text-sm">{toast.message}</p>
                    </div>
                    <button onClick={() => removeToast(toast.id)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <X size={16} />
                    </button>
                </div>
            ))}
        </div>
    );
}

// Main App
const App: React.FC = () => {
  const [ads, setAds] = useState<Ad[]>(MOCK_ADS);
  const [shops, setShops] = useState<Shop[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [toasts, setToasts] = useState<Array<{ id: number, message: string, type: 'success' | 'error' | 'info' }>>([]);
  const [offlineMode, setOfflineMode] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false); // Global state to hide nav/header

  // Storage Stats
  const [storageUsage, setStorageUsage] = useState({ used: 0, quota: 0, percentage: 0 });
  
  const updateStorageStats = async () => {
      let used = 0;
      let quota = 0;
      
      // Local Storage Estimation
      let lsTotal = 0;
      for (let x in localStorage) {
        if (localStorage.hasOwnProperty(x)) {
            lsTotal += ((localStorage[x].length + x.length) * 2);
        }
      }
      
      // Cache Storage Estimation
      if ('storage' in navigator && 'estimate' in navigator.storage) {
          const estimate = await navigator.storage.estimate();
          used = (estimate.usage || 0) + lsTotal;
          quota = estimate.quota || (1024 * 1024 * 1024); // 1GB default
      } else {
          used = lsTotal;
          quota = 5 * 1024 * 1024; // 5MB standard LS limit
      }
      
      setStorageUsage({
          used,
          quota,
          percentage: Math.min(100, (used / quota) * 100)
      });
  };

  useEffect(() => {
      updateStorageStats();
  }, [ads, shops, favorites]); // Update on data change

  const clearCache = async () => {
      // Clear images cache logic (Simulated)
      if ('caches' in window) {
          const keys = await caches.keys();
          for (const key of keys) {
              await caches.delete(key);
          }
      }
      // Clear Local Storage except critical auth
      const theme = localStorage.getItem('garala_theme');
      localStorage.clear();
      if (theme) localStorage.setItem('garala_theme', theme);
      
      updateStorageStats();
      showToast("Cache et données temporaires effacés", "success");
  };

  // Theme Management
  const [theme, setTheme] = useState<Theme>(() => {
      if (typeof window !== 'undefined') {
          const saved = localStorage.getItem('garala_theme');
          if (saved) return saved as Theme;
          return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      return 'light';
  });

  // Search History
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
      if (typeof window !== 'undefined') {
          const saved = localStorage.getItem('garala_search_history');
          return saved ? JSON.parse(saved) : ['iPhone 13', 'Terrain Bimbo', 'Groupe électrogène', 'Toyota'];
      }
      return [];
  });

  // Apply Theme
  useEffect(() => {
      if (theme === 'dark') {
          document.documentElement.classList.add('dark');
      } else {
          document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('garala_theme', theme);
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
          metaThemeColor.setAttribute('content', theme === 'dark' ? '#000000' : '#ec5a13');
      }
  }, [theme]);

  const addToSearchHistory = (term: string) => {
      setSearchHistory(prev => {
          const newHistory = [term, ...prev.filter(t => t !== term)].slice(0, 10);
          localStorage.setItem('garala_search_history', JSON.stringify(newHistory));
          return newHistory;
      });
  };

  const clearSearchHistory = () => {
      setSearchHistory([]);
      localStorage.removeItem('garala_search_history');
      showToast('Historique effacé', 'info');
  };

  // User State
  const [user, setUser] = useState<User | null>({
    id: 'u_demo_verified',
    name: 'Jean Testeur',
    email: 'jean@garala.cf',
    phoneNumber: '75 00 00 00',
    avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=Jean',
    isPro: false,
    isVerified: true,
    verificationStatus: 'verified',
    notificationPreferences: {
      messages: true,
      relevantAds: true,
      news: true,
      security: true
    },
    securitySettings: {
        isAppLockEnabled: false,
        useBiometrics: false,
        lockTimeout: 0 
    }
  });
  
  // App Lock & Security Verification State
  const [isAppLocked, setIsAppLocked] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCallback, setVerificationCallback] = useState<(() => void) | null>(null);
  const backgroundTimeRef = useRef<number | null>(null);

  // Verify Security Action
  const verifySecurity = (onSuccess: () => void) => {
      if (user?.securitySettings?.isAppLockEnabled) {
          setVerificationCallback(() => onSuccess);
          setIsVerifying(true);
      } else {
          onSuccess(); // No security enabled, proceed
      }
  };

  const cancelVerification = () => {
      setIsVerifying(false);
      setVerificationCallback(null);
  };

  const onVerificationSuccess = () => {
      setIsVerifying(false);
      if (verificationCallback) verificationCallback();
      setVerificationCallback(null);
  };

  // Initial Lock
  useEffect(() => {
    if (user?.securitySettings?.isAppLockEnabled) {
        setIsAppLocked(true);
    }
  }, []);

  // Auto-lock logic
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!user?.securitySettings?.isAppLockEnabled) return;

      if (document.hidden) {
        backgroundTimeRef.current = Date.now();
      } else {
        if (backgroundTimeRef.current) {
          const timeInBackground = Date.now() - backgroundTimeRef.current;
          const timeout = user.securitySettings.lockTimeout || 0;

          if (timeInBackground > timeout) {
            setIsAppLocked(true);
          }
          backgroundTimeRef.current = null;
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [user]);

  const unlockApp = () => setIsAppLocked(false);
  const lockApp = () => setIsAppLocked(true);
  const toggleOfflineMode = () => {
      setOfflineMode(prev => {
          const newValue = !prev;
          showToast(newValue ? "Mode Hors Ligne Activé (App déconnectée)" : "Connexion Rétablie", newValue ? "info" : "success");
          return newValue;
      });
  };

  // Mock Notifications
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', title: 'Bienvenue sur Garala', message: 'Votre compte a été créé avec succès.', date: 'Il y a 2 min', read: false, type: 'success' },
  ]);
  
  const [currentInfoPage, setCurrentInfoPage] = useState<InfoPageKey | null>(null);
  const isTrialPeriod = Date.now() < (APP_LAUNCH_DATE + (90 * 24 * 3600 * 1000));

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const toggleFavorite = (adId: string) => {
    setFavorites(prev => {
      if (prev.includes(adId)) {
        showToast("Retiré des favoris", "info");
        return prev.filter(id => id !== adId);
      } else {
        showToast("Ajouté aux favoris", "success");
        return [...prev, adId];
      }
    });
  };

  const isFavorite = (adId: string) => favorites.includes(adId);

  const login = (userData: Partial<User>) => {
    setUser({
      id: 'u_' + Date.now(),
      name: userData.name || 'Utilisateur',
      email: userData.email,
      phoneNumber: userData.phoneNumber || '',
      avatar: userData.avatar || `https://api.dicebear.com/9.x/micah/svg?seed=${userData.name || 'User'}`,
      isPro: false,
      isVerified: userData.isVerified || false,
      verificationStatus: userData.verificationStatus || 'none',
      notificationPreferences: {
        messages: true,
        relevantAds: true,
        news: true,
        security: true
      },
      securitySettings: {
        isAppLockEnabled: false,
        useBiometrics: false,
        lockTimeout: 0
      }
    });
  };

  const logout = () => {
    setUser(null);
    setIsAppLocked(false);
    showToast("Déconnexion réussie", "info");
  };

  const deleteAccount = () => {
    setUser(null);
    setShops([]);
    setFavorites([]);
    setNotifications([]);
    setIsAppLocked(false);
    showToast("Compte supprimé définitivement", "info");
  };

  const resetSettings = () => {
     if(!user) return;
     updateUser({
         notificationPreferences: { messages: true, relevantAds: true, news: true, security: true },
         securitySettings: { isAppLockEnabled: false, useBiometrics: false, lockTimeout: 0, appLockPin: undefined }
     });
     setTheme('light');
     showToast("Paramètres réinitialisés par défaut", "success");
  };

  const updateUser = (data: Partial<User>) => {
      if (!user) return;
      setUser(prev => prev ? ({ ...prev, ...data }) : null);
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
        showToast("Notifications non supportées", "error");
        return;
    }
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
        showToast("Notifications activées", "success");
    } else {
        showToast("Permission refusée", "info");
    }
  };

  const addAd = (ad: Ad) => setAds(prev => [ad, ...prev]);
  const deleteAd = (id: string) => {
    setAds(prev => prev.filter(ad => ad.id !== id));
    showToast("Annonce supprimée", "success");
  };
  const updateAd = (updatedAd: Ad) => {
      setAds(prev => prev.map(ad => ad.id === updatedAd.id ? updatedAd : ad));
      showToast("Annonce mise à jour", "success");
  };
  const boostAd = (adId: string, planId: string) => {
      setAds(prev => prev.map(ad => {
          if (ad.id === adId) return { ...ad, isBoosted: true, boostPlanId: planId };
          return ad;
      }));
  };
  const markNotificationRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const openInfoPage = (key: InfoPageKey) => setCurrentInfoPage(key);
  const closeInfoPage = () => setCurrentInfoPage(null);
  const createShop = (shopData: Omit<Shop, 'id' | 'createdAt' | 'ownerId'>) => {
      if (!user) return;
      const newShop: Shop = {
          id: 'shop_' + Date.now(),
          ownerId: user.id,
          createdAt: Date.now(),
          ...shopData
      };
      setShops(prev => [...prev, newShop]);
      setUser(prev => prev ? ({ ...prev, shopId: newShop.id, isPro: true, subscriptionPlan: 'basic' }) : null);
      showToast('Boutique créée avec succès !', 'success');
  };
  const userAds = user ? ads.filter(ad => ad.sellerName === user.name || (ad.ownerId === user.id)) : [];

  const uiContextValueBase: Omit<UIContextType, 'conversations' | 'unreadMessagesCount' | 'markConversationAsRead'> & { user: User | null } = {
    showToast,
    favorites,
    toggleFavorite,
    isFavorite,
    user,
    login,
    logout,
    updateUser,
    deleteAccount,
    requestNotificationPermission,
    isAppLocked,
    unlockApp,
    lockApp,
    verifySecurity,
    isVerifying,
    cancelVerification,
    offlineMode,
    toggleOfflineMode,
    userAds,
    deleteAd,
    updateAd,
    boostAd,
    notifications,
    markNotificationRead,
    searchHistory,
    addToSearchHistory,
    clearSearchHistory,
    storageUsage,
    clearCache,
    resetSettings,
    theme,
    setTheme,
    openInfoPage,
    closeInfoPage,
    shops,
    createShop,
    isTrialPeriod
  };

  return (
    <UIProvider value={uiContextValueBase}>
      <HashRouter>
        {/* Main App Lock (Full Screen Blocker) */}
        {isAppLocked && user && <AppLockScreen mode="lock" onSuccess={unlockApp} />}
        
        {/* Verification Modal (Overlay for sensitive actions) */}
        {isVerifying && user && <AppLockScreen mode="verify" onSuccess={onVerificationSuccess} onCancel={cancelVerification} />}

        <Layout isChatOpen={isChatOpen}>
          <Routes>
            <Route path="/" element={<HomePage ads={ads} />} />
            <Route path="/ad/:id" element={<AdDetailsPage ads={ads} />} />
            <Route path="/poster" element={<PostAdPage onAddAd={addAd} />} />
            <Route path="/modifier/:id" element={<EditAdPage ads={ads} />} />
            <Route path="/favoris" element={<FavoritesPage ads={ads} />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/messages" element={<MessagesPage onChatOpen={setIsChatOpen} />} />
            <Route path="/mes-annonces" element={<MyAdsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/paiements" element={<PaymentsPage />} />
            <Route path="/parametres" element={<SettingsPage />} />
            <Route path="/recherches" element={<SearchPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/creer-boutique" element={<CreateShopPage />} />
            <Route path="/ma-boutique" element={<ShopDashboardPage />} />
            <Route path="/publicite" element={<AdsPage />} />
            <Route path="/immo" element={<ImmoPage />} />
            <Route path="/recrutement" element={<RecruitmentPage />} />
          </Routes>
        </Layout>
        <ToastContainer toasts={toasts} removeToast={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />
        <InfoModal pageKey={currentInfoPage} onClose={closeInfoPage} />
      </HashRouter>
    </UIProvider>
  );
};

export default App;
