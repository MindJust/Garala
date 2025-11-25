

export type Theme = 'light' | 'dark';

export enum Category {
  ALL = 'Toutes catégories',
  VEHICLE = 'Véhicules',
  REAL_ESTATE = 'Immobilier',
  FASHION = 'Mode',
  ELECTRONICS = 'Électronique',
  HOME = 'Maison',
  HOBBIES = 'Loisirs',
  SERVICES = 'Services'
}

export interface GeoLocation {
  name: string;
  lat: number;
  lng: number;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  phoneNumber: string;
  avatar?: string;
  isPro: boolean;
  isVerified?: boolean;
  verificationStatus?: 'none' | 'pending' | 'verified' | 'rejected';
  shopId?: string;
  subscriptionPlan?: 'basic' | 'enterprise';
  notificationPreferences: {
    messages: boolean;
    relevantAds: boolean;
    news: boolean;
    security: boolean;
  };
  securitySettings?: {
    isAppLockEnabled: boolean;
    appLockPin?: string; // In a real app, this should be hashed
    useBiometrics: boolean;
    lockTimeout?: number; // 0 for immediate, 60000 for 1 minute
  };
}

export interface Shop {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  category: Category;
  image: string;
  createdAt: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'success' | 'alert';
}

export interface Message {
    id: string;
    senderId: string;
    senderName: string;
    senderAvatar?: string;
    content?: string;
    image?: string; // URL of image
    audio?: string; // URL of audio blob
    audioDuration?: number;
    type: 'text' | 'image' | 'audio' | 'system' | 'meeting';
    date: string;
    timestamp: number;
    isRead: boolean;
    adId?: string;
    adTitle?: string;
    adImage?: string;
    isMe: boolean;
    meetingDetails?: {
      date: string;
      time: string;
      location: string;
    };
}

export interface Conversation {
    id: string;
    participantName: string;
    participantAvatar: string;
    lastMessage: string;
    lastMessageDate: string;
    unreadCount: number;
    adTitle?: string;
    adId?: string;
    adImage?: string;
    isOnline?: boolean;
    isBlocked?: boolean;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  label: string;
  status: 'completed' | 'pending' | 'failed';
  type: 'boost' | 'sub' | 'credit';
}

export interface BoostPlan {
  id: string;
  price: number;
  label: string;
  frequency: string;
  globalReach?: string;
  color: string;
  highlight?: boolean;
}

export interface SubscriptionPlan {
  id: string;
  price: number;
  name: string;
  description: string;
  features: string[];
}

export interface Ad {
  id: string;
  title: string;
  price: number;
  description: string;
  category: Category;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  images: string[];
  date: string;
  sellerName: string;
  isPro: boolean;
  createdAt: number;
  phoneNumber: string;
  // New fields for logic
  ownerId?: string; // If null, it's anonymous
  expirationDate?: number; // If null, never expires
  isBoosted?: boolean;
  boostPlanId?: string;
  status?: 'active' | 'sold'; // New status field
  // Shop specific fields
  shopId?: string;
  stock?: number;
  colors?: string[];
  sizes?: string[];     // e.g. ["S", "M", "L", "42"]
  priceUnit?: string;   // e.g. "/ pièce", "/ mètre", "/ kg"
}

export type SortOption = 'relevance' | 'date_desc' | 'date_asc' | 'price_asc' | 'price_desc' | 'distance_asc';

export type InfoPageKey = 
  | 'ABOUT' 
  | 'JOIN_US' 
  | 'IMPACT' 
  | 'ADS' 
  | 'PRO_IMMO' 
  | 'RECRUITMENT' 
  | 'TERMS' 
  | 'RULES' 
  | 'PRIVACY' 
  | 'HELP' 
  | 'SECURITY' 
  | 'CONTACT';

export interface UIContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  favorites: string[];
  toggleFavorite: (adId: string) => void;
  isFavorite: (adId: string) => boolean;
  // User Context
  user: User | null;
  login: (userData: Partial<User>) => void; 
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  deleteAccount: () => void;
  requestNotificationPermission: () => Promise<void>;
  // App Lock Context
  isAppLocked: boolean;
  unlockApp: () => void;
  lockApp: () => void;
  verifySecurity: (onSuccess: () => void) => void; // New for verification
  isVerifying: boolean; // State for verification modal
  cancelVerification: () => void;
  // Offline Mode
  offlineMode: boolean;
  toggleOfflineMode: () => void;
  // Data Management
  userAds: Ad[];
  deleteAd: (id: string) => void;
  updateAd: (ad: Ad) => void;
  boostAd: (adId: string, planId: string) => void;
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  // Search History
  searchHistory: string[];
  addToSearchHistory: (term: string) => void;
  clearSearchHistory: () => void;
  // Storage & Cache
  storageUsage: { used: number, quota: number, percentage: number };
  clearCache: () => Promise<void>;
  resetSettings: () => void;
  // Theme
  theme: Theme;
  setTheme: (theme: Theme) => void;
  // Info Modal
  openInfoPage: (key: InfoPageKey) => void;
  closeInfoPage: () => void;
  // Shops
  shops: Shop[];
  createShop: (shop: Omit<Shop, 'id' | 'createdAt' | 'ownerId'>) => void;
  isTrialPeriod: boolean;
  // Messaging
  conversations: Conversation[];
  unreadMessagesCount: number;
  markConversationAsRead: (id: string) => void;
}