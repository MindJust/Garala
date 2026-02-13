"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';

export default function ShadowDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const { data: adsCount } = await supabase.from('ads').select('id', { count: 'exact' });
      const { data: catTrends } = await supabase.from('category_trends').select('*');
      const { data: groupPerf } = await supabase.from('group_performance').select('*');
      const { data: topSearches } = await supabase.from('search_logs').select('*').order('created_at', { ascending: false }).limit(10);

      setStats({
        totalAds: adsCount?.length || 0,
        trends: catTrends || [],
        groups: groupPerf || [],
        logs: topSearches || []
      });
      setLoading(false);
    };
    fetchStats();
  }, []);

  const generateReport = (groupName: string, count: number, clicks: number) => {
    const text = `📊 *RAPPORT GARALA : ${groupName.toUpperCase()}*\n\nCette semaine :\n✅ ${count} annonces indexées\n🔥 ${clicks} intentions d'achat générées\n\nGarala Search : L'accélérateur de votre groupe.`;
    navigator.clipboard.writeText(text);
    alert("Munition de partage copiée pour le groupe " + groupName);
  };

  if (loading) return <div className="bg-black min-h-screen text-green-500 p-10 font-mono">INITIALIZING_SHADOW_SYSTEM...</div>;

  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans p-4 md:p-10">
      <header className="mb-10 border-b border-white/10 pb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic">Shadow Dashboard</h1>
          <p className="text-gray-500 text-xs font-mono uppercase tracking-widest mt-1">Garala Singularité v3.0</p>
        </div>
        <Link href="/" className="text-xs bg-white text-black px-4 py-2 rounded-full font-bold uppercase">Sortir du mode ombre</Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-[#111] p-6 rounded-3xl border border-white/5">
          <p className="text-gray-500 text-[10px] font-black uppercase mb-2">Masse Totale (Annonces)</p>
          <p className="text-5xl font-black text-orange-600">{stats.totalAds}</p>
        </div>
        <div className="bg-[#111] p-6 rounded-3xl border border-white/5">
          <p className="text-gray-500 text-[10px] font-black uppercase mb-2">Tension Catégorie Top</p>
          <p className="text-5xl font-black text-blue-500">{stats.trends[0]?.category || 'N/A'}</p>
        </div>
        <div className="bg-[#111] p-6 rounded-3xl border border-white/5">
          <p className="text-gray-500 text-[10px] font-black uppercase mb-2">Engagement Global</p>
          <p className="text-5xl font-black text-green-500">
            {stats.groups.reduce((acc: any, curr: any) => acc + curr.total_clicks, 0)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Performance Groupes */}
        <section>
          <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-gray-400 italic">Symbiose des Groupes</h2>
          <div className="space-y-3">
            {stats.groups.map((g: any) => (
              <div key={g.name} className="bg-[#111] p-5 rounded-2xl flex justify-between items-center border border-white/5 hover:border-orange-500/30 transition-all">
                <div>
                  <p className="font-bold text-sm uppercase">{g.name}</p>
                  <p className="text-[10px] text-gray-500 uppercase">{g.total_ads} annonces • {g.total_clicks} clics</p>
                </div>
                <button 
                  onClick={() => generateReport(g.name, g.total_ads, g.total_clicks)}
                  className="bg-white/5 hover:bg-orange-600 text-white p-3 rounded-xl transition-all"
                >
                  🚀
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Dernières recherches */}
        <section>
          <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-gray-400 italic">Signaux de Recherche (KPI)</h2>
          <div className="bg-[#111] rounded-3xl border border-white/5 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 text-gray-500 uppercase font-black">
                <tr>
                  <th className="p-4">Mot-Clé</th>
                  <th className="p-4 text-right">Résultats</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stats.logs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-bold text-orange-400">{log.query}</td>
                    <td className="p-4 text-right text-gray-500 font-mono">{log.results_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
