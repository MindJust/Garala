"use client";
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';

export default function ShadowDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [semanticGaps, setSemanticGaps] = useState<string[]>([]);

  const fetchStats = useCallback(async () => {
    // 1. Stats de Masse et Symbiose
    const { data: adsCount } = await supabase.from('ads').select('id', { count: 'exact' });
    const { data: catTrends } = await supabase.from('category_trends').select('*');
    const { data: groupPerf } = await supabase.from('group_performance').select('*');
    
    // 2. MONITEUR DE SANTÉ IA (Axe 4 - Maxwell's Monitor)
    const { data: aiHealth } = await supabase.from('ai_health_monitor').select('*');

    // 3. Gisements de Demande (0 Résultats) & Traques
    const { data: deadSearches } = await supabase.from('search_logs')
      .select('*')
      .eq('results_count', 0)
      .order('created_at', { ascending: false })
      .limit(20);

    const { data: activeAlerts } = await supabase.from('scarcity_alerts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    // 4. Analyse des Failles Sémantiques
    const { data: existingSynonyms } = await supabase.from('search_synonyms').select('term');
    const synonymTerms = existingSynonyms?.map(s => s.term) || [];
    
    const gaps = deadSearches
      ?.map(s => s.query)
      .filter(q => !synonymTerms.includes(q))
      .filter((v, i, a) => a.indexOf(v) === i);

    setStats({
      totalAds: adsCount?.length || 0,
      trends: catTrends || [],
      groups: groupPerf || [],
      deadSearches: deadSearches || [],
      alerts: activeAlerts || [],
      health: aiHealth || []
    });
    setSemanticGaps(gaps || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    const auth = sessionStorage.getItem('shadow_auth');
    if (auth === process.env.NEXT_PUBLIC_SHADOW_PASSWORD) {
      setIsAuthorized(true);
      fetchStats();
    } else {
      setLoading(false);
    }
  }, [fetchStats]);

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

  const generateReport = (groupName: string, count: number, clicks: number) => {
    const text = `📊 *RAPPORT GARALA : ${groupName.toUpperCase()}*\n\n✅ ${count} produits indexés\n🔥 ${clicks} prospects générés\n\nGarala : L'infrastructure de vos ventes.`;
    navigator.clipboard.writeText(text);
    alert("RAPPORT COPIÉ.");
  };

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
          <p className="text-[8px] text-gray-700 mt-6 text-center uppercase tracking-widest">{error ? 'ACCESS_DENIED_RETRY' : 'Authorized Personnel Only'}</p>
        </form>
      </div>
    );
  }

  if (loading) return <div className="bg-black min-h-screen text-orange-500 p-10 font-mono tracking-tighter animate-pulse uppercase">decrypting_data_stream...</div>;

  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans selection:bg-orange-500 selection:text-white">
      
      <header className="p-6 md:p-10 border-b border-white/5 flex justify-between items-center sticky top-0 bg-black/80 backdrop-blur-xl z-30">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tighter italic">Shadow Dashboard <span className="text-orange-600">V2.1</span></h1>
          <p className="text-[9px] font-mono text-gray-600 uppercase tracking-[0.3em] mt-1">Status: Maxwell's Demon Active</p>
        </div>
        <Link href="/" className="text-[10px] font-black border border-white/10 px-6 py-2 rounded-full hover:bg-white hover:text-black transition-all uppercase tracking-widest">Signal Public</Link>
      </header>

      <main className="p-6 md:p-10 max-w-7xl mx-auto">
        
        {/* SECTION : SANTÉ DU CERVEAU (Démon de Maxwell) */}
        <section className="mb-12">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span> État de Santé IA (24h)
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['PENDING', 'PROCESSED', 'ERROR', 'IGNORED'].map(status => {
                    const healthData = stats.health.find((h:any) => h.status === status);
                    return (
                        <div key={status} className="bg-[#0A0A0A] p-5 border border-white/5 rounded-2xl">
                            <p className="text-[8px] font-black text-gray-600 uppercase mb-2 tracking-widest">{status}</p>
                            <p className={`text-3xl font-black ${status === 'ERROR' ? 'text-red-600' : status === 'PROCESSED' ? 'text-green-500' : 'text-white'}`}>
                                {healthData?.count || 0}
                            </p>
                        </div>
                    );
                })}
            </div>
        </section>

        {/* INDICATEURS DE MASSE */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl">
            <p className="text-[8px] font-black text-gray-600 uppercase mb-2 tracking-widest">Signaux Indexés</p>
            <p className="text-4xl font-black text-white leading-none">{stats.totalAds}</p>
          </div>
          <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl">
            <p className="text-[8px] font-black text-gray-600 uppercase mb-2 tracking-widest">Faille Sémantique</p>
            <p className="text-4xl font-black text-red-600 leading-none">{semanticGaps.length}</p>
          </div>
          <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl">
            <p className="text-[8px] font-black text-gray-600 uppercase mb-2 tracking-widest">Traques en cours</p>
            <p className="text-4xl font-black text-blue-600 leading-none">{stats.alerts.length}</p>
          </div>
          <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl">
             <p className="text-[8px] font-black text-gray-600 uppercase mb-2 tracking-widest">Symbiose Groupes</p>
             <p className="text-4xl font-black text-green-500 leading-none">{stats.groups.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* TRAJECTOIRE B : GISEMENTS DE VOCABULAIRE */}
          <section>
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-600 rounded-full animate-ping"></span> Gisements de Vocabulaire (Gaps)
            </h2>
            <div className="bg-[#0A0A0A] rounded-2xl border border-white/5 overflow-hidden">
                <div className="divide-y divide-white/5">
                    {semanticGaps.map((gap) => (
                        <div key={gap} className="p-4 flex justify-between items-center group hover:bg-white/5 transition-all">
                            <span className="font-bold text-red-500 uppercase text-sm tracking-tighter">{gap}</span>
                            <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest">Action requise ›</span>
                        </div>
                    ))}
                    {semanticGaps.length === 0 && <p className="p-10 text-center text-[10px] text-gray-800 font-black uppercase italic">Dictionnaire de résonance complet.</p>}
                </div>
            </div>
          </section>

          {/* TRAJECTOIRE B : MATCH-MAKING */}
          <section>
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full"></span> Radar de Traque & Courtage
            </h2>
            <div className="space-y-3">
              {stats.alerts.map((alert: any) => (
                <div key={alert.id} className="bg-[#0A0A0A] p-6 border border-white/5 rounded-2xl hover:border-blue-600/30 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-black text-blue-400 uppercase text-lg tracking-tighter">{alert.query}</p>
                      <p className="text-[9px] text-gray-600 font-mono mt-1">CLIENT : {alert.user_phone}</p>
                    </div>
                  </div>
                  <a 
                    href={`https://wa.me/${alert.user_phone}?text=${encodeURIComponent(`Bonjour, vous traquez : *${alert.query.toUpperCase()}*. Bonne nouvelle, on vient de détecter un signal correspondant sur Garala !`)}`} 
                    target="_blank" 
                    className="block w-full bg-blue-600 text-white text-center py-3 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-blue-700 transition-all"
                  >
                    Notifier le client
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* MATRICE DE SYMBIOSE */}
          <section className="lg:col-span-2 mt-10">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-6">Matrice de Symbiose</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats.groups.map((g: any) => (
                <div key={g.name} className="bg-[#0A0A0A] p-6 border border-white/5 rounded-2xl flex flex-col justify-between hover:border-orange-600/30 transition-all group">
                  <div>
                    <h3 className="font-black uppercase text-sm mb-1 group-hover:text-orange-500 transition-colors">{g.name || 'SANS_NOM'}</h3>
                    <div className="flex gap-6 mt-4">
                      <div><p className="text-[8px] text-gray-600 font-black uppercase tracking-tighter">Flux</p><p className="text-2xl font-black">{g.total_ads}</p></div>
                      <div><p className="text-[8px] text-gray-600 font-black uppercase tracking-tighter">Impact</p><p className="text-2xl font-black text-green-500">{g.total_clicks}</p></div>
                    </div>
                  </div>
                  <button 
                    onClick={() => generateReport(g.name, g.total_ads, g.total_clicks)}
                    className="mt-8 w-full py-4 bg-white/5 hover:bg-white hover:text-black rounded-xl font-black text-[9px] uppercase tracking-widest transition-all"
                  >
                    Générer Rapport Admin
                  </button>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>

      <footer className="p-20 text-center border-t border-white/5">
         <p className="text-[8px] font-mono text-gray-800 uppercase tracking-[1em]">Infrastructure • Garala • Singularité</p>
      </footer>
    </div>
  );
}
