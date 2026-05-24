"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Eye, Lock, Crown, MapPin } from "lucide-react";

type Profile = {
  id: string;
  name: string;
  type: string;
  location: string;
  category: string;
  description: string;
  verified: boolean;
};

type MatchItem = {
  id: string;
  name: string;
  location: string;
  category: string;
  match: number;
  keywords: string[];
};

export default function DirectoryListingPage() {
  const [suppliers, setSuppliers] = useState<MatchItem[]>([]);
  const [clients, setClients] = useState<MatchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const isPremium = false;
  const visibleCount = 2;

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch("/api/directory/listings");
        const data = await res.json();
        const profiles: Profile[] = data.listings || [];

        const all = profiles.map((p, i) => ({
          id: p.id,
          name: p.name,
          location: p.location || "Global",
          category: p.category || "General",
          match: Math.floor(70 + Math.random() * 30),
          keywords: [p.type, ...(p.description ? [p.description.slice(0, 20)] : [])],
        }));

        const mid = Math.ceil(all.length / 2);
        setSuppliers(all.slice(0, mid));
        setClients(all.slice(mid));
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 h-96 bg-slate-100 rounded-2xl" />
          <div className="lg:col-span-2" />
          <div className="lg:col-span-5 h-96 bg-slate-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Directory Listings</h1>
          <p className="text-slate-500">Browse suppliers and prospective clients in your network.</p>
        </div>
        {!isPremium && (
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl">
            <Crown size={16} className="text-amber-600" />
            <span className="text-xs font-bold text-amber-800">Upgrade to see all contacts</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <div className="card-premium overflow-hidden">
            <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
              <div>
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: 'var(--green)' }} /> Buying
                </h2>
                <p className="text-xs text-slate-500 mt-1">Suppliers for your requirements</p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">{suppliers.length} suppliers</span>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {suppliers.slice(0, visibleCount).map((s, i) => (
                <div key={s.id} className="p-4 hover:bg-slate-50 transition-colors animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xs gradient-brand">
                        {s.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{s.name}</h3>
                        <p className="text-[10px] text-slate-500 flex items-center gap-1"><MapPin size={10} /> {s.location}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">{s.match}% match</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {s.keywords.map((kw, ki) => (
                      <span key={ki} className="text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{kw}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">{s.category}</span>
                    <div className="flex gap-1.5">
                      <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors">
                        <MessageSquare size={10} /> Chat
                      </button>
                      <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                        <Eye size={10} /> View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {suppliers.length > visibleCount && (
                <div className="p-4 text-center bg-slate-50 border-t" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex items-center justify-center gap-2 text-slate-500 mb-3">
                    <Lock size={14} /> <span className="text-xs font-medium">{suppliers.length - visibleCount} more suppliers locked</span>
                  </div>
                  <button className="px-4 py-2 rounded-xl text-xs font-bold text-white transition-all" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>Unlock All Contacts</button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-3 gradient-brand" style={{ boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)' }}>
              <span className="text-2xl font-black text-white">{suppliers.length + clients.length}</span>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Matches</p>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="card-premium overflow-hidden">
            <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
              <div>
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: 'var(--brand-primary)' }} /> Selling
                </h2>
                <p className="text-xs text-slate-500 mt-1">Prospective clients interested</p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">{clients.length} prospects</span>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {clients.slice(0, visibleCount).map((c, i) => (
                <div key={c.id} className="p-4 hover:bg-slate-50 transition-colors animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xs" style={{ background: 'var(--brand-secondary)' }}>
                        {c.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{c.name}</h3>
                        <p className="text-[10px] text-slate-500 flex items-center gap-1"><MapPin size={10} /> {c.location}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-violet-50 text-violet-600">{c.match}% match</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {c.keywords.map((kw, ki) => (
                      <span key={ki} className="text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{kw}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">{c.category}</span>
                    <div className="flex gap-1.5">
                      <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors">
                        <MessageSquare size={10} /> Chat
                      </button>
                      <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                        <Eye size={10} /> View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
