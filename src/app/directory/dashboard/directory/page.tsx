"use client";

import { useEffect, useState } from "react";
import { Eye, Lock, Crown, MapPin, Phone, Mail, X } from "lucide-react";
import { useSession } from "next-auth/react";

type RequirementItem = {
  id: string;
  type: string;
  category: string;
  description: string;
  tags: string[];
};

type Profile = {
  id: string;
  name: string;
  type: string;
  location: string;
  category: string;
  description: string;
  verified: boolean;
  email: string | null;
  phone: string | null;
  requirements: RequirementItem[];
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
  const { data: session } = useSession();
  const isPremium = (session?.user as { isPremium?: boolean } | undefined)?.isPremium ?? false;
  const [suppliers, setSuppliers] = useState<MatchItem[]>([]);
  const [clients, setClients] = useState<MatchItem[]>([]);
  const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const visibleCount = 2;

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch("/api/directory/listings");
        const data = await res.json();
        const profiles: Profile[] = data.listings || [];

        setAllProfiles(profiles);

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
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl md:hidden">
            <Crown size={16} className="text-amber-600" />
            <span className="text-xs font-bold text-amber-800">Upgrade to see all contacts</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 order-1">
          <div className="card-premium overflow-hidden">
            <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
              <div>
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: 'var(--green)' }} /> Prospective
                </h2>
                <p className="text-xs text-slate-500 mt-1">Suppliers for your requirements</p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">{suppliers.length} prospect</span>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {suppliers.slice(0, isPremium ? suppliers.length : visibleCount).map((s, i) => (
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

                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {s.keywords.map((kw, ki) => (
                      <span key={ki} className="text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{kw}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">{s.category}</span>
                    <div className="flex gap-1.5">
                      <button onClick={() => setSelectedProfile(allProfiles.find(p => p.id === s.id) || null)} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                        <Eye size={10} /> View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {!isPremium && suppliers.length > visibleCount && (
                <div className="p-4 text-center bg-slate-50 border-t" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex items-center justify-center gap-2 text-slate-500 mb-3">
                    <Lock size={14} /> <span className="text-xs font-medium">{suppliers.length - visibleCount} more suppliers locked</span>
                  </div>
                  <button onClick={() => window.open('https://nas.com/acinnovationsandventures/events/1-to-1', '_blank')} className="px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:-translate-y-0.5 md:hidden" style={{ background: '#C9A84C', boxShadow: '0 4px 14px rgba(0,0,0,0.18)' }}>Unlock All Contacts</button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 order-2">
          <div className="card-premium overflow-hidden">
            <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
              <div>
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: 'var(--brand-primary)' }} /> Prospective Buyer
                </h2>
                <p className="text-xs text-slate-500 mt-1">Prospective clients interested</p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">{clients.length} prospects</span>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {clients.slice(0, isPremium ? clients.length : visibleCount).map((c, i) => (
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

                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {c.keywords.map((kw, ki) => (
                      <span key={ki} className="text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{kw}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">{c.category}</span>
                    <div className="flex gap-1.5">
                      <button onClick={() => setSelectedProfile(allProfiles.find(p => p.id === c.id) || null)} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
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

      {selectedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setSelectedProfile(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xs gradient-brand">
                  {selectedProfile.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{selectedProfile.name}</h3>
                  <p className="text-xs text-slate-500">{selectedProfile.type}</p>
                </div>
              </div>
              <button onClick={() => setSelectedProfile(null)} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                <X size={18} className="text-slate-400" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contact</h4>
                <div className="flex items-center gap-3 text-sm">
                  <Mail size={14} className="text-slate-400" />
                  <span className="text-slate-700">{selectedProfile.email || "Not provided"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone size={14} className="text-slate-400" />
                  <span className="text-slate-700">{selectedProfile.phone || "Not provided"}</span>
                </div>
              </div>

              <div className="border-t" style={{ borderColor: 'var(--border)' }} />

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Active Requirements ({selectedProfile.requirements.length})
                </h4>
                {selectedProfile.requirements.length === 0 ? (
                  <p className="text-sm text-slate-400">No active requirements listed</p>
                ) : (
                  <div className="space-y-2">
                    {selectedProfile.requirements.map((r) => (
                      <div key={r.id} className="p-3 rounded-xl bg-slate-50 border" style={{ borderColor: 'var(--border)' }}>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${r.type === 'GIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-violet-50 text-violet-600'}`}>
                            {r.type === 'GIVE' ? 'I Offer' : 'I Need'}
                          </span>
                          <span className="text-[10px] font-medium text-slate-400">{r.category}</span>
                        </div>
                        <p className="text-sm text-slate-700">{r.description}</p>
                        {r.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {r.tags.map((t, ti) => (
                              <span key={ti} className="text-[9px] font-bold text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded-full">{t}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
