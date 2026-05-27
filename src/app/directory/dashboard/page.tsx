"use client";

import { useEffect, useState } from "react";
import { Plus, Building2, Handshake, Network, ArrowRight, Sparkles, Edit3, Save, X, ShoppingCart, Package, User } from "lucide-react";
import Link from "next/link";

type Requirement = {
  id: string;
  type: "Give" | "Ask";
  title: string;
  description: string;
  category: string;
};

type MatchInfo = {
  id: string;
  companyName: string;
  score: number;
  location: string;
};

type DashboardData = {
  profileViews: number;
  newMatches: number;
  activeRequirements: Requirement[];
  topMatches: MatchInfo[];
  buyingProducts: string[];
  sellingProducts: string[];
  user: {
    name: string | null;
    companyName: string | null;
    isPremium: boolean | null;
  };
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [buyingItems, setBuyingItems] = useState<string[]>([]);
  const [sellingItems, setSellingItems] = useState<string[]>([]);
  const [newBuying, setNewBuying] = useState("");
  const [newSelling, setNewSelling] = useState("");

  useEffect(() => {
    fetch("/api/directory/dashboard/stats")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setBuyingItems(d?.buyingProducts || []);
        setSellingItems(d?.sellingProducts || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    await fetch("/api/directory/dashboard/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        buyingProducts: buyingItems,
        sellingProducts: sellingItems,
      }),
    });
    setEditMode(false);
  };

  const addBuying = () => {
    if (newBuying.trim()) {
      setBuyingItems([...buyingItems, newBuying.trim()]);
      setNewBuying("");
    }
  };

  const addSelling = () => {
    if (newSelling.trim()) {
      setSellingItems([...sellingItems, newSelling.trim()]);
      setNewSelling("");
    }
  };

  const removeBuying = (idx: number) => setBuyingItems(buyingItems.filter((_, i) => i !== idx));
  const removeSelling = (idx: number) => setSellingItems(sellingItems.filter((_, i) => i !== idx));

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-48" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => <div key={i} className="h-32 bg-slate-100 rounded-2xl" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Dashboard</h1>
          <p className="text-slate-500">
            Welcome{data?.user?.name ? ` Back, ${data.user.name}` : " Back"}. Here's Your Business at a Glance.
          </p>
        </div>
        <Link href="/directory/dashboard/profile" className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-100 hover:bg-slate-200 transition-all text-slate-500 hover:text-slate-700">
          <User size={18} />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="card-premium p-5 flex flex-col animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99, 102, 241, 0.1)' }}>
                <Network size={18} style={{ color: 'var(--brand-primary)' }} />
              </div>
              <h3 className="text-sm font-bold text-slate-700">Profile Views</h3>
            </div>
            <div className="text-3xl font-black text-slate-900">{data?.profileViews || 0}</div>
            <p className="text-xs font-bold mt-1" style={{ color: 'var(--green)' }}>Active in network</p>
          </div>

          <div className="card-premium p-5 flex flex-col animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--red-light)' }}>
                <Handshake size={18} style={{ color: 'var(--red)' }} />
              </div>
              <h3 className="text-sm font-bold text-slate-700">New Matches</h3>
            </div>
            <div className="text-3xl font-black text-slate-900">{data?.newMatches || 0}</div>
            <p className="text-xs text-slate-400 font-medium mt-1">Ready to connect</p>
          </div>
        </div>

        <div className="relative overflow-hidden p-5 rounded-2xl flex flex-col text-white animate-fade-in-up" style={{ animationDelay: '0.3s', background: 'linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-secondary) 100%)', boxShadow: '0 12px 24px -4px rgba(99, 102, 241, 0.3)' }}>
          <div className="absolute top-0 right-0 p-4 opacity-20"><Building2 size={64} /></div>
          <div className="relative z-10 flex flex-col h-full">
            <h3 className="text-sm font-bold text-indigo-100 mb-2">{data?.user?.companyName || "Your Network"}</h3>
            {data?.user?.isPremium ? (
              <p className="text-xs text-indigo-200 leading-relaxed mb-4">Premium access active. Connect directly with your matches.</p>
            ) : (
              <>
                <p className="text-xs text-indigo-200 leading-relaxed mb-4">Upgrade to connect directly with matches and start trading.</p>
                <button className="mt-auto self-start px-4 py-2 bg-white text-indigo-600 rounded-lg text-xs font-bold transition-all hover:bg-indigo-50" style={{ display: 'none' }}>Upgrade Account</button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-premium overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2">
              <ShoppingCart size={16} style={{ color: 'var(--brand-primary)' }} />
              <h2 className="text-lg font-black text-slate-900">Actively Buying</h2>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">{buyingItems.length} items</span>
          </div>
          <div className="p-5">
            {editMode ? (
              <div className="space-y-3">
                {buyingItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: 'var(--brand-primary)' }} />
                    <input value={item} onChange={(e) => { const items = [...buyingItems]; items[i] = e.target.value; setBuyingItems(items); }} className="flex-1 input-premium py-2 text-sm" />
                    <button onClick={() => removeBuying(i)} className="text-red-400 hover:text-red-600"><X size={14} /></button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input value={newBuying} onChange={(e) => setNewBuying(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addBuying()} placeholder="Add product..." className="flex-1 input-premium py-2 text-sm" />
                  <button onClick={addBuying} className="btn-premium btn-premium-primary py-2 text-xs">+ Add</button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {buyingItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full" style={{ background: 'var(--brand-primary)' }} />
                    <span className="text-sm font-medium text-slate-700">{item}</span>
                  </div>
                ))}
                {buyingItems.length === 0 && <p className="text-sm text-slate-400">No items listed.</p>}
              </div>
            )}
            {!editMode && (
              <div className="mt-4 flex justify-end">
                <button onClick={() => setEditMode(true)} className="text-xs font-medium flex items-center gap-1 text-indigo-600 hover:text-indigo-800">
                  <Edit3 size={14} /> Edit
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="card-premium overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2">
              <Package size={16} style={{ color: 'var(--green)' }} />
              <h2 className="text-lg font-black text-slate-900">Actively Selling</h2>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">{sellingItems.length} items</span>
          </div>
          <div className="p-5">
            {editMode ? (
              <div className="space-y-3">
                {sellingItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: 'var(--green)' }} />
                    <input value={item} onChange={(e) => { const items = [...sellingItems]; items[i] = e.target.value; setSellingItems(items); }} className="flex-1 input-premium py-2 text-sm" />
                    <button onClick={() => removeSelling(i)} className="text-red-400 hover:text-red-600"><X size={14} /></button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input value={newSelling} onChange={(e) => setNewSelling(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addSelling()} placeholder="Add product..." className="flex-1 input-premium py-2 text-sm" />
                  <button onClick={addSelling} className="btn-premium btn-premium-primary py-2 text-xs">+ Add</button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {sellingItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full" style={{ background: 'var(--green)' }} />
                    <span className="text-sm font-medium text-slate-700">{item}</span>
                  </div>
                ))}
                {sellingItems.length === 0 && <p className="text-sm text-slate-400">No items listed.</p>}
              </div>
            )}
            {!editMode && (
              <div className="mt-4 flex justify-end">
                <button onClick={() => setEditMode(true)} className="text-xs font-medium flex items-center gap-1 text-indigo-600 hover:text-indigo-800">
                  <Edit3 size={14} /> Edit
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card-premium overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
          <div>
            <h2 className="text-lg font-black text-slate-900">Active Requirements</h2>
            <p className="text-xs text-slate-500 mt-1">Your Give & Ask listings</p>
          </div>
          <Link href="/directory/dashboard/requirements/new" className="btn-premium btn-premium-primary py-2.5 px-4 text-xs">
            <Plus size={14} /> Add New
          </Link>
        </div>
        <div className="p-5">
          {data?.activeRequirements && data.activeRequirements.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full" style={{ background: 'var(--brand-primary)' }} />
                  <h3 className="text-sm font-bold text-slate-700">Ask (I Need)</h3>
                </div>
                <div className="space-y-3">
                  {data.activeRequirements.filter((r) => r.type === "Ask").map((req) => (
                    <div key={req.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <h4 className="font-bold text-slate-900 text-sm mb-1">{req.title.slice(0, 60)}</h4>
                      <p className="text-xs text-slate-500">{req.description}</p>
                    </div>
                  ))}
                  {data.activeRequirements.filter((r) => r.type === "Ask").length === 0 && (
                    <p className="text-xs text-slate-400">No Ask requirements yet.</p>
                  )}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full" style={{ background: 'var(--green)' }} />
                  <h3 className="text-sm font-bold text-slate-700">Give (I Offer)</h3>
                </div>
                <div className="space-y-3">
                  {data.activeRequirements.filter((r) => r.type === "Give").map((req) => (
                    <div key={req.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <h4 className="font-bold text-slate-900 text-sm mb-1">{req.title.slice(0, 60)}</h4>
                      <p className="text-xs text-slate-500">{req.description}</p>
                    </div>
                  ))}
                  {data.activeRequirements.filter((r) => r.type === "Give").length === 0 && (
                    <p className="text-xs text-slate-400">No Give requirements yet.</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-sm text-slate-400">
              <p>No active requirements yet.</p>
              <Link href="/directory/dashboard/requirements/new" className="text-indigo-600 font-bold mt-2 inline-block">Post your first Give or Ask</Link>
            </div>
          )}
        </div>
      </div>

      <div className="card-premium overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
        <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-violet-500" />
            <h2 className="text-lg font-black text-slate-900">Top Matches</h2>
          </div>
          <Link href="/directory/dashboard/matches" className="text-xs font-bold flex items-center gap-1" style={{ color: 'var(--brand-primary)' }}>
            View All <ArrowRight size={12} />
          </Link>
        </div>
        <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
          {data?.topMatches && data.topMatches.length > 0 ? (
            data.topMatches.slice(0, 3).map((match, i) => (
              <div key={match.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-xs gradient-brand">
                    {match.companyName.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{match.companyName}</h3>
                    <p className="text-[10px] text-slate-500">{match.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-violet-50 text-violet-600">{match.score}%</span>
                  <button className="text-xs font-bold flex items-center gap-1" style={{ color: 'var(--brand-primary)' }}>
                    Connect <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-sm text-slate-400">
              <p>No matches yet. Update your requirements to get matched.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
