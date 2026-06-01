"use client";

import { useEffect, useState } from "react";
import { Handshake, Zap, Sparkles, MapPin, CheckCircle2, RefreshCw } from "lucide-react";
import { useSession } from "next-auth/react";

type MatchCard = {
  id: string;
  companyName: string;
  type: string;
  location: string;
  score: number;
  askDescription: string;
  giveDescription: string;
  reasoning: string;
};

export default function MatchesPage() {
  const { data: session } = useSession();
  const isPremium = (session?.user as { isPremium?: boolean } | undefined)?.isPremium;
  const [matches, setMatches] = useState<MatchCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [matchmaking, setMatchmaking] = useState(false);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/matchmaking", { method: "POST" });
      const data = await res.json();
      setMatches(data.matches || []);
    } catch {
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleRefresh = async () => {
    setMatchmaking(true);
    await fetchMatches();
    setMatchmaking(false);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-8 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => <div key={i} className="h-96 bg-slate-100 rounded-3xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1 sm:mb-2 flex items-center gap-2 sm:gap-3">
            Smart Matches <Sparkles size={20} className="sm:w-6 sm:h-6 text-violet-500" />
          </h1>
          <p className="text-slate-500">AI-curated business partners based on your Give & Ask requirements.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleRefresh} disabled={matchmaking} className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all" style={{ borderColor: 'var(--border)' }}>
            <RefreshCw size={14} className={matchmaking ? "animate-spin" : ""} /> {matchmaking ? "Analyzing..." : "Refresh Matches"}
          </button>
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {matches.length > 0 ? `${matches.length} Matches` : "No matches yet"}
          </span>
        </div>
      </div>

      {matches.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sorted by match score:</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {matches.map((match) => (
          <div key={match.id} className="bg-white rounded-2xl sm:rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/30 overflow-hidden flex flex-col group relative">
            <div className="absolute top-0 right-0 p-4 z-10">
              <div className="bg-violet-600 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-lg">{match.score}% Match</div>
            </div>

            <div className="h-24 bg-gradient-to-br from-slate-900 to-slate-800 relative">
              <div className="absolute -bottom-6 left-6 w-14 h-14 bg-white rounded-2xl p-1 shadow-md">
                <div className="w-full h-full rounded-xl flex items-center justify-center text-white font-black" style={{ background: '#1A6FD4' }}>
                  {match.companyName.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 pt-8 sm:pt-10 flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-black text-slate-900 text-lg">{match.companyName}</h3>
                <CheckCircle2 size={14} className="text-emerald-500" />
              </div>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mb-4 flex items-center gap-1">
                <MapPin size={12} /> {match.location}
              </p>

              {match.askDescription && (
                <div className="mb-4 bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">What They Need</p>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">{match.askDescription}</p>
                </div>
              )}

              {match.giveDescription && (
                <div className="mb-4 bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">What They Offer</p>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">{match.giveDescription}</p>
                </div>
              )}

              <div className="mb-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Why It's a Match</p>
                <p className="text-xs text-violet-600 font-bold bg-violet-50 p-2.5 rounded-lg border border-violet-100">{match.reasoning}</p>
              </div>

              <a href="https://nas.com/acinnovationsandventures/events/1-to-1" target="_blank" rel="noopener noreferrer" className="mt-auto w-full py-3 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5" style={{ background: '#1A6FD4' }}>
                <Handshake size={14} /> Connect
              </a>
            </div>
          </div>
        ))}

        {isPremium === false && (
          <div className="bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-800 shadow-xl overflow-hidden flex flex-col relative text-center items-center justify-center p-6 sm:p-8" style={{ background: 'linear-gradient(160deg, #3D5A7A 0%, #2E4A6A 100%)' }}>
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-xl mx-auto mb-6" style={{ background: '#C9A84C' }}>
                <Zap size={32} />
              </div>
              <h3 className="font-black text-white text-xl mb-3">Unlock More Matches</h3>
              <p className="text-xs text-white/70 leading-relaxed mb-6">
                Upgrade to Premium to see all your AI matches and get direct chat access.
              </p>
              <button onClick={() => window.open('https://nas.com/acinnovationsandventures/events/1-to-1', '_blank')} className="w-full py-3.5 rounded-xl text-sm font-black transition-all hover:-translate-y-0.5" style={{ background: '#C9A84C', color: '#FFFFFF', boxShadow: '0 4px 14px rgba(0,0,0,0.18)' }}>Upgrade to Premium</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
