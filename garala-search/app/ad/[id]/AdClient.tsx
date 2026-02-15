"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import Link from 'next/link';

interface Ad {
  id: number; title: string; description: string; price: number; category: string;
  image_url: string | null; seller_phone: string | null; created_at: string;
  clicks_count: number; groups: { name: string } | null;
}

export default function AdClient({ id, initialAd }: { id: string, initialAd: any }) {
  const [ad, setAd] = useState<Ad | null>(initialAd);
  const [loading, setLoading] = useState(!initialAd);
  const [captureSpeed, setCaptureSpeed] = useState<string>("2.1s");

  useEffect(() => {
    // Si le serveur n'a pas pu charger l'annonce, on réessaie côté client
    if (!initialAd) {
      const fetchAd = async () => {
        const { data, error } = await supabase
          .from('ads').select('*, groups(name)').eq('id', id).single();
        if (!error && data) {
          setAd(data);
          const randomSpeed = (1.8 + Math.random() * 0.9).toFixed(1);
          setCaptureSpeed(`${randomSpeed}s`);
        }
        setLoading(false);
      };
      fetchAd();
    } else {
      const randomSpeed = (1.8 + Math.random() * 0.9).toFixed(1);
      setCaptureSpeed(`${randomSpeed}s`);
    }
  }, [id, initialAd]);

  const registerClick = async () => {
    if (!ad) return;
    try { await supabase.rpc('increment_clicks', { row_id: ad.id }); } catch (e) {}
  };

  const fireMunition = () => {
    if (!ad) return;
    const shareText = `🔥 *TOP AFFAIRE SUR GARALA SEARCH* 🔍\n\n📦 *PRODUIT :* ${ad.title.toUpperCase()}\n💰 *PRIX :* ${ad.price > 0 ? ad.price.toLocaleString() + ' FCFA' : 'À DISCUTER'}\n📍 *SOURCE :* ${ad.groups?.name || 'WhatsApp'}\n\n👉 *VOIR LES PHOTOS ET DÉTAILS ICI :*\n${window.location.origin}/ad/${ad.id}\n\n_Garala : Le réflexe pour tout trouver._`;

    if (navigator.share) {
      navigator.share({ title: ad.title, text: shareText }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      alert("MUNITION COPIÉE.");
    }
  };

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center"><div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div></div>;

  if (!ad) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-8xl font-black text-gray-100">404</h1>
      <Link href="/" className="mt-4 font-black uppercase tracking-widest text-orange-600">Retour au flux</Link>
    </div>
  );

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": ad.title,
    "image": ad.image_url,
    "description": ad.description,
    "brand": { "@type": "Brand", "name": "Garala WhatsApp" },
    "offers": {
      "@type": "Offer",
      "url": typeof window !== 'undefined' ? window.location.href : '',
      "priceCurrency": "XAF",
      "price": ad.price,
      "itemCondition": "https://schema.org/UsedCondition",
      "availability": "https://schema.org/InStock",
      "areaServed": "Bangui, RCA"
    }
  };

  // LOGIQUE DU LIEN MAGIQUE : On ajoute l'URL à la fin pour forcer l'aperçu WhatsApp
  const whatsappUrl = `https://wa.me/${ad.seller_phone}?text=${encodeURIComponent(
  `Bonjour, je suis intéressé par votre annonce : *${ad.title.toUpperCase()}*\n\n🖼️ IMAGE : ${ad.image_url}\n\n🔍 DÉTAILS : ${window.location.origin}/ad/${ad.id}`
)}`;  
  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased pb-40 overflow-x-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* 1. L'IMAGE : 50% DU VIEWPORT + PINCH-TO-ZOOM */}
      <div className="relative w-full h-[50vh] bg-gray-50 overflow-hidden">
        <div className="absolute top-6 left-6 right-6 z-20 flex justify-between">
            <Link href="/" className="bg-white/90 backdrop-blur w-10 h-10 flex items-center justify-center rounded-full shadow-xl text-black">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
            </Link>
            <button onClick={fireMunition} className="bg-white/90 backdrop-blur w-10 h-10 flex items-center justify-center rounded-full shadow-xl text-orange-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
            </button>
        </div>
        {ad.image_url ? (
          <img src={ad.image_url} alt={ad.title} className="w-full h-full object-cover active:scale-150 transition-transform duration-300 cursor-zoom-in touch-none" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-200 font-black italic text-4xl">GARALA</div>
        )}
      </div>

      {/* 2. LE SIGNAL : DÉTAILS CRITIQUES */}
      <main className="p-6 max-w-2xl mx-auto text-black">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">@{ad.groups?.name || 'WhatsApp'}</span>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-gray-300 uppercase">{new Date(ad.created_at).toLocaleDateString()}</span>
            <span className="text-[7px] font-black text-green-500 uppercase tracking-tighter italic">Signal indexé en {captureSpeed}</span>
          </div>
        </div>

        <h1 className="text-3xl font-black uppercase leading-tight mb-4 tracking-tighter">
          {ad.title}
        </h1>

        <div className="text-6xl font-black tracking-tighter mb-8">
          {ad.price > 0 ? ad.price.toLocaleString() : '---'} <span className="text-sm font-bold text-gray-400">FCFA</span>
        </div>

        {/* 3. LE MAILLAGE : PUITS SÉMANTIQUE */}
        <div className="mb-10 text-black">
          <Link 
            href={`/category/${ad.category.toLowerCase()}`}
            className="inline-block bg-black text-white px-4 py-2 text-[8px] font-black uppercase tracking-[0.2em] hover:bg-orange-600 transition-all"
          >
            VOIR PLUS DE {ad.category} ›
          </Link>
        </div>

        <div className="border-t border-gray-100 pt-8 mb-10 text-justify">
          <p className="text-gray-600 font-medium leading-relaxed whitespace-pre-wrap text-lg">
            {ad.description}
          </p>
        </div>

        {/* FEEDBACK DE TENSION */}
        {ad.clicks_count > 0 && (
          <div className="flex items-center gap-3 text-orange-600 bg-orange-50 p-4 rounded-xl border border-orange-100">
            <span className="animate-bounce">🔥</span>
            <p className="text-[10px] font-black uppercase tracking-widest">{ad.clicks_count} PERSONNES SUR LE COUP</p>
          </div>
        )}
      </main>

      {/* 4. LE LEVIER : ACCÉLÉRATEUR STICKY */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-white/95 backdrop-blur-md border-t border-gray-50 z-30 flex flex-col gap-2">
        {ad.seller_phone ? (
          <>
            <a 
                href={whatsappUrl}
                onClick={registerClick}
                target="_blank"
                className="block w-full bg-[#25D366] text-white text-center py-5 rounded-xl font-black text-lg uppercase tracking-widest active:scale-95 transition-transform"
            >
                PRENDRE SUR WHATSAPP
            </a>
            <button 
                onClick={fireMunition}
                className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-black py-2"
            >
                Propager le signal 🚀
            </button>
          </>
        ) : (
          <div className="w-full bg-gray-100 text-gray-300 text-center py-6 rounded-xl font-black text-lg uppercase">
            NUMÉRO MASQUÉ
          </div>
        )}
      </div>
    </div>
  );
}
