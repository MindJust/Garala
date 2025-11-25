
import React, { useEffect, useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { InfoPageKey } from '../types';
import { INFO_CONTENT } from '../constants';

interface InfoModalProps {
  pageKey: InfoPageKey | null;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ pageKey, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (pageKey) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [pageKey]);

  if (!pageKey || !INFO_CONTENT[pageKey]) return null;

  const content = INFO_CONTENT[pageKey];

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-end md:items-center justify-center transition-opacity duration-300 ${isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Content */}
      <div 
        className={`bg-white w-full md:w-[600px] max-h-[90vh] md:max-h-[80vh] md:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col relative transform transition-transform duration-300 ${isVisible ? 'translate-y-0' : 'translate-y-full md:translate-y-10'}`}
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-3xl z-10">
          <h2 className="text-xl font-black text-gray-900 line-clamp-1 pr-4">{content.title}</h2>
          <button 
            onClick={onClose}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto overflow-x-hidden custom-scrollbar">
            <div className="prose prose-orange max-w-none">
                <p className="whitespace-pre-line text-gray-700 leading-relaxed text-base">
                    {content.content}
                </p>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-100 flex justify-center">
                 <button 
                    onClick={onClose}
                    className="flex items-center gap-2 text-gray-400 hover:text-gray-900 font-bold text-sm transition-colors"
                 >
                    <ChevronDown size={16} />
                    Fermer
                 </button>
            </div>
        </div>
      </div>
    </div>
  );
};
