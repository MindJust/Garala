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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
    </div>
  );

  if (!ad) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4 text-center">
      <h1 className="text-4xl font-black mb-4">404</h1>
      <p className="text-gray-500 mb-8">Cette annonce a expiré ou a été vendue.</p>
      <Link href="/" className="bg-orange-600 text-white px-8 py-3 rounded-2xl font-bold">Retour à l'accueil</Link>
    </div>
  );

  const whatsappUrl = `https://wa.me/${ad.seller_phone}?text=${encodeURIComponent(
    `Bonjour, je vous contacte via Garala pour votre annonce : *${ad.title.toUpperCase()}*. Est-elle disponible ?`
  )}`;

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Navigation */}
      <nav className="p-4 bg-white border-b sticky top-0 z-10">
        <Link href="/" className="flex items-center gap-2 text-orange-600 font-black uppercase text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
          Retour au flux
        </Link>
      </nav>

      <main className="max-w-2xl mx-auto mt-4 bg-white md:rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100">
        {/* Image High-Res */}
        <div className="relative w-full h-[450px] bg-gray-100">
          {ad.image_url ? (
            <img src={ad.image_url} alt={ad.title} className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-200 text-6xl font-black italic">GARALA</div>
          )}
          <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-2 rounded-2xl text-xs font-black uppercase shadow-sm">
            {ad.category}
          </div>
        </div>

        {/* Détails */}
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <span className="text-orange-500 font-black text-xs uppercase tracking-widest">
              {ad.groups?.name || 'Groupe Privé'}
            </span>
            <span className="text-gray-400 text-xs font-bold">
              Posté le {new Date(ad.created_at).toLocaleDateString()}
            </span>
          </div>

          <h1 className="text-3xl font-black text-gray-900 leading-tight mb-4 uppercase">
            {ad.title}
          </h1>

          <div className="text-4xl font-black text-orange-600 mb-8 tracking-tighter">
            {ad.price > 0 ? ad.price.toLocaleString() : '---'} <span className="text-lg font-bold text-gray-400">FCFA</span>
          </div>

          <div className="bg-gray-50 p-6 rounded-3xl mb-8">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Description du vendeur</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap font-medium">
              {ad.description}
            </p>
          </div>

          {ad.clicks_count > 0 && (
            <div className="flex items-center gap-3 mb-8 text-orange-800 bg-orange-50 p-4 rounded-2xl border border-orange-100 animate-pulse">
              <span className="text-xl">🔥</span>
              <p className="text-sm font-bold uppercase tracking-tight">
                {ad.clicks_count} personnes ont déjà contacté ce vendeur
              </p>
            </div>
          )}

          {ad.seller_phone ? (
            <a 
              href={whatsappUrl}
              target="_blank"
              className="block w-full bg-[#25D366] text-white text-center py-5 rounded-[2rem] font-black text-lg shadow-2xl shadow-green-200 hover:scale-95 transition-transform active:scale-90"
            >
              PRENDRE MAINTENANT
            </a>
          ) : (
            <div className="w-full bg-gray-100 text-gray-400 text-center py-5 rounded-[2rem] font-black text-lg uppercase cursor-not-allowed">
              Numéro Masqué
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
