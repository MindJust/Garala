"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';

export default function ShadowDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // --- SYSTÈME DE VERROUILLAGE ---
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  // Vérifier si déjà autorisé dans cette session
  useEffect(() => {
    const auth = sessionStorage.getItem('shadow_auth');
    if (auth === process.env.NEXT_PUBLIC_SHADOW_PASSWORD) {
      setIsAuthorized(true);
      fetchStats();
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const masterKey = process.env.NEXT_PUBLIC_SHADOW_PASSWORD;
    
    if (password === masterKey) {
      sessionStorage.setItem('shadow_auth', password);
      setIsAuthorized(true);
      setLoading(true);
      fetchStats();
    } else {
      setError(true);
      setPassword('');
      setTimeout(() => setError(false), 2000);
    }
  };

  const fetchStats = async () => {
    const { data: adsCount } = await supabase.from('ads').select('id', { count: 'exact' });
    const { data: catTrends } = await supabase.from('category_trends').select('*');
    const { data: groupPerf } = await supabase.from('group_performance').select('*');
    const { data: deadSearches } = await supabase.from('search_logs').select('*').eq('results_count', 0).order('created_at', { ascending: false }).limit(10);
    const { data: activeAlerts } = await supabase.from('scarcity_alerts').select('*').order('created_at', { ascending: false }).limit(10);

    setStats({
      totalAds: adsCount?.length || 0,
      trends: catTrends || [],
      groups: groupPerf || [],
      deadSearches: deadSearches || [],
      alerts: activeAlerts || []
    });
    setLoading(false);
  };

  const generateReport = (groupName: string, count: number, clicks: number) => {
    const text = `📊 *RAPPORT GARALA : ${groupName.toUpperCase()}*\n\n✅ ${count} produits indexés\n🔥 ${clicks} prospects générés\n\nGarala : L'infrastructure de vos ventes.`;
    navigator.clipboard.writeText(text);
    alert("RAPPORT COPIÉ.");
  };

  // --- RENDU : ÉCRAN DE VERROUILLAGE ---
  if (!isAuthorized) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center font-mono p-6">
        <form onSubmit={handleLogin} className="max-w-sm w-full">
          <div className="mb-8 text-center">
            <h1 className="text-white text-xl font-black uppercase tracking-[0.5em] mb-2">Shadow Access</h1>
            <div className="h-1 w-12 bg-orange-600 mx-auto"></div>
          </div>
          
          <input 
            type="password"
            autoFocus
            placeholder="ENTER_SECRET_KEY"
            className={`w-full bg-[#111] border ${error ? 'border-red-600' : 'border-white/10'} p-4 text-center text-white outline-none focus:border-orange-600 transition-all uppercase text-xs tracking-widest rounded-xl`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <p className="text-[8px] text-gray-700 mt-6 text-center uppercase tracking-widest">
            {error ? 'ACCESS_DENIED_RETRY' : 'Authorized Personnel Only'}
          </p>
        </form>
      </div>
    );
  }

  if (loading) return <div className="bg-black min-h-screen text-orange-500 p-10 font-mono tracking-tighter animate-pulse uppercase">decrypting_data_stream...</div>;

  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans">
      
      {/* HEADER TERMINAL */}
      <header className="p-6 md:p-10 border-b border-white/5 flex justify-between items-center sticky top-0 bg-black/80 backdrop-blur-xl z-30">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tighter italic">Shadow Dashboard <span className="text-orange-600">V2</span></h1>
          <p className="text-[9px] font-mono text-gray-600 uppercase tracking-[0.3em] mt-1">Status: Omniscience Active</p>
        </div>
        <Link href="/" className="text-[10px] font-black border border-white/10 px-6 py-2 rounded-full hover:bg-white hover:text-black transition-all uppercase tracking-widest">Signal Public</Link>
      </header>

      <main className="p-6 md:p-10 max-w-7xl mx-auto">
        
        {/* INDICATEURS DE MASSE */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl">
            <p className="text-[8px] font-black text-gray-600 uppercase mb-2 tracking-widest">Masse Globale</p>
            <p className="text-4xl font-black text-white leading-none">{stats.totalAds}</p>
          </div>
          <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl">
            <p className="text-[8px] font-black text-gray-600 uppercase mb-2 tracking-widest">Tension Max</p>
            <p className="text-4xl font-black text-orange-600 leading-none">{stats.trends[0]?.category || '---'}</p>
          </div>
          <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl">
            <p className="text-[8px] font-black text-gray-600 uppercase mb-2 tracking-widest">Traques Actives</p>
            <p className="text-4xl font-black text-blue-600 leading-none">{stats.alerts.length}</p>
          </div>
          <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl">
            <p className="text-[8px] font-black text-gray-600 uppercase mb-2 tracking-widest">Recherches Mortes</p>
            <p className="text-4xl font-black text-red-600 leading-none">{stats.deadSearches.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* GISEMENTS DE DEMANDE */}
          <section>
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-600 rounded-full animate-ping"></span> Gisements de Demande
            </h2>
            <div className="space-y-2">
              {stats.deadSearches.map((log: any) => (
                <div key={log.id} className="bg-[#0A0A0A] p-4 border border-red-900/10 rounded-xl flex justify-between items-center group hover:border-red-600/50 transition-all">
                  <span className="font-bold text-red-500 uppercase text-sm tracking-tighter">{log.query}</span>
                  <span className="text-[9px] font-mono text-gray-700 uppercase">{new Date(log.created_at).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          </section>

          {/* RADAR DE TRAQUE */}
          <section>
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full"></span> Radar de Traque
            </h2>
            <div className="space-y-2">
              {stats.alerts.map((alert: any) => (
                <div key={alert.id} className="bg-[#0A0A0A] p-4 border border-blue-900/10 rounded-xl flex justify-between items-center group hover:border-blue-600/50 transition-all">
                  <div>
                    <p className="font-bold text-blue-400 uppercase text-sm tracking-tighter">{alert.query}</p>
                    <p className="text-[9px] text-gray-600 font-black">{alert.user_phone}</p>
                  </div>
                  <a href={`https://wa.me/${alert.user_phone}?text=Bonjour, vous traquez : *${alert.query.toUpperCase()}*. On vient de trouver quelque chose !`} target="_blank" className="bg-blue-600/10 text-blue-500 p-2 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* MATRICE DES GROUPES */}
          <section className="lg:col-span-2 mt-10">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-6">Matrice des Groupes</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats.groups.map((g: any) => (
                <div key={g.name} className="bg-[#0A0A0A] p-6 border border-white/5 rounded-2xl flex flex-col justify-between hover:border-orange-600/30 transition-all">
                  <div>
                    <h3 className="font-black uppercase text-sm mb-1">{g.name || 'SANS_NOM'}</h3>
                    <div className="flex gap-4">
                      <div><p className="text-[8px] text-gray-600 font-bold uppercase">Annonces</p><p className="text-xl font-black">{g.total_ads}</p></div>
                      <div><p className="text-[8px] text-gray-600 font-bold uppercase">Impact</p><p className="text-xl font-black text-green-500">{g.total_clicks}</p></div>
                    </div>
                  </div>
                  <button 
                    onClick={() => generateReport(g.name, g.total_ads, g.total_clicks)}
                    className="mt-6 w-full py-3 bg-white/5 hover:bg-white hover:text-black rounded-xl font-black text-[9px] uppercase tracking-widest transition-all"
                  >
                    Générer Munition Admin
                  </button>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
