
import React, { useState, useEffect } from 'react';
import { CreditCard, TrendingUp, History, Rocket, ChevronLeft, Store, ShieldAlert, Check, Users, Star, Zap } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUI } from '../UIContext';
import { BOOST_PLANS, SUBSCRIPTION_PLANS } from '../constants';
import { BoostPlan, SubscriptionPlan } from '../types';

export const PaymentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, userAds, boostAd, showToast, offlineMode } = useUI();
  
  // Tabs: 'boost' | 'subscription' | 'history'
  const [activeTab, setActiveTab] = useState<'boost' | 'subscription' | 'history'>('boost');
  
  // Boost State
  const [selectedAdId, setSelectedAdId] = useState<string | null>(searchParams.get('adId'));
  const [selectedBoostPlan, setSelectedBoostPlan] = useState<BoostPlan | null>(null);

  // Subscription State
  const [selectedSubPlan, setSelectedSubPlan] = useState<SubscriptionPlan | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  // Check verification for boosts
  const isVerified = user?.isVerified;

  // Initial tab selection based on params
  useEffect(() => {
      if (searchParams.get('action') === 'boost') {
          setActiveTab('boost');
      } else if (searchParams.get('action') === 'sub') {
          setActiveTab('subscription');
      }
  }, [searchParams]);

  const handlePayBoost = async () => {
      if (offlineMode) {
          showToast("Connexion requise pour effectuer un paiement. Veuillez désactiver le mode hors ligne.", "error");
          return;
      }
      if (!selectedAdId || !selectedBoostPlan) return;
      
      setIsLoading(true);
      await new Promise(r => setTimeout(r, 1500)); // Simulate payment
      
      boostAd(selectedAdId, selectedBoostPlan.id);
      setIsLoading(false);
      showToast(`Annonce boostée : ${selectedBoostPlan.label}`, 'success');
      navigate('/mes-annonces');
  };

  const handlePaySub = async () => {
      if (offlineMode) {
          showToast("Connexion requise pour effectuer un paiement. Veuillez désactiver le mode hors ligne.", "error");
          return;
      }
      if (!selectedSubPlan) return;

      setIsLoading(true);
      await new Promise(r => setTimeout(r, 1500));
      
      // Here we would call subscribe function
      showToast(`Abonnement ${selectedSubPlan.name} activé !`, 'success');
      setIsLoading(false);
      navigate('/ma-boutique');
  };

  if (!user) {
      navigate('/login');
      return null;
  }

  return (
    <div className="min-h-screen bg-[#f5f6f7] py-6 pb-24">
      <div className="max-w-xl mx-auto px-4">
        
        <div className="flex items-center gap-3 mb-6">
            <button 
                onClick={() => navigate(-1)} 
                className="p-2 -ml-2 bg-white rounded-full shadow-sm text-gray-900 hover:bg-gray-50 transition-colors"
            >
                <ChevronLeft size={24} />
            </button>
            <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                <CreditCard className="text-garala-500" size={24} />
                Paiements & Services
            </h1>
        </div>

        {/* Tabs */}
        <div className="flex p-1 bg-white rounded-2xl shadow-sm mb-6 overflow-x-auto">
            <button 
                onClick={() => setActiveTab('boost')}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold whitespace-nowrap transition-colors flex items-center justify-center gap-2 ${activeTab === 'boost' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-50'}`}
            >
                <Rocket size={16} /> Boost
            </button>
            <button 
                onClick={() => setActiveTab('subscription')}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold whitespace-nowrap transition-colors flex items-center justify-center gap-2 ${activeTab === 'subscription' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-50'}`}
            >
                <Store size={16} /> Abonnements
            </button>
            <button 
                onClick={() => setActiveTab('history')}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold whitespace-nowrap transition-colors flex items-center justify-center gap-2 ${activeTab === 'history' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-50'}`}
            >
                <History size={16} /> Historique
            </button>
        </div>

        {/* CONTENT: BOOST */}
        {activeTab === 'boost' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                
                {/* Verification Gate */}
                {!isVerified ? (
                    <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100 text-center">
                        <ShieldAlert size={48} className="text-orange-500 mx-auto mb-4" />
                        <h3 className="text-lg font-black text-gray-900 mb-2">Identité requise</h3>
                        <p className="text-gray-600 mb-6 text-sm">
                            Pour booster vos annonces et apparaître en tête de liste, vous devez d'abord faire vérifier votre identité.
                        </p>
                        <button 
                            onClick={() => navigate('/login')}
                            className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-orange-200"
                        >
                            Vérifier mon profil
                        </button>
                    </div>
                ) : (
                    <>
                        {/* 1. Select Ad */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                                Choisissez l'annonce
                            </h3>
                            {userAds.length > 0 ? (
                                <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                    {userAds.map(ad => (
                                        <div 
                                            key={ad.id}
                                            onClick={() => setSelectedAdId(ad.id)}
                                            className={`p-3 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                                                selectedAdId === ad.id ? 'border-garala-500 bg-garala-50 ring-1 ring-garala-500' : 'border-gray-100 hover:bg-gray-50'
                                            }`}
                                        >
                                            <img src={ad.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover bg-gray-200" />
                                            <div className="flex-grow min-w-0">
                                                <p className="font-bold text-gray-900 truncate">{ad.title}</p>
                                                <p className="text-xs text-gray-500">{ad.price.toLocaleString()} F</p>
                                            </div>
                                            {selectedAdId === ad.id && <Check size={20} className="text-garala-500" />}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm italic">Vous n'avez aucune annonce active.</p>
                            )}
                        </div>

                        {/* 2. Select Plan */}
                        {selectedAdId && (
                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <span className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                                    Choisissez la puissance
                                </h3>
                                <div className="space-y-3">
                                    {BOOST_PLANS.map(plan => (
                                        <div 
                                            key={plan.id}
                                            onClick={() => setSelectedBoostPlan(plan)}
                                            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all relative ${
                                                selectedBoostPlan?.id === plan.id 
                                                ? 'border-garala-500 bg-white ring-2 ring-garala-500 ring-offset-2' 
                                                : `${plan.color} border-transparent opacity-90 hover:opacity-100`
                                            }`}
                                        >
                                            {plan.highlight && (
                                                <div className="absolute -top-3 right-4 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                                                    Populaire
                                                </div>
                                            )}
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-black text-lg">{plan.label}</span>
                                                <span className="font-black text-lg">{plan.price} F</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm font-medium opacity-80">
                                                <Zap size={14} />
                                                <span>{plan.frequency}</span>
                                                <span className="text-[10px] opacity-60">(1x = 30s)</span>
                                            </div>
                                            {plan.globalReach && (
                                                <div className="flex items-center gap-2 text-xs font-bold mt-1 text-purple-700">
                                                    <Star size={12} className="fill-current"/>
                                                    {plan.globalReach}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Pay Action */}
                        <div className="sticky bottom-4">
                            <button
                                onClick={handlePayBoost}
                                disabled={!selectedAdId || !selectedBoostPlan || isLoading}
                                className="w-full bg-black text-white py-4 rounded-2xl font-bold text-lg shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform"
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2"><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Traitement...</span>
                                ) : (
                                    <>
                                        Payer {selectedBoostPlan ? `${selectedBoostPlan.price} F` : ''}
                                        <ChevronLeft className="rotate-180" size={20} />
                                    </>
                                )}
                            </button>
                        </div>
                    </>
                )}
            </div>
        )}

        {/* CONTENT: SUBSCRIPTIONS */}
        {activeTab === 'subscription' && (
             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                 <div className="text-center mb-6">
                     <h2 className="text-xl font-black text-gray-900">Passez au niveau Pro</h2>
                     <p className="text-gray-500 text-sm">Gérez votre business comme un chef.</p>
                 </div>

                 <div className="space-y-4">
                     {SUBSCRIPTION_PLANS.map(plan => (
                         <div 
                            key={plan.id}
                            onClick={() => setSelectedSubPlan(plan)}
                            className={`bg-white rounded-3xl p-6 border-2 transition-all cursor-pointer ${
                                selectedSubPlan?.id === plan.id 
                                ? 'border-garala-500 shadow-lg ring-2 ring-garala-500 ring-offset-2' 
                                : 'border-gray-100 shadow-sm hover:border-gray-200'
                            }`}
                        >
                             <div className="flex justify-between items-start mb-4">
                                 <div>
                                     <h3 className="font-black text-xl text-gray-900">{plan.name}</h3>
                                     <p className="text-sm text-gray-500">{plan.description}</p>
                                 </div>
                                 <div className="text-right">
                                     <span className="block font-black text-2xl text-garala-600">{plan.price} F</span>
                                     <span className="text-xs text-gray-400">/ mois</span>
                                 </div>
                             </div>
                             
                             <ul className="space-y-2 mb-4">
                                 {plan.features.map((feat, i) => (
                                     <li key={i} className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                                         <Check size={16} className="text-green-500" />
                                         {feat}
                                     </li>
                                 ))}
                             </ul>
                             
                             {plan.id === 'sub_enterprise' && (
                                 <div className="bg-gray-100 p-2 rounded-lg flex items-center gap-2 text-xs font-bold text-gray-600 justify-center">
                                     <Users size={14} /> Idéal pour les équipes
                                 </div>
                             )}
                         </div>
                     ))}
                 </div>

                  <div className="sticky bottom-4 mt-6">
                    <button
                        onClick={handlePaySub}
                        disabled={!selectedSubPlan || isLoading}
                        className="w-full bg-garala-500 text-white py-4 rounded-2xl font-bold text-lg shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform"
                    >
                         {isLoading ? 'Traitement...' : 'S\'abonner maintenant'}
                    </button>
                </div>
             </div>
        )}

        {/* CONTENT: HISTORY */}
        {activeTab === 'history' && (
             <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in">
                <div className="p-4 border-b border-gray-50">
                    <h3 className="font-bold text-gray-900">Historique des transactions</h3>
                </div>
                {/* Mock Data */}
                {[
                    { label: 'Boost Standard (iPhone 13)', amount: -250, date: 'Auj. 10:30', icon: <Rocket size={16}/>, color: 'text-blue-600 bg-blue-50' },
                    { label: 'Abonnement Pro Basique', amount: -2000, date: '01 Mars', icon: <Store size={16}/>, color: 'text-garala-600 bg-garala-50' },
                    { label: 'Boost Premium (Terrain)', amount: -500, date: '28 Fév', icon: <Rocket size={16}/>, color: 'text-green-600 bg-green-50' },
                ].map((tx, idx) => (
                    <div key={idx} className="p-4 border-b border-gray-50 last:border-none flex items-center justify-between hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.color}`}>
                                {tx.icon}
                            </div>
                            <div>
                                <p className="font-bold text-gray-800 text-sm">{tx.label}</p>
                                <p className="text-xs text-gray-400">{tx.date}</p>
                            </div>
                        </div>
                        <span className="font-black text-gray-900 text-sm">{tx.amount} F</span>
                    </div>
                ))}
             </div>
        )}

      </div>
    </div>
  );
};
