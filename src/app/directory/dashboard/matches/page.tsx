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
  matchType: "buyer" | "seller" | "both" | "none";
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full" style={{ background: 'var(--brand-primary)' }} />
              <h2 className="text-base font-black text-slate-900">Prospective Sellers</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                {matches.filter(m => m.matchType === "seller" || m.matchType === "both" || m.matchType === "none").length}
              </span>
            </div>
            <div className="space-y-4">
              {matches.filter(m => m.matchType === "seller" || m.matchType === "both" || m.matchType === "none").map((match) => (
                <MatchCard key={match.id} match={match} type="seller" />
              ))}
              {matches.filter(m => m.matchType === "seller" || m.matchType === "both" || m.matchType === "none").length === 0 && (
                <p className="text-sm text-slate-400 text-center py-8">No seller matches found</p>
              )}
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full" style={{ background: 'var(--green)' }} />
              <h2 className="text-base font-black text-slate-900">Prospective Buyers</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                {matches.filter(m => m.matchType === "buyer" || m.matchType === "both" || m.matchType === "none").length}
              </span>
            </div>
            <div className="space-y-4">
              {matches.filter(m => m.matchType === "buyer" || m.matchType === "both" || m.matchType === "none").map((match) => (
                <MatchCard key={match.id} match={match} type="buyer" />
              ))}
              {matches.filter(m => m.matchType === "buyer" || m.matchType === "both" || m.matchType === "none").length === 0 && (
                <p className="text-sm text-slate-400 text-center py-8">No buyer matches found</p>
              )}
            </div>
          </div>
        </div>
      )}

      {isPremium === false && (
        <div className="bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-800 shadow-xl overflow-hidden flex flex-col relative text-center items-center justify-center p-6 sm:p-8 md:hidden" style={{ background: 'linear-gradient(160deg, #3D5A7A 0%, #2E4A6A 100%)' }}>
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-xl mx-auto mb-6" style={{ background: '#C9A84C' }}>
              <Zap size={32} />
            </div>
            <h3 className="font-black text-white text-xl mb-3">Unlock More Profiles</h3>
            <p className="text-xs text-white/70 leading-relaxed mb-6">
              Upgrade to Premium to see more profiles and connect with potential partners.
            </p>
            <button onClick={() => window.open('https://nas.com/acinnovationsandventures/physical-products/premium-membership', '_blank')} className="w-full py-3.5 rounded-xl text-sm font-black transition-all hover:-translate-y-0.5" style={{ background: '#C9A84C', color: '#FFFFFF', boxShadow: '0 4px 14px rgba(0,0,0,0.18)' }}>Upgrade to Premium</button>
          </div>
        </div>
      )}
    </div>
  );
}

function MatchCard({ match, type }: { match: MatchCard; type: "seller" | "buyer" }) {
  const isSeller = type === "seller";

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/30 overflow-hidden flex flex-col group relative">
      <div className="absolute top-0 right-0 p-4 z-10">
        <div className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-lg text-white ${isSeller ? 'bg-violet-600' : 'bg-emerald-600'}`}>
          {match.score}% Match
        </div>
      </div>

      <div className="h-20 bg-gradient-to-br from-slate-900 to-slate-800 relative">
        <div className="absolute -bottom-5 left-5 w-12 h-12 bg-white rounded-2xl p-1 shadow-md">
          <div className="w-full h-full rounded-xl flex items-center justify-center text-white font-black" style={{ background: isSeller ? 'var(--brand-secondary)' : 'var(--green)' }}>
            {match.companyName.split(' ').map((w) => w[0]).join('').slice(0, 2)}
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5 pt-7 sm:pt-8 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-black text-slate-900 text-base">{match.companyName}</h3>
          <CheckCircle2 size={12} className="text-emerald-500" />
        </div>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3 flex items-center gap-1">
          <MapPin size={10} /> {match.location}
        </p>

        {isSeller ? (
          match.askDescription && (
            <div className="mb-3 bg-violet-50 rounded-xl p-3 border border-violet-100">
              <p className="text-[10px] font-black text-violet-500 uppercase tracking-widest mb-1">What They Need</p>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">{match.askDescription}</p>
            </div>
          )
        ) : (
          match.giveDescription && (
            <div className="mb-3 bg-emerald-50 rounded-xl p-3 border border-emerald-100">
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">What They Offer</p>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">{match.giveDescription}</p>
            </div>
          )
        )}

        <div className="mb-3">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Why It's a Match</p>
          <p className="text-xs text-violet-600 font-bold bg-violet-50 p-2.5 rounded-lg border border-violet-100">{match.reasoning}</p>
        </div>

        <a href="https://nas.com/acinnovationsandventures/physical-products/premium-membership" target="_blank" rel="noopener noreferrer" className="mt-auto w-full py-2.5 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5" style={{ background: isSeller ? 'var(--brand-secondary)' : 'var(--green)' }}>
          <Handshake size={14} /> Connect
        </a>
      </div>
    </div>
  );
}
