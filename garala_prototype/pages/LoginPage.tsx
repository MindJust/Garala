

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, User, Phone, Loader2, Check, ArrowRight, Mail, Lock, ShieldCheck, Shield, Camera, X, Lightbulb, RefreshCw, Send, Image as ImageIcon } from 'lucide-react';
import { useUI } from '../UIContext';
import { GaralaLogo } from '../components/GaralaLogo';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, showToast, offlineMode } = useUI();
  const [step, setStep] = useState(1);
  // Steps: 1 (Credentials), 2 (Profile & Photo), 3 (Verify Intro), 4 (Verify Camera)
  const totalSteps = 3; 
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'scanning_face' | 'scanning_id' | 'success'>('idle');

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phoneNumber: '',
    avatar: '',
  });

  const vibrate = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(15);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const nextStep = () => {
    if (!isStepValid()) {
        showToast("Veuillez remplir les champs obligatoires", "error");
        vibrate();
        return;
    }
    if (step < totalSteps) {
        setStep(step + 1);
        vibrate();
    }
  };

  const prevStep = () => {
    if (step === 4) {
        stopCamera();
        setStep(3);
    } else if (step > 1) {
        setStep(step - 1);
    } else {
        navigate('/menu');
    }
  };

  const isStepValid = () => {
      switch(step) {
          case 1:
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(formData.email) && formData.password.length >= 6;
          case 2:
            return formData.name.length >= 2;
          default:
            return true;
      }
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (offlineMode) {
          showToast("Mode hors ligne", "error");
          return;
      }
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const url = URL.createObjectURL(file);
          setFormData({ ...formData, avatar: url });
      }
  };

  const startCamera = async () => {
    if (offlineMode) {
        showToast("Connexion requise pour la vérification.", "error");
        return;
    }
    setIsVerifying(true);
    setVerificationStatus('idle');
    setStep(4);
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        runVerificationSequence();
    } catch (err) {
        console.error(err);
        showToast("Impossible d'accéder à la caméra", "error");
        setStep(3);
        setIsVerifying(false);
    }
  };

  const stopCamera = () => {
      if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
      }
      setIsVerifying(false);
  };

  const restartVerification = () => {
      setVerificationStatus('idle');
      if (!streamRef.current) startCamera();
      else runVerificationSequence();
  };

  const runVerificationSequence = async () => {
      setVerificationStatus('scanning_face');
      await new Promise(r => setTimeout(r, 4000));
      vibrate();
      
      setVerificationStatus('scanning_id');
      await new Promise(r => setTimeout(r, 4000));
      vibrate();

      setVerificationStatus('success');
  };

  const handleSkipVerification = () => {
      handleFinalLogin('none'); 
  };

  const handleConfirmVerification = () => {
      stopCamera();
      handleFinalLogin('pending');
  };

  const handleFinalLogin = async (verifStatus: 'pending' | 'none') => {
    if (offlineMode) {
        showToast("Connexion requise.", "error");
        return;
    }
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    
    login({
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        avatar: formData.avatar || undefined,
        isVerified: false,
        verificationStatus: verifStatus
    });
    
    setIsLoading(false);
    if (verifStatus === 'pending') showToast("Identité envoyée pour vérification", "success");
    else showToast("Compte créé !", "success");
    navigate('/menu');
  };

  const ProgressBar = () => (
    <div className="w-full bg-gray-100 h-2 sticky top-0 z-30">
      <div 
        className="bg-garala-500 h-2 transition-all duration-500 ease-out rounded-r-full shadow-[0_0_10px_rgba(236,90,19,0.5)]"
        style={{ width: `${(Math.min(step, 3) / 3) * 100}%` }}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f5f6f7] flex flex-col font-sans pb-6">
      {step <= 3 && <ProgressBar />}

      <div className="flex-grow max-w-xl mx-auto w-full md:py-8 md:px-4">
        <div className="bg-white md:rounded-3xl md:shadow-xl md:border md:border-gray-100 overflow-hidden min-h-[calc(100vh-80px)] md:min-h-auto flex flex-col relative">
            
            {step <= 3 && (
                <div className="px-6 py-4 flex items-center justify-between border-b border-gray-50 bg-white sticky top-0 z-20">
                    <button onClick={prevStep} className="p-2 -ml-2 hover:bg-gray-50 rounded-full transition-colors text-gray-800">
                        <ChevronLeft size={28} />
                    </button>
                    <span className="font-bold text-gray-900 text-sm tracking-wide">Étape {step} / {totalSteps}</span>
                    <div className="w-10" />
                </div>
            )}

            <div className="flex-grow flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* STEP 1: Credentials */}
                {step === 1 && (
                    <div className="p-6 md:p-8 space-y-8 mt-4">
                        <div className="text-center mb-8">
                            <div className="flex justify-center mb-6">
                                <GaralaLogo showText={false} className="h-24 w-auto drop-shadow-sm" />
                            </div>
                            <h1 className="text-3xl font-black text-gray-900 mb-2">Créer un compte</h1>
                            <p className="text-gray-500 font-medium">Commencez par sécuriser votre accès.</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2 ml-1">Email <span className="text-red-500">*</span></label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                        <Mail size={20} />
                                    </div>
                                    <input
                                        type="email"
                                        autoFocus
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        placeholder="exemple@email.com"
                                        className="w-full p-4 pl-12 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-garala-500 transition-all text-lg font-bold text-gray-900 placeholder-gray-300"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2 ml-1">Mot de passe <span className="text-red-500">*</span></label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                        <Lock size={20} />
                                    </div>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                        placeholder="••••••••"
                                        className="w-full p-4 pl-12 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-garala-500 transition-all text-lg font-bold text-gray-900 placeholder-gray-300"
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-2 ml-1">Minimum 6 caractères</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 2: Profile & Photo */}
                {step === 2 && (
                    <div className="p-6 md:p-8 space-y-8 mt-4">
                        <div className="text-center mb-6">
                            <label className="relative inline-block cursor-pointer group">
                                <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden border-4 border-white shadow-lg flex items-center justify-center">
                                    {formData.avatar ? (
                                        <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={40} className="text-gray-400" />
                                    )}
                                </div>
                                <div className="absolute bottom-0 right-0 bg-garala-500 p-2 rounded-full text-white shadow-md group-hover:scale-110 transition-transform">
                                    <ImageIcon size={16} />
                                </div>
                                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                            </label>
                            <h1 className="text-3xl font-black text-gray-900 mb-2 mt-4">Profil</h1>
                            <p className="text-gray-500 font-medium">Ajoutez une photo pour inspirer confiance.</p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2 ml-1">Nom complet <span className="text-red-500">*</span></label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                        <User size={20} />
                                    </div>
                                    <input
                                        type="text"
                                        autoFocus
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        placeholder="Votre nom"
                                        className="w-full p-4 pl-12 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-garala-500 transition-all text-lg font-bold text-gray-900 placeholder-gray-300"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2 ml-1">Téléphone <span className="text-gray-400 font-normal">(Optionnel)</span></label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                        <Phone size={20} />
                                    </div>
                                    <input
                                        type="tel"
                                        value={formData.phoneNumber}
                                        onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                                        placeholder="75 XX XX XX"
                                        className="w-full p-4 pl-12 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-garala-500 transition-all text-lg font-bold text-gray-900 placeholder-gray-300"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 3: Verification Intro */}
                {step === 3 && (
                    <div className="p-6 md:p-8 space-y-6 mt-4 flex flex-col h-full">
                         <div className="text-center flex-grow flex flex-col justify-center">
                             <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600 shadow-lg shadow-blue-100 relative">
                                <ShieldCheck size={48} />
                                <div className="absolute top-0 right-0 bg-yellow-400 p-2 rounded-full border-4 border-white">
                                    <Check size={16} className="text-white" strokeWidth={4} />
                                </div>
                            </div>
                            <h1 className="text-3xl font-black text-gray-900 mb-4">Devenez membre vérifié</h1>
                            <p className="text-gray-500 font-medium mb-6 leading-relaxed">
                                Obtenez le badge <span className="text-blue-600 font-bold bg-blue-50 px-1 rounded">Identité Vérifiée</span>.
                            </p>

                            <div className="bg-orange-50 p-4 rounded-2xl flex gap-3 text-orange-800 text-sm mb-6 text-left border border-orange-100 shadow-sm">
                                <Lightbulb size={24} className="flex-shrink-0 mt-0.5 text-orange-600" />
                                <p>
                                    Assurez-vous d'être dans un <strong>lieu bien éclairé</strong>.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 4: Live Camera Verification (Same as before) */}
                {step === 4 && (
                    <div className="fixed inset-0 bg-black z-50 flex flex-col">
                        <div className="absolute top-4 right-4 z-50">
                            <button onClick={() => { stopCamera(); setStep(3); }} className="text-white p-2 bg-white/20 rounded-full backdrop-blur-md">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="flex-grow relative overflow-hidden">
                            <video 
                                ref={videoRef}
                                autoPlay 
                                playsInline
                                muted
                                className="w-full h-full object-cover"
                            />
                            {/* Overlay UI simplified for brevity, same as previous version */}
                             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                {verificationStatus === 'success' && (
                                    <div className="flex flex-col items-center animate-in zoom-in duration-300 pointer-events-auto">
                                        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-500/50">
                                            <Check size={48} className="text-white" strokeWidth={4} />
                                        </div>
                                        <button 
                                            onClick={handleConfirmVerification}
                                            className="bg-white text-green-600 font-bold py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-gray-100 active:scale-95 transition-transform"
                                        >
                                            <Send size={20} />
                                            Confirmer
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

            </div>

            {/* Actions Footer */}
            {step <= 3 && (
                <div className="p-4 bg-white border-t border-gray-100 sticky bottom-0 z-50 md:static md:bg-transparent md:border-none">
                    {step < 3 ? (
                        <button
                            onClick={nextStep}
                            disabled={isLoading}
                            className={`w-full py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-all transform active:scale-95 shadow-xl ${
                                isStepValid()
                                ? 'bg-garala-500 text-white shadow-garala-200' 
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            Continuer
                            <ArrowRight size={24} />
                        </button>
                    ) : (
                        <div className="space-y-3">
                            <button
                                onClick={startCamera}
                                disabled={isLoading}
                                className="w-full py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-all transform active:scale-95 shadow-xl bg-blue-600 text-white shadow-blue-200"
                            >
                                <Camera size={24} />
                                Vérifier mon identité
                            </button>
                            <button
                                onClick={handleSkipVerification}
                                disabled={isLoading}
                                className="w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 text-gray-500 hover:bg-gray-50"
                            >
                                {isLoading ? <Loader2 size={24} className="animate-spin" /> : "Passer pour l'instant"}
                            </button>
                        </div>
                    )}
                </div>
            )}

        </div>
      </div>
    </div>
  );
};