
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Building, Key, TrendingUp, CheckCircle, Send, Loader2, Home, MapPin, Search } from 'lucide-react';
import { useUI } from '../UIContext';

export const ImmoPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast, offlineMode } = useUI();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    agencyName: '',
    phone: '',
    email: '',
    needs: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (offlineMode) {
        showToast("Connexion requise pour envoyer une demande. Veuillez désactiver le mode hors ligne.", "error");
        return;
    }
    if (!formData.agencyName || !formData.phone) {
        showToast("Veuillez remplir le nom de l'agence et le téléphone", "error");
        return;
    }
    
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500)); // Simulate API call
    setLoading(false);
    
    showToast("Demande envoyée ! Un expert Garala Immo vous contactera.", "success");
    setFormData({ agencyName: '', phone: '', email: '', needs: '' });
  };

  const solutions = [
    {
      title: "Compte Agence Certifié",
      description: "Obtenez le badge 'Pro Immo' et inspirez confiance aux locataires et acheteurs.",
      icon: <Building size={24} />,
      color: "bg-blue-50 text-blue-600",
      features: ["Profil Agence complet", "Badge de vérification", "Lien WhatsApp direct"]
    },
    {
      title: "Visibilité Premium",
      description: "Vos mandats exclusifs remontés automatiquement en tête de liste chaque semaine.",
      icon: <TrendingUp size={24} />,
      color: "bg-garala-50 text-garala-600",
      features: ["Boost Hebdomadaire", "Label 'Mandat Exclusif'", "Photos HD illimitées"]
    },
    {
      title: "Gestion de Flotte",
      description: "Un tableau de bord unique pour gérer les annonces de tous vos agents commerciaux.",
      icon: <Key size={24} />,
      color: "bg-purple-50 text-purple-600",
      features: ["Multi-utilisateurs", "Statistiques par agent", "Centralisation des leads"]
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
                Garala Immo
            </h1>
        </div>

        {/* Hero Section */}
        <div className="bg-gray-900 text-white rounded-3xl p-8 mb-12 relative overflow-hidden shadow-xl">
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[80px] opacity-30 -mr-16 -mt-16 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-garala-500 rounded-full blur-[60px] opacity-20 -ml-10 -mb-10 pointer-events-none"></div>
            
            <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold mb-4 border border-white/20">
                    <Home size={14} className="text-blue-300" />
                    Espace Professionnel
                </div>
                <h2 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
                    Digitalisez votre<br/>
                    <span className="text-blue-400">Agence Immobilière.</span>
                </h2>
                <p className="text-gray-300 mb-8 max-w-lg leading-relaxed">
                    Louez et vendez plus rapidement grâce à la puissance de Garala. 
                    Des outils conçus pour les agences, les courtiers et les bailleurs de Bangui.
                </p>
                <div className="flex flex-wrap gap-3">
                    <button 
                        onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                        className="bg-white text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors active:scale-95"
                    >
                        Devenir Partenaire
                    </button>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                        <MapPin size={16} className="text-garala-500" />
                        <span className="text-xs font-bold">+500 biens listés</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Solutions Grid */}
        <div className="mb-12">
            <div className="text-center mb-8">
                <h3 className="text-2xl font-black text-gray-900 mb-2">Solutions pour Pros</h3>
                <p className="text-gray-500">Optimisez votre activité immobilière.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {solutions.map((sol, idx) => (
                    <div key={idx} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${sol.color}`}>
                            {sol.icon}
                        </div>
                        <h4 className="text-xl font-black text-gray-900 mb-2">{sol.title}</h4>
                        <p className="text-sm text-gray-500 mb-4 h-16">{sol.description}</p>
                        
                        <ul className="space-y-3 pt-4 border-t border-gray-50">
                            {sol.features.map((feat, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-700 font-medium">
                                    <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                                    {feat}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>

        {/* Contact Form */}
        <div id="contact-form" className="bg-white rounded-3xl p-6 md:p-8 shadow-lg border border-gray-100 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
            <div className="mb-8">
                <h3 className="text-2xl font-black text-gray-900 mb-2">Rejoindre le réseau Garala Immo</h3>
                <p className="text-gray-500">Laissez-nous vos coordonnées, nous configurerons votre compte Pro.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Nom de l'agence <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={formData.agencyName}
                            onChange={(e) => setFormData({...formData, agencyName: e.target.value})}
                            placeholder="Immo Bangui..."
                            className="w-full p-3.5 bg-gray-50 rounded-xl border-none font-bold text-gray-900 focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Téléphone <span className="text-red-500">*</span></label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            placeholder="75 00 00 00"
                            className="w-full p-3.5 bg-gray-50 rounded-xl border-none font-bold text-gray-900 focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Email Pro</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="agence@email.com"
                        className="w-full p-3.5 bg-gray-50 rounded-xl border-none font-medium text-gray-900 focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Vos besoins</label>
                    <textarea
                        rows={3}
                        value={formData.needs}
                        onChange={(e) => setFormData({...formData, needs: e.target.value})}
                        placeholder="Combien de biens gérez-vous ? Quels sont vos objectifs ?"
                        className="w-full p-3.5 bg-gray-50 rounded-xl border-none font-medium text-gray-900 focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                </div>

                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                    {loading ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
                    Envoyer ma demande
                </button>
            </form>
        </div>

      </div>
    </div>
  );
};
