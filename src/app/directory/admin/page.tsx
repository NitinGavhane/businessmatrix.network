"use client";

import { useEffect, useState } from "react";
import { Building2, Users, Handshake, List } from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/directory/admin/stats")
      .then((r) => r.json())
      .then((d) => { setStats(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="animate-pulse space-y-6">
      <div className="h-8 bg-slate-200 rounded w-48" />
      <div className="grid grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => <div key={i} className="h-28 bg-slate-100 rounded-2xl" />)}
      </div>
    </div>;
  }

  const cards = [
    { label: "Total Users", value: stats?.totalUsers || 0, icon: Users, color: "var(--brand-primary)" },
    { label: "Business Profiles", value: stats?.totalProfiles || 0, icon: Building2, color: "var(--green)" },
    { label: "Requirements", value: stats?.totalRequirements || 0, icon: List, color: "var(--gold)" },
    { label: "Active Matches", value: stats?.totalMatches || 0, icon: Handshake, color: "var(--red)" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <h1 className="text-3xl font-black text-slate-900">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.label} className="card-premium p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${card.color}15` }}>
                <card.icon size={18} style={{ color: card.color }} />
              </div>
              <h3 className="text-sm font-bold text-slate-700">{card.label}</h3>
            </div>
            <div className="text-3xl font-black text-slate-900">{card.value}</div>
          </div>
        ))}
      </div>

      {stats?.byType && (
        <div className="card-premium p-6">
          <h2 className="text-lg font-black text-slate-900 mb-4">Businesses by Type</h2>
          <div className="space-y-3">
            {stats.byType.map((bt: any) => (
              <div key={bt.type} className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">{bt.type}</span>
                <span className="text-sm font-black text-slate-900">{bt._count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
