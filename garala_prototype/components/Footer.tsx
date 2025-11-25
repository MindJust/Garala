

import React from 'react';
import { Link } from 'react-router-dom';
import { GaralaLogo } from './GaralaLogo';
import { useUI } from '../UIContext';
import { InfoPageKey } from '../types';

export const Footer: React.FC = () => {
  const { openInfoPage } = useUI();

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-12 pb-24 md:pb-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">À propos de Garala</h3>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li><button onClick={() => openInfoPage('ABOUT')} className="hover:underline text-left hover:text-gray-900 dark:hover:text-white transition-colors">Qui sommes-nous ?</button></li>
              <li><button onClick={() => openInfoPage('JOIN_US')} className="hover:underline text-left hover:text-gray-900 dark:hover:text-white transition-colors">Nous rejoindre</button></li>
              <li><button onClick={() => openInfoPage('IMPACT')} className="hover:underline text-left hover:text-gray-900 dark:hover:text-white transition-colors">Impact environnemental</button></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Nos solutions</h3>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link to="/publicite" className="hover:underline text-left text-garala-600 dark:text-garala-500 font-bold">Publicité</Link>
              </li>
              <li>
                <Link to="/immo" className="hover:underline text-left font-medium hover:text-gray-900 dark:hover:text-white transition-colors">Garala Immo</Link>
              </li>
              <li><button onClick={() => openInfoPage('RECRUITMENT')} className="hover:underline text-left hover:text-gray-900 dark:hover:text-white transition-colors">Vos recrutements</button></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Informations légales</h3>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li><button onClick={() => openInfoPage('TERMS')} className="hover:underline text-left hover:text-gray-900 dark:hover:text-white transition-colors">Conditions générales</button></li>
              <li><button onClick={() => openInfoPage('RULES')} className="hover:underline text-left hover:text-gray-900 dark:hover:text-white transition-colors">Règles de diffusion</button></li>
              <li><button onClick={() => openInfoPage('PRIVACY')} className="hover:underline text-left hover:text-gray-900 dark:hover:text-white transition-colors">Politique de confidentialité</button></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Aide</h3>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li><button onClick={() => openInfoPage('HELP')} className="hover:underline text-left hover:text-gray-900 dark:hover:text-white transition-colors">Centre d'aide</button></li>
              <li><button onClick={() => openInfoPage('SECURITY')} className="hover:underline text-left hover:text-gray-900 dark:hover:text-white transition-colors">Sécurité</button></li>
              <li><button onClick={() => openInfoPage('CONTACT')} className="hover:underline text-left hover:text-gray-900 dark:hover:text-white transition-colors">Contact</button></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 text-center text-sm text-gray-500 dark:text-gray-400 flex flex-col items-center">
          <GaralaLogo className="h-8 w-auto mb-4" />
          <p>&copy; {new Date().getFullYear()} Garala. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};