"use client";
import { useState, useEffect, use } from 'react';
import { supabase } from '../../../lib/supabase';
import Link from 'next/link';

interface Ad {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  image_url: string | null;
  seller_phone: string | null;
  transaction_type: string;
  created_at: string;
  clicks_count: number;
  groups: { name: string } | null;
}

export default function AdDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAd = async () => {
      const { data, error } = await supabase
        .from('ads')
        .select('*, groups(name)')
        .eq('id', id)
        .single();

      if (!error) setAd(data);
      setLoading(false);
    };
    fetchAd();
  }, [id]);

  // AXE 4 : Enregistrer la tension au clic
  const registerClick = async () => {
    if (!ad) return;
    try {
      await supabase.rpc('increment_clicks', { row_id: ad.id });
    } catch (e) {
      console.error(e);
    }
  };

  // AXE 3 : Générateur de Munition de Partage
  const shareMunition = () => {
    if (!ad) return;
    
    const shareText = `🔥 *BONNE AFFAIRE SUR GARALA SEARCH !*\n\n📦 *OBJET :* ${ad.title.toUpperCase()}\n💰 *PRIX :* ${ad.price > 0 ? ad.price.toLocaleString() + ' FCFA' : 'À discuter'}\n📢 *SOURCE :* ${ad.groups?.name || 'WhatsApp'}\n\n🔍 _Voir les photos et détails ici :_\n${window.location.origin}/ad/${ad.id}`;

    if (navigator.share) {
      navigator.share({
        title: ad.title,
        text: shareText,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareText);
      alert("🚀 MUNITION PRÊTE ! Le texte de vente a été copié. Collez-le dans vos groupes WhatsApp.");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-orange-100 border-t-orange-600"></div>
    </div>
  );

  if (!ad) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4 text-center text-black">
      <h1 className="text-6xl font-black mb-4">∅</h1>
      <p className="text-gray-500 font-bold uppercase tracking-widest mb-8">Annonce introuvable</p>
      <Link href="/" className="bg-black text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest">Retour au flux</Link>
    </div>
  );

  const whatsappUrl = `https://wa.me/${ad.seller_phone}?text=${encodeURIComponent(
    `Bonjour, je vous contacte via Garala pour votre annonce : *${ad.title.toUpperCase()}*. Est-elle disponible ?`
  )}`;

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-black font-sans pb-20">
      {/* Barre de navigation minimaliste */}
      <nav className="p-4 bg-white/80 backdrop-blur-md border-b sticky top-0 z-30 flex justify-between items-center">
        <Link href="/" className="text-orange-600 font-black uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
          Retour
        </Link>
        <button onClick={shareMunition} className="bg-gray-100 p-2 rounded-xl text-black hover:bg-gray-200 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
        </button>
      </nav>

      <main className="max-w-2xl mx-auto md:mt-6 bg-white md:rounded-[3rem] overflow-hidden shadow-sm border border-gray-100">
        {/* Image High-Res avec Skeleton */}
        <div className="relative w-full h-[500px] bg-gray-50">
          {ad.image_url ? (
            <img src={ad.image_url} alt={ad.title} className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-200 text-6xl font-black italic opacity-20">GARALA</div>
          )}
          <div className="absolute top-8 left-8 bg-black text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">
            {ad.category}
          </div>
        </div>

        {/* Détails du Signal */}
        <div className="p-8 md:p-12">
          <div className="flex justify-between items-center mb-4">
            <span className="text-orange-500 font-black text-[10px] uppercase tracking-[0.2em]">
              @{ad.groups?.name || 'Source WhatsApp'}
            </span>
            <span className="text-gray-300 text-[10px] font-bold uppercase">
              {new Date(ad.created_at).toLocaleDateString()}
            </span>
          </div>

          <h1 className="text-3xl font-black text-gray-900 leading-tight mb-4 uppercase tracking-tighter">
            {ad.title}
          </h1>

          <div className="text-5xl font-black text-black mb-10 tracking-tighter">
            {ad.price > 0 ? ad.price.toLocaleString() : '---'} <span className="text-sm font-bold text-gray-400">FCFA</span>
          </div>

          <div className="bg-gray-50 p-8 rounded-[2rem] mb-10 border border-gray-100">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 text-center">Description</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap font-medium text-lg">
              {ad.description}
            </p>
          </div>

          {/* Axe 4 : Feedback de Tension */}
          {ad.clicks_count > 0 && (
            <div className="flex items-center justify-center gap-3 mb-10 text-orange-600 bg-orange-50 py-4 rounded-2xl border border-orange-100">
              <span className="animate-bounce">🔥</span>
              <p className="text-xs font-black uppercase tracking-tighter">
                {ad.clicks_count} acheteurs potentiels sur ce produit
              </p>
            </div>
          )}

          {/* Action Synaptique Finale */}
          {ad.seller_phone ? (
            <div className="flex flex-col gap-3">
                <a 
                href={whatsappUrl}
                onClick={registerClick}
                target="_blank"
                className="block w-full bg-[#25D366] text-white text-center py-6 rounded-[2.5rem] font-black text-xl shadow-2xl shadow-green-200 hover:scale-95 transition-transform active:scale-90 uppercase tracking-widest"
                >
                Prendre sur WhatsApp
                </a>
                <button 
                    onClick={shareMunition}
                    className="w-full bg-white text-black border-2 border-gray-100 py-5 rounded-[2.5rem] font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all"
                >
                    Partager l'annonce 🚀
                </button>
            </div>
          ) : (
            <div className="w-full bg-gray-100 text-gray-300 text-center py-6 rounded-[2.5rem] font-black text-xl uppercase cursor-not-allowed">
              Numéro Masqué
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
