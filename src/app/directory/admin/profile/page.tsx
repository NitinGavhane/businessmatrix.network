"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";

export default function AdminProfilePage() {
  const [user, setUser] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/directory/admin/profile")
      .then((r) => r.json())
      .then((d) => { setUser(d.user || {}); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/directory/admin/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    setSaving(false);
  };

  if (loading) return <div className="animate-pulse h-48 bg-slate-100 rounded-2xl" />;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-3xl font-black text-slate-900">Admin Settings</h1>
      <div className="card-premium p-8 space-y-5">
        <div>
          <label className="label-premium">Name</label>
          <input value={user.name || ""} onChange={(e) => setUser({ ...user, name: e.target.value })} className="input-premium" />
        </div>
        <div>
          <label className="label-premium">Email</label>
          <input value={user.email || ""} disabled className="input-premium opacity-60" />
        </div>
        <div>
          <label className="label-premium">Phone</label>
          <input value={user.phone || ""} onChange={(e) => setUser({ ...user, phone: e.target.value })} className="input-premium" />
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-premium btn-premium-primary">
          <Save size={16} /> {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
