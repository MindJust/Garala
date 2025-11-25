

import React, { useState, useEffect } from 'react';
import { Lock, Fingerprint, Delete, AlertCircle, X } from 'lucide-react';
import { useUI } from '../UIContext';
import { GaralaLogo } from './GaralaLogo';

interface AppLockScreenProps {
    mode?: 'lock' | 'verify';
    onSuccess?: () => void;
    onCancel?: () => void;
}

export const AppLockScreen: React.FC<AppLockScreenProps> = ({ mode = 'lock', onSuccess, onCancel }) => {
  const { user, showToast } = useUI();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);

  useEffect(() => {
    if (window.PublicKeyCredential) {
      PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
        .then(available => setIsBiometricAvailable(available))
        .catch(console.error);
    }
    
    // Auto-trigger biometrics if enabled
    if (user?.securitySettings?.useBiometrics) {
        setTimeout(() => handleBiometricAuth(), 500);
    }
  }, []);

  const handleBiometricAuth = async () => {
    if (!window.PublicKeyCredential) return;

    try {
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      await navigator.credentials.get({
        publicKey: {
          challenge,
          timeout: 60000,
          userVerification: "required",
        }
      });
      
      if (onSuccess) onSuccess();
    } catch (e) {
      console.log("Biometric auth cancelled or failed", e);
    }
  };

  const handleNumClick = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      setError(false);
      
      if (newPin.length === 4) {
        validatePin(newPin);
      }
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setError(false);
  };

  const validatePin = (inputPin: string) => {
    if (user?.securitySettings?.appLockPin === inputPin) {
      if (navigator.vibrate) navigator.vibrate([50]);
      setTimeout(() => {
          if (onSuccess) onSuccess();
      }, 100);
    } else {
      if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
      setError(true);
      setTimeout(() => setPin(''), 400);
    }
  };

  const isVerifyMode = mode === 'verify';

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-between py-12 px-6 ${isVerifyMode ? 'bg-black/90 backdrop-blur-xl' : 'bg-garala-500'}`}>
      
      {isVerifyMode && onCancel && (
          <button 
            onClick={onCancel}
            className="absolute top-6 right-6 p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
          >
              <X size={24} />
          </button>
      )}

      {/* Header */}
      <div className="flex flex-col items-center mt-10">
         <div className="bg-white p-4 rounded-full shadow-lg mb-6">
            <Lock size={32} className="text-garala-500" />
         </div>
         {!isVerifyMode && (
             <GaralaLogo showText={true} className="h-12 w-auto mb-4 invert brightness-0 saturate-0 filter drop-shadow-sm" />
         )}
         <p className="text-white/80 font-medium text-center">
             {isVerifyMode ? "Confirmez votre identité pour continuer" : "Application verrouillée"}
         </p>
      </div>

      {/* Pin Dots */}
      <div className="flex gap-4 my-8">
        {[0, 1, 2, 3].map(i => (
          <div 
            key={i} 
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              pin.length > i 
                ? (error ? 'bg-red-300 scale-110' : 'bg-white scale-110') 
                : 'bg-white/30'
            }`}
          />
        ))}
      </div>

      {error && (
        <div className="absolute top-1/3 flex items-center gap-2 text-red-100 bg-red-900/20 px-4 py-2 rounded-full animate-bounce">
            <AlertCircle size={16} />
            <span className="text-sm font-bold">Code incorrect</span>
        </div>
      )}

      {/* Numpad */}
      <div className="w-full max-w-xs space-y-4">
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              onClick={() => handleNumClick(num.toString())}
              className="aspect-square rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl font-bold flex items-center justify-center transition-all active:scale-90 active:bg-white active:text-garala-500 backdrop-blur-sm"
            >
              {num}
            </button>
          ))}
          
          <div className="flex items-center justify-center">
             {/* Biometric Button */}
             {(isBiometricAvailable || user?.securitySettings?.useBiometrics) && (
                <button 
                  onClick={handleBiometricAuth}
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors active:scale-90"
                >
                  <Fingerprint size={32} />
                </button>
             )}
          </div>

          <button
              onClick={() => handleNumClick('0')}
              className="aspect-square rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl font-bold flex items-center justify-center transition-all active:scale-90 active:bg-white active:text-garala-500 backdrop-blur-sm"
            >
              0
          </button>

          <div className="flex items-center justify-center">
            <button 
              onClick={handleDelete}
              className="w-16 h-16 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors active:scale-90"
            >
              <Delete size={28} />
            </button>
          </div>
        </div>
        
        {!isVerifyMode && (
            <button 
                className="w-full py-4 text-white/60 text-sm font-medium hover:text-white transition-colors"
                onClick={() => showToast("Connectez-vous avec votre mot de passe pour réinitialiser", "info")}
            >
                Code oublié ?
            </button>
        )}
      </div>
    </div>
  );
};