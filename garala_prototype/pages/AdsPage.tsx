
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Megaphone, TrendingUp, Target, Layout, CheckCircle, Send, Loader2, BarChart3, Smartphone, MousePointerClick } from 'lucide-react';
import { useUI } from '../UIContext';

export const AdsPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast, offlineMode } = useUI();
  const [loading, setLoading] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    company: '',
    phone: '',
    email: '',
    message: ''
  });

  const handleFormatSelect = (formatId: string) => {
    setSelectedFormat(formatId);
    // Scroll to form
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (offlineMode) {
        showToast("Connexion requise pour envoyer une demande. Veuillez désactiver le mode hors ligne.", "error");
        return;
    }
    if (!formData.company || !formData.phone) {
        showToast("Veuillez remplir le nom de l'entreprise et le téléphone", "error");
        return;
    }
    
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500)); // Simulate API call
    setLoading(false);
    
    showToast("Demande envoyée ! Notre équipe commerciale vous contactera.", "success");
    setFormData({ company: '', phone: '', email: '', message: '' });
    setSelectedFormat(null);
  };

  const stats = [
    { label: "Utilisateurs Actifs", value: "50k+", icon: <UsersIcon /> },
    { label: "Vues Mensuelles", value: "1.2M", icon: <EyeIcon /> },
    { label: "Taux de Clic Moyen", value: "4.5%", icon: <MousePointerClick size={20} /> },
  ];

  const formats = [
    {
      id: 'banner_home',
      title: "Bannière d'Accueil",
      price: "150 000 FCFA / semaine",
      description: "Visibilité maximale dès l'ouverture de l'application. Idéal pour le lancement de produit ou la notoriété de marque.",
      icon: <Layout size={24} />,
      color: "bg-blue-50 text-blue-600",
      features: ["Emplacement Premium (Top Page)", "Redirection vers votre site/page", "Rapport de performance"]
    },
    {
      id: 'push_notif',
      title: "Notification Push",
      price: "50 000 FCFA / envoi",
      description: "Envoyez un message direct sur le téléphone de nos utilisateurs ciblés par quartier ou intérêt.",
      icon: <Smartphone size={24} />,
      color: "bg-garala-50 text-garala-600",
      features: ["Taux d'ouverture élevé (>20%)", "Ciblage géographique (ex: Bangui)", "Message court + Image"]
    },
    {
      id: 'sponsored_search',
      title: "Sponsoring Recherche",
      price: "100 000 FCFA / mois",
      description: "Apparaissez en premier lorsque les utilisateurs cherchent des mots-clés liés à votre activité (ex: 'Voiture', 'Maison').",
      icon: <Target size={24} />,
      color: "bg-purple-50 text-purple-600",
      features: ["Trafic qualifié (Intention d'achat)", "Badge 'Annonceur'", "Mots-clés illimités"]
    }
  ];

  return (
    <div className="min-h-screen bg-[#f5f6f7] py-6 pb-24">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
            <button 
                onClick={() => navigate(-1)} 
                className="p-2 -ml-2 bg-white rounded-full shadow-sm text-gray-900 hover:bg-gray-50 transition-colors"
            >
                <ChevronLeft size={24} />
            </button>
            <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                Garala Publicité
            </h1>
        </div>

        {/* Hero Section */}
        <div className="bg-black text-white rounded-3xl p-8 mb-8 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-garala-500 rounded-full blur-[80px] opacity-40 -mr-16 -mt-16 pointer-events-none"></div>
            <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold mb-4 border border-white/20">
                    <Megaphone size={14} className="text-garala-400" />
                    Solution Business
                </div>
                <h2 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
                    Propulsez votre marque<br/>
                    <span className="text-garala-500">au cœur de Bangui.</span>
                </h2>
                <p className="text-gray-300 mb-8 max-w-lg leading-relaxed">
                    Touchez une audience locale, connectée et prête à consommer. Garala est le média #1 pour atteindre les acheteurs en République Centrafricaine.
                </p>
                <button 
                    onClick={() => document.getElementById('formats')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors active:scale-95"
                >
                    Voir nos offres
                </button>
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 md:gap-6 mb-12">
            {stats.map((stat, idx) => (
                <div key={idx} className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                    <div className="text-gray-400 mb-2">
                        {stat.icon}
                    </div>
                    <span className="text-2xl md:text-3xl font-black text-gray-900">{stat.value}</span>
                    <span className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-wide mt-1">{stat.label}</span>
                </div>
            ))}
        </div>

        {/* Formats Section */}
        <div id="formats" className="mb-12">
            <div className="text-center mb-8">
                <h3 className="text-2xl font-black text-gray-900 mb-2">Nos Formats Publicitaires</h3>
                <p className="text-gray-500">Choisissez la solution adaptée à vos objectifs.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {formats.map((format) => (
                    <div key={format.id} className={`bg-white rounded-3xl p-6 border-2 transition-all hover:shadow-lg flex flex-col ${selectedFormat === format.id ? 'border-garala-500 ring-4 ring-garala-50' : 'border-gray-100'}`}>
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${format.color}`}>
                            {format.icon}
                        </div>
                        <h4 className="text-xl font-black text-gray-900 mb-2">{format.title}</h4>
                        <p className="text-sm text-gray-500 mb-4 flex-grow">{format.description}</p>
                        
                        <div className="bg-gray-50 rounded-xl p-3 mb-6">
                            <span className="block text-xs font-bold text-gray-400 uppercase mb-1">À partir de</span>
                            <span className="block text-lg font-black text-gray-900">{format.price}</span>
                        </div>

                        <ul className="space-y-3 mb-6">
                            {format.features.map((feat, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-700 font-medium">
                                    <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                                    {feat}
                                </li>
                            ))}
                        </ul>

                        <button 
                            onClick={() => handleFormatSelect(format.id)}
                            className={`w-full py-3 rounded-xl font-bold transition-all active:scale-95 ${selectedFormat === format.id ? 'bg-garala-500 text-white' : 'bg-black text-white hover:bg-gray-800'}`}
                        >
                            {selectedFormat === format.id ? 'Sélectionné' : 'Choisir ce format'}
                        </button>
                    </div>
                ))}
            </div>
        </div>

        {/* Contact Form */}
        <div id="contact-form" className="bg-white rounded-3xl p-6 md:p-8 shadow-lg border border-gray-100">
            <div className="text-center mb-8">
                <h3 className="text-2xl font-black text-gray-900 mb-2">Lancez votre campagne</h3>
                <p className="text-gray-500">Remplissez ce formulaire, notre régie publicitaire vous rappellera sous 24h.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Entreprise <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={formData.company}
                            onChange={(e) => setFormData({...formData, company: e.target.value})}
                            placeholder="Nom de votre société"
                            className="w-full p-3.5 bg-gray-50 rounded-xl border-none font-bold text-gray-900 focus:ring-2 focus:ring-garala-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Téléphone <span className="text-red-500">*</span></label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            placeholder="75 00 00 00"
                            className="w-full p-3.5 bg-gray-50 rounded-xl border-none font-bold text-gray-900 focus:ring-2 focus:ring-garala-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Email (Optionnel)</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="contact@entreprise.cf"
                        className="w-full p-3.5 bg-gray-50 rounded-xl border-none font-medium text-gray-900 focus:ring-2 focus:ring-garala-500"
                    />
                </div>

                <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Message ou Besoin</label>
                    <textarea
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        placeholder={selectedFormat ? `Je suis intéressé par le format : ${formats.find(f => f.id === selectedFormat)?.title}...` : "Décrivez votre projet..."}
                        className="w-full p-3.5 bg-gray-50 rounded-xl border-none font-medium text-gray-900 focus:ring-2 focus:ring-garala-500 resize-none"
                    />
                </div>

                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-garala-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-garala-200 hover:bg-garala-600 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                    {loading ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
                    Envoyer ma demande
                </button>
                <p className="text-center text-xs text-gray-400 mt-4">
                    En cliquant sur envoyer, vous acceptez d'être recontacté par l'équipe commerciale de Garala.
                </p>
            </form>
        </div>

      </div>
    </div>
  );
};

// Simple Icon Components for Stats
const UsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
);
