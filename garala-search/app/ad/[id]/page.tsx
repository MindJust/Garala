"use client";
import { useState, useEffect, use } from 'react';
import { supabase } from '../../../lib/supabase';
import Link from 'next/link';

interface Ad {
  id: number; title: string; description: string; price: number; category: string;
  image_url: string | null; seller_phone: string | null; created_at: string;
  clicks_count: number; groups: { name: string } | null;
}

export default function AdDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAd = async () => {
      const { data, error } = await supabase
        .from('ads').select('*, groups(name)').eq('id', id).single();
      if (!error) setAd(data);
      setLoading(false);
    };
    fetchAd();
  }, [id]);

  const registerClick = async () => {
    if (!ad) return;
    try { await supabase.rpc('increment_clicks', { row_id: ad.id }); } catch (e) {}
  };

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center"><div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div></div>;

  if (!ad) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-8xl font-black text-gray-100">404</h1>
      <Link href="/" className="mt-4 font-black uppercase tracking-widest text-orange-600">Retour au flux</Link>
    </div>
  );

  const whatsappUrl = `https://wa.me/${ad.seller_phone}?text=${encodeURIComponent(`Bonjour, je vous contacte via Garala pour votre annonce : *${ad.title.toUpperCase()}*. Est-elle disponible ?`)}`;

  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased pb-32">
      {/* 1. L'IMAGE : 50% DU VIEWPORT */}
      <div className="relative w-full h-[50vh] bg-gray-50">
        <Link href="/" className="absolute top-6 left-6 z-20 bg-white/90 backdrop-blur w-10 h-10 flex items-center justify-center rounded-full shadow-xl">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
        </Link>
        {ad.image_url ? (
          <img src={ad.image_url} alt={ad.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-200 font-black italic text-4xl">GARALA</div>
        )}
      </div>

      {/* 2. LE SIGNAL : DÉTAILS CRITIQUES */}
      <main className="p-6 max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">@{ad.groups?.name || 'WhatsApp'}</span>
          <span className="text-[10px] font-bold text-gray-300 uppercase">{new Date(ad.created_at).toLocaleDateString()}</span>
        </div>

        <h1 className="text-2xl font-black uppercase leading-tight mb-4 tracking-tighter">
          {ad.title}
        </h1>

        <div className="text-5xl font-black tracking-tighter mb-8">
          {ad.price > 0 ? ad.price.toLocaleString() : '---'} <span className="text-sm font-bold text-gray-400">FCFA</span>
        </div>

        {/* 3. LE MAILLAGE : PUITS SÉMANTIQUE */}
        <div className="mb-10">
          <Link 
            href={`/category/${ad.category.toLowerCase()}`}
            className="inline-block bg-gray-100 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all"
          >
            Voir plus de {ad.category} à Bangui ›
          </Link>
        </div>

        <div className="border-t border-gray-100 pt-8 mb-10">
          <p className="text-gray-600 font-medium leading-relaxed whitespace-pre-wrap text-lg">
            {ad.description}
          </p>
        </div>

        {/* FEEDBACK DE TENSION */}
        {ad.clicks_count > 0 && (
          <div className="flex items-center gap-3 text-orange-600 bg-orange-50 p-4 rounded-2xl border border-orange-100">
            <span className="animate-bounce">🔥</span>
            <p className="text-xs font-black uppercase tracking-widest">{ad.clicks_count} intéressés</p>
          </div>
        )}
      </main>

      {/* 4. LE LEVIER : BOUTON STICKY MASSIIF */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 z-30">
        {ad.seller_phone ? (
          <a 
            href={whatsappUrl}
            onClick={registerClick}
            target="_blank"
            className="block w-full bg-[#25D366] text-white text-center py-5 rounded-2xl font-black text-lg shadow-2xl uppercase tracking-widest active:scale-95 transition-transform"
          >
            Contacter le vendeur
          </a>
        ) : (
          <div className="w-full bg-gray-100 text-gray-400 text-center py-5 rounded-2xl font-black text-lg uppercase">
            Numéro Masqué
          </div>
        )}
      </div>
    </div>
  );
}
