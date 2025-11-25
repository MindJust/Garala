
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Briefcase, Search, Users, CheckCircle, Send, Loader2, FileText, UserCheck, Star, Upload, X, Paperclip } from 'lucide-react';
import { useUI } from '../UIContext';

export const RecruitmentPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast, offlineMode } = useUI();
  
  // Recruiter Form State
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    phone: '',
    email: '',
    needs: ''
  });

  // Candidate Form State
  const [candidateLoading, setCandidateLoading] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [candidateData, setCandidateData] = useState({
    name: '',
    phone: '',
    domain: 'Vente / Commerce',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const DOMAINS = [
    'Vente / Commerce',
    'Administration / Secrétariat',
    'Logistique / Transport',
    'Informatique / Tech',
    'BTP / Construction',
    'Hôtellerie / Restauration',
    'Santé',
    'Autre'
  ];

  // Recruiter Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (offlineMode) {
        showToast("Connexion requise pour envoyer une demande. Veuillez désactiver le mode hors ligne.", "error");
        return;
    }
    if (!formData.companyName || !formData.phone) {
        showToast("Veuillez remplir le nom de l'entreprise et le téléphone", "error");
        return;
    }
    
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500)); // Simulate API call
    setLoading(false);
    
    showToast("Demande envoyée ! Notre équipe RH vous contactera.", "success");
    setFormData({ companyName: '', phone: '', email: '', needs: '' });
  };

  // Candidate Submit
  const handleCandidateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (offlineMode) {
        showToast("Connexion requise pour envoyer votre CV. Veuillez désactiver le mode hors ligne.", "error");
        return;
    }
    if (!candidateData.name || !candidateData.phone || !cvFile) {
        showToast("Veuillez remplir votre nom, téléphone et ajouter un CV", "error");
        return;
    }

    setCandidateLoading(true);
    await new Promise(r => setTimeout(r, 2000)); // Simulate upload
    setCandidateLoading(false);

    showToast("CV envoyé avec succès ! Bonne chance.", "success");
    setCandidateData({ name: '', phone: '', domain: 'Vente / Commerce' });
    setCvFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (offlineMode) {
        showToast("Impossible d'uploader un fichier en mode hors ligne.", "error");
        return;
    }
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        if (file.size > 5 * 1024 * 1024) {
            showToast("Le fichier est trop lourd (Max 5Mo)", "error");
            return;
        }
        setCvFile(file);
    }
  };

  const removeFile = () => {
      setCvFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const services = [
    {
      title: "Diffusion d'offres",
      description: "Publiez vos offres d'emploi et touchez des milliers de candidats actifs à Bangui.",
      icon: <Briefcase size={24} />,
      color: "bg-teal-50 text-teal-600",
      features: ["Visibilité 30 jours", "Relai sur nos réseaux", "Format attractif"]
    },
    {
      title: "Accès CVthèque",
      description: "Recherchez proactivement les meilleurs profils dans notre base de données qualifiée.",
      icon: <Search size={24} />,
      color: "bg-indigo-50 text-indigo-600",
      features: ["Filtres par compétences", "Contacts directs", "Alertes nouveaux profils"]
    },
    {
      title: "Sourcing & Chasse",
      description: "Déléguez votre recrutement à nos experts pour les postes clés ou difficiles.",
      icon: <UserCheck size={24} />,
      color: "bg-rose-50 text-rose-600",
      features: ["Pré-qualification", "Entretiens", "Garantie de remplacement"]
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
                Espace Recrutement
            </h1>
        </div>

        {/* Hero Section */}
        <div className="bg-[#1e293b] text-white rounded-3xl p-8 mb-12 relative overflow-hidden shadow-xl">
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500 rounded-full blur-[80px] opacity-20 -mr-16 -mt-16 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500 rounded-full blur-[60px] opacity-30 -ml-10 -mb-10 pointer-events-none"></div>
            
            <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold mb-4 border border-white/20">
                    <Users size={14} className="text-teal-300" />
                    Solutions RH Garala
                </div>
                <h2 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
                    Trouvez les talents<br/>
                    <span className="text-teal-400">qui feront grandir votre entreprise.</span>
                </h2>
                <p className="text-gray-300 mb-8 max-w-lg leading-relaxed">
                    Recrutez efficacement en Centrafrique grâce à notre plateforme dédiée. 
                    Des profils vérifiés, du junior au cadre expérimenté.
                </p>
                <div className="flex flex-wrap gap-3">
                    <button 
                        onClick={() => document.getElementById('recruiter-form')?.scrollIntoView({ behavior: 'smooth' })}
                        className="bg-white text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors active:scale-95"
                    >
                        Publier une offre
                    </button>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                        <FileText size={16} className="text-teal-400" />
                        <span className="text-xs font-bold">+2000 CVs disponibles</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Services Grid */}
        <div className="mb-12">
            <div className="text-center mb-8">
                <h3 className="text-2xl font-black text-gray-900 mb-2">Nos Solutions Entreprises</h3>
                <p className="text-gray-500">Des outils adaptés à vos besoins de recrutement.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {services.map((service, idx) => (
                    <div key={idx} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${service.color}`}>
                            {service.icon}
                        </div>
                        <h4 className="text-xl font-black text-gray-900 mb-2">{service.title}</h4>
                        <p className="text-sm text-gray-500 mb-4 h-12">{service.description}</p>
                        
                        <ul className="space-y-3 pt-4 border-t border-gray-50">
                            {service.features.map((feat, i) => (
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

        {/* Candidate Section Banner */}
        <div className="bg-white rounded-3xl p-6 mb-8 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 text-amber-600">
                <Star size={32} className="fill-current" />
            </div>
            <div className="flex-grow text-center md:text-left">
                <h3 className="text-xl font-black text-gray-900 mb-1">Vous cherchez un emploi ?</h3>
                <p className="text-gray-500 text-sm">Créez votre profil candidat gratuit et recevez des alertes.</p>
            </div>
            <button 
                onClick={() => document.getElementById('candidate-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-colors whitespace-nowrap"
            >
                Déposer mon CV
            </button>
        </div>

        {/* Candidate Form */}
        <div id="candidate-form" className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 md:p-8 shadow-sm border border-amber-100 mb-12 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full opacity-50 -mr-10 -mt-10 pointer-events-none blur-2xl"></div>
             
             <div className="mb-8 relative z-10">
                <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold mb-2 text-amber-700 border border-amber-200">
                    <UserCheck size={14} />
                    Espace Candidat
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">Envoyez votre candidature spontanée</h3>
                <p className="text-gray-600">Votre CV sera ajouté à notre base de données et visible par 500+ recruteurs.</p>
            </div>

            <form onSubmit={handleCandidateSubmit} className="space-y-4 max-w-lg relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Nom complet <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={candidateData.name}
                            onChange={(e) => setCandidateData({...candidateData, name: e.target.value})}
                            placeholder="Votre Prénom et Nom"
                            className="w-full p-3.5 bg-white rounded-xl border-none font-bold text-gray-900 focus:ring-2 focus:ring-amber-500 shadow-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Téléphone <span className="text-red-500">*</span></label>
                        <input
                            type="tel"
                            value={candidateData.phone}
                            onChange={(e) => setCandidateData({...candidateData, phone: e.target.value})}
                            placeholder="75 00 00 00"
                            className="w-full p-3.5 bg-white rounded-xl border-none font-bold text-gray-900 focus:ring-2 focus:ring-amber-500 shadow-sm"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Domaine d'activité</label>
                    <select
                        value={candidateData.domain}
                        onChange={(e) => setCandidateData({...candidateData, domain: e.target.value})}
                        className="w-full p-3.5 bg-white rounded-xl border-none font-bold text-gray-900 focus:ring-2 focus:ring-amber-500 shadow-sm appearance-none"
                    >
                        {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Votre CV (PDF, Word, Image) <span className="text-red-500">*</span></label>
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        className="hidden"
                    />
                    
                    {!cvFile ? (
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full border-2 border-dashed border-amber-300 bg-white/50 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-amber-400 transition-all group"
                        >
                            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mb-2 group-hover:scale-110 transition-transform">
                                <Upload size={20} />
                            </div>
                            <span className="font-bold text-gray-700">Cliquez pour ajouter votre CV</span>
                            <span className="text-xs text-gray-400 mt-1">Max 5Mo</span>
                        </div>
                    ) : (
                        <div className="w-full bg-white rounded-xl p-4 flex items-center justify-between shadow-sm border border-amber-100">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-500 flex-shrink-0">
                                    <FileText size={20} />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-bold text-gray-900 truncate text-sm">{cvFile.name}</p>
                                    <p className="text-xs text-gray-400">{(cvFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>
                            <button 
                                type="button"
                                onClick={removeFile}
                                className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    )}
                </div>

                <button 
                    type="submit"
                    disabled={candidateLoading}
                    className="w-full bg-amber-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-amber-200 hover:bg-amber-600 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                    {candidateLoading ? <Loader2 size={24} className="animate-spin" /> : <Paperclip size={24} />}
                    Envoyer ma candidature
                </button>
            </form>
        </div>

        {/* Recruiter Form */}
        <div id="recruiter-form" className="bg-white rounded-3xl p-6 md:p-8 shadow-lg border border-gray-100 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-2 h-full bg-teal-500"></div>
            <div className="mb-8">
                <h3 className="text-2xl font-black text-gray-900 mb-2">Recruteurs : Contactez-nous</h3>
                <p className="text-gray-500">Remplissez ce formulaire pour activer votre espace recruteur ou poster une annonce.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Entreprise <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={formData.companyName}
                            onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                            placeholder="Nom de votre société"
                            className="w-full p-3.5 bg-gray-50 rounded-xl border-none font-bold text-gray-900 focus:ring-2 focus:ring-teal-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Téléphone <span className="text-red-500">*</span></label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            placeholder="75 00 00 00"
                            className="w-full p-3.5 bg-gray-50 rounded-xl border-none font-bold text-gray-900 focus:ring-2 focus:ring-teal-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Email Pro</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="rh@entreprise.cf"
                        className="w-full p-3.5 bg-gray-50 rounded-xl border-none font-medium text-gray-900 focus:ring-2 focus:ring-teal-500"
                    />
                </div>

                <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Vos besoins de recrutement</label>
                    <textarea
                        rows={3}
                        value={formData.needs}
                        onChange={(e) => setFormData({...formData, needs: e.target.value})}
                        placeholder="Quels profils recherchez-vous ? Combien de postes ?"
                        className="w-full p-3.5 bg-gray-50 rounded-xl border-none font-medium text-gray-900 focus:ring-2 focus:ring-teal-500 resize-none"
                    />
                </div>

                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-teal-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-teal-200 hover:bg-teal-700 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70"
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
