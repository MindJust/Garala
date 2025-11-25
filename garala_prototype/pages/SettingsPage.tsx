

import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Bell, Lock, Smartphone, Save, Loader2, ChevronLeft, MessageCircle, Megaphone, Trash2, AlertTriangle, EyeOff, Eye, ShieldCheck, Fingerprint, Moon, Sun, Monitor, Clock, HardDrive, Database, RotateCcw, Camera, Trash } from 'lucide-react';
import { useUI } from '../UIContext';
import { useNavigate } from 'react-router-dom';

export const SettingsPage: React.FC = () => {
  const { user, updateUser, requestNotificationPermission, showToast, deleteAccount, theme, setTheme, offlineMode, storageUsage, clearCache, resetSettings, verifySecurity } = useUI();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [permissionState, setPermissionState] = useState(Notification.permission);
  
  // Delete Account Modal State
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteName, setDeleteName] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // App Lock Setup Modal
  const [isLockSetupOpen, setIsLockSetupOpen] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  const [formData, setFormData] = useState({
      name: '',
      email: '',
      phone: '',
      notifMessages: true,
      notifAds: true,
      notifNews: true,
      notifSecurity: true,
      // Security
      isAppLockEnabled: false,
      useBiometrics: false,
      lockTimeout: 0
  });

  useEffect(() => {
    if (user) {
        setFormData({
            name: user.name,
            email: user.email || '',
            phone: user.phoneNumber,
            notifMessages: user.notificationPreferences.messages,
            notifAds: user.notificationPreferences.relevantAds,
            notifNews: user.notificationPreferences.news,
            notifSecurity: user.notificationPreferences.security,
            isAppLockEnabled: user.securitySettings?.isAppLockEnabled || false,
            useBiometrics: user.securitySettings?.useBiometrics || false,
            lockTimeout: user.securitySettings?.lockTimeout || 0,
        });
    }
  }, [user]);

  if (!user) {
    navigate('/menu');
    return null;
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (offlineMode) { showToast("Mode hors ligne", "error"); return; }
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const url = URL.createObjectURL(file);
          updateUser({ avatar: url });
          showToast("Photo de profil mise à jour", "success");
      }
  };

  const handleSave = async () => {
      if (offlineMode) {
          showToast("Connexion requise pour sauvegarder.", "error");
          return;
      }
      setLoading(true);
      // Simulate API call
      await new Promise(r => setTimeout(r, 800));
      
      updateUser({
          name: formData.name,
          email: formData.email,
          phoneNumber: formData.phone,
          notificationPreferences: {
              messages: formData.notifMessages,
              relevantAds: formData.notifAds,
              news: formData.notifNews,
              security: formData.notifSecurity
          },
          securitySettings: {
              ...user.securitySettings,
              isAppLockEnabled: formData.isAppLockEnabled,
              useBiometrics: formData.useBiometrics,
              lockTimeout: formData.lockTimeout
          }
      });
      
      setLoading(false);
      showToast('Profil et préférences mis à jour', 'success');
  };

  const handleRequestPermission = async () => {
      if (offlineMode) {
        showToast("Mode hors ligne", "error");
        return;
      }
      await requestNotificationPermission();
      setPermissionState(Notification.permission);
  };

  const handleDeleteAccount = async () => {
      if (offlineMode) {
          showToast("Mode hors ligne", "error");
          return;
      }
      if (deleteName !== user.name) {
          showToast("Le nom ne correspond pas.", "error");
          return;
      }
      if (deletePassword.length === 0) {
          showToast("Veuillez entrer votre mot de passe.", "error");
          return;
      }

      setIsDeleting(true);
      await new Promise(r => setTimeout(r, 2000));
      setIsDeleting(false);
      setDeleteModalOpen(false);
      deleteAccount();
      navigate('/');
  };

  const handleLockToggle = () => {
      if (!formData.isAppLockEnabled) {
          setIsLockSetupOpen(true);
          setNewPin('');
          setConfirmPin('');
      } else {
          // Verify before disabling
          verifySecurity(() => {
               setFormData({...formData, isAppLockEnabled: false, useBiometrics: false});
               updateUser({
                 securitySettings: { ...user.securitySettings, isAppLockEnabled: false, useBiometrics: false }
               });
               showToast("Verrouillage désactivé", "info");
          });
      }
  };

  const handlePinSetup = () => {
      if (newPin.length !== 4 || newPin !== confirmPin) return;

      const enableBiometrics = formData.useBiometrics;
      updateUser({
          securitySettings: {
              isAppLockEnabled: true,
              appLockPin: newPin,
              useBiometrics: enableBiometrics,
              lockTimeout: formData.lockTimeout
          }
      });
      setFormData(prev => ({ ...prev, isAppLockEnabled: true }));
      setIsLockSetupOpen(false);
      showToast("Application sécurisée avec succès !", "success");
  };

  const handleReset = () => {
      verifySecurity(() => {
          resetSettings();
      });
  };

  const handleClearCache = () => {
      verifySecurity(() => {
          clearCache();
      });
  }

  return (
    <div className="min-h-screen bg-[#f5f6f7] dark:bg-black py-6 pb-24 relative transition-colors">
      <div className="max-w-md mx-auto px-4">
        
        <div className="flex items-center gap-3 mb-6">
            <button 
                onClick={() => navigate(-1)} 
                className="p-2 -ml-2 bg-white dark:bg-gray-800 rounded-full shadow-sm text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
                <ChevronLeft size={24} />
            </button>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                <User className="text-garala-500" size={24} />
                Paramètres
            </h1>
        </div>

        <div className="space-y-6">
            
            {/* Appearance */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Apparence</h3>
                <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={() => setTheme('light')}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${theme === 'light' ? 'border-garala-500 bg-garala-50 dark:bg-garala-900/30 text-garala-700 dark:text-garala-400' : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-500'}`}
                    >
                        <Sun size={24} className="mb-2" />
                        <span className="text-xs font-bold">Clair</span>
                    </button>
                    <button 
                        onClick={() => setTheme('dark')}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${theme === 'dark' ? 'border-garala-500 bg-garala-50 dark:bg-garala-900/30 text-garala-700 dark:text-garala-400' : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-500'}`}
                    >
                        <Moon size={24} className="mb-2" />
                        <span className="text-xs font-bold">Sombre</span>
                    </button>
                </div>
            </div>

            {/* Personal Info & Avatar */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Informations Personnelles</h3>
                
                {/* Avatar Edit */}
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <img src={user.avatar} alt="Profile" className="w-24 h-24 rounded-full border-4 border-gray-100 dark:border-gray-700 object-cover" />
                        <label className="absolute bottom-0 right-0 bg-garala-500 p-2 rounded-full text-white cursor-pointer hover:bg-garala-600 shadow-md">
                            <Camera size={16} />
                            <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                        </label>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="relative">
                        <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl border-none font-bold text-gray-800 dark:text-white focus:ring-2 focus:ring-garala-500"
                        />
                    </div>
                    <div className="relative">
                        <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="email" 
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl border-none font-bold text-gray-800 dark:text-white focus:ring-2 focus:ring-garala-500"
                        />
                    </div>
                     <div className="relative">
                        <Smartphone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="tel" 
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl border-none font-bold text-gray-800 dark:text-white focus:ring-2 focus:ring-garala-500"
                        />
                    </div>
                </div>
            </div>

             {/* Storage & Data */}
             <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
                    <Database size={16} className="text-garala-500" /> Données & Stockage
                </h3>
                
                <div className="mb-6">
                    <div className="flex justify-between text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        <span>Utilisé: {(storageUsage.used / 1024 / 1024).toFixed(2)} MB</span>
                        <span>Total: {(storageUsage.quota / 1024 / 1024 / 1024).toFixed(1)} GB</span>
                    </div>
                    <div className="w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-garala-500 transition-all duration-500" style={{ width: `${storageUsage.percentage}%` }}></div>
                    </div>
                </div>

                <div className="space-y-3">
                    <button onClick={handleClearCache} className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm text-gray-600 dark:text-gray-300"><Trash size={16}/></div>
                            <div className="text-left">
                                <p className="text-sm font-bold text-gray-800 dark:text-white">Vider le cache</p>
                                <p className="text-xs text-gray-500">Images, fichiers temporaires</p>
                            </div>
                        </div>
                    </button>

                    <button onClick={handleReset} className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm text-gray-600 dark:text-gray-300"><RotateCcw size={16}/></div>
                            <div className="text-left">
                                <p className="text-sm font-bold text-gray-800 dark:text-white">Réinitialiser</p>
                                <p className="text-xs text-gray-500">Remettre les paramètres par défaut</p>
                            </div>
                        </div>
                    </button>
                </div>
            </div>

            {/* SECURITY SECTION */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck size={16} className="text-garala-500" /> Sécurité & Accès
                </h3>
                
                <div className="space-y-4">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg"><Lock size={18}/></div>
                            <div>
                                <p className="font-medium text-gray-700 dark:text-gray-200">Verrouillage de l'application</p>
                                <p className="text-[10px] text-gray-400">Code PIN ou Biométrie</p>
                            </div>
                        </div>
                        
                        {user.isVerified ? (
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={formData.isAppLockEnabled} 
                                    onChange={handleLockToggle} 
                                    className="sr-only peer" 
                                />
                                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-garala-500"></div>
                            </label>
                        ) : (
                            <button onClick={() => showToast("Fonction réservée aux utilisateurs vérifiés", "info")} className="text-[10px] bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-500 dark:text-gray-400 font-bold">
                                Réservé Pro
                            </button>
                        )}
                    </div>
                    
                    {formData.isAppLockEnabled && (
                         <>
                            <div className="flex items-center justify-between border-t border-gray-50 dark:border-gray-800 pt-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-500 rounded-lg"><Fingerprint size={18}/></div>
                                    <div>
                                        <p className="font-medium text-gray-700 dark:text-gray-200">Utiliser FaceID / TouchID</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={formData.useBiometrics} 
                                        onChange={(e) => setFormData({...formData, useBiometrics: e.target.checked})} 
                                        className="sr-only peer" 
                                    />
                                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-garala-500"></div>
                                </label>
                            </div>

                             <div className="flex items-center justify-between border-t border-gray-50 dark:border-gray-800 pt-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-50 dark:bg-purple-900/30 text-purple-500 rounded-lg"><Clock size={18}/></div>
                                    <div>
                                        <p className="font-medium text-gray-700 dark:text-gray-200">Délai de verrouillage</p>
                                    </div>
                                </div>
                                <select 
                                    value={formData.lockTimeout}
                                    onChange={(e) => setFormData({...formData, lockTimeout: Number(e.target.value)})}
                                    className="text-sm font-bold bg-gray-50 dark:bg-gray-800 border-none rounded-lg p-2 text-gray-800 dark:text-white focus:ring-2 focus:ring-garala-500"
                                >
                                    <option value={0}>Immédiat</option>
                                    <option value={60000}>1 Minute</option>
                                </select>
                            </div>
                         </>
                    )}
                </div>
            </div>

            <button 
                onClick={handleSave}
                disabled={loading}
                className="w-full bg-garala-500 hover:bg-garala-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-garala-200 dark:shadow-none transition-all active:scale-95 disabled:opacity-70"
            >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                Enregistrer les modifications
            </button>

            {/* Danger Zone */}
            <div className="mt-8 border-t border-red-100 dark:border-red-900/30 pt-8">
                 <div className="bg-red-50 dark:bg-red-900/10 rounded-3xl p-6 border border-red-100 dark:border-red-900/30">
                    <h3 className="font-bold text-red-900 dark:text-red-400 mb-2 flex items-center gap-2">
                        <AlertTriangle size={20} /> Zone de Danger
                    </h3>
                    <button 
                        onClick={() => setDeleteModalOpen(true)}
                        className="w-full bg-white dark:bg-gray-800 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/20 active:scale-95 transition-all"
                    >
                        <Trash2 size={18} />
                        Supprimer mon compte
                    </button>
                 </div>
            </div>

        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteModalOpen(false)}></div>
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 max-w-sm w-full relative z-10 shadow-2xl animate-in zoom-in duration-200">
                  <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500 dark:text-red-400">
                      <Trash2 size={32} />
                  </div>
                  <h2 className="text-xl font-black text-gray-900 dark:text-white text-center mb-2">Êtes-vous sûr ?</h2>
                  <p className="text-center text-gray-500 dark:text-gray-400 text-sm mb-6">
                      Pour confirmer, veuillez saisir votre nom complet et votre mot de passe.
                  </p>
                  
                  <div className="space-y-4 mb-6">
                       <div>
                           <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Nom Complet</label>
                           <input 
                                type="text"
                                placeholder={user.name}
                                value={deleteName}
                                onChange={(e) => setDeleteName(e.target.value)}
                                className="w-full p-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500"
                           />
                       </div>
                       <div>
                           <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Mot de passe</label>
                           <div className="relative">
                               <input 
                                    type={showDeletePassword ? "text" : "password"}
                                    value={deletePassword}
                                    onChange={(e) => setDeletePassword(e.target.value)}
                                    className="w-full p-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowDeletePassword(!showDeletePassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showDeletePassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                           </div>
                       </div>
                  </div>

                  <div className="flex gap-3">
                      <button 
                        onClick={() => setDeleteModalOpen(false)}
                        className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                          Annuler
                      </button>
                      <button 
                        onClick={handleDeleteAccount}
                        disabled={isDeleting || deleteName !== user.name || !deletePassword}
                        className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                          {isDeleting ? <Loader2 size={18} className="animate-spin" /> : 'Supprimer'}
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* App Lock Setup Modal */}
      {isLockSetupOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsLockSetupOpen(false)}></div>
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 max-w-sm w-full relative z-10 shadow-2xl animate-in zoom-in duration-200">
                  <div className="w-16 h-16 bg-garala-100 dark:bg-garala-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-garala-600 dark:text-garala-400">
                      <Lock size={32} />
                  </div>
                  <h2 className="text-xl font-black text-gray-900 dark:text-white text-center mb-2">Code de verrouillage</h2>
                  <p className="text-center text-gray-500 dark:text-gray-400 text-sm mb-6">
                      Définissez un code PIN à 4 chiffres pour sécuriser l'accès à l'application.
                  </p>
                  
                  <div className="space-y-4 mb-6">
                       <div>
                           <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Nouveau Code PIN</label>
                           <input 
                                type="tel"
                                maxLength={4}
                                placeholder="0000"
                                value={newPin}
                                onChange={(e) => {
                                    if (/^\d*$/.test(e.target.value)) setNewPin(e.target.value);
                                }}
                                className="w-full p-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 font-black text-center text-2xl tracking-widest text-gray-900 dark:text-white focus:ring-2 focus:ring-garala-500"
                           />
                       </div>
                       <div>
                           <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Confirmer le Code</label>
                           <input 
                                type="tel"
                                maxLength={4}
                                placeholder="0000"
                                value={confirmPin}
                                onChange={(e) => {
                                    if (/^\d*$/.test(e.target.value)) setConfirmPin(e.target.value);
                                }}
                                className={`w-full p-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 font-black text-center text-2xl tracking-widest text-gray-900 dark:text-white focus:ring-2 ${confirmPin && newPin !== confirmPin ? 'focus:ring-red-500 border-red-200' : 'focus:ring-garala-500'}`}
                           />
                       </div>
                  </div>

                  <div className="flex gap-3">
                      <button 
                        onClick={() => setIsLockSetupOpen(false)}
                        className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                          Annuler
                      </button>
                      <button 
                        onClick={handlePinSetup}
                        disabled={newPin.length !== 4 || newPin !== confirmPin}
                        className="flex-1 py-3 bg-garala-500 text-white font-bold rounded-xl hover:bg-garala-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                          Activer
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};