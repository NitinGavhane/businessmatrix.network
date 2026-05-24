"use client";

import { useEffect, useState } from "react";
import { Save, User, Building2, Lock } from "lucide-react";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"account" | "business" | "password">("account");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [userData, setUserData] = useState<any>({});
  const [businessData, setBusinessData] = useState<any>({});

  useEffect(() => {
    fetch("/api/directory/dashboard/profile")
      .then((r) => r.json())
      .then((d) => {
        setUserData(d.user || {});
        setBusinessData(d.businessProfile || {});
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    const payload = { ...userData, ...businessData };
    try {
      const res = await fetch("/api/directory/dashboard/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Profile updated successfully!");
      } else {
        setMessage(data.error || "Failed to update");
      }
    } catch {
      setMessage("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
      <div className="h-8 bg-slate-200 rounded w-48" />
      <div className="h-96 bg-slate-100 rounded-2xl" />
    </div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="text-3xl font-black text-slate-900">Business Profile</h1>

      <div className="flex gap-2 border-b pb-2" style={{ borderColor: 'var(--border)' }}>
        {[
          { key: "account", label: "Account Info", icon: User },
          { key: "business", label: "Business Profile", icon: Building2 },
          { key: "password", label: "Change Password", icon: Lock },
        ].map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key as any)} className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all ${activeTab === tab.key ? "bg-white text-indigo-600 border-t border-l border-r" : "text-slate-500 hover:text-slate-700"}`} style={activeTab === tab.key ? { borderColor: 'var(--border)' } : {}}>
            <tab.icon size={14} /> {tab.label}
          </button>
        ))}
      </div>

      <div className="card-premium p-8">
        {message && (
          <div className={`mb-6 p-4 rounded-xl text-xs font-bold text-center border ${message.includes("success") ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}`}>
            {message}
          </div>
        )}

        {activeTab === "account" && (
          <div className="space-y-5">
            <div>
              <label className="label-premium">Full Name</label>
              <input value={userData.name || ""} onChange={(e) => setUserData({ ...userData, name: e.target.value })} className="input-premium" />
            </div>
            <div>
              <label className="label-premium">Email</label>
              <input value={userData.email || ""} disabled className="input-premium opacity-60" />
            </div>
            <div>
              <label className="label-premium">Phone</label>
              <input value={userData.phone || ""} onChange={(e) => setUserData({ ...userData, phone: e.target.value })} className="input-premium" />
            </div>
          </div>
        )}

        {activeTab === "business" && (
          <div className="space-y-5">
            <div>
              <label className="label-premium">Company Name</label>
              <input value={businessData.companyName || ""} onChange={(e) => setBusinessData({ ...businessData, companyName: e.target.value })} className="input-premium" />
            </div>
            <div>
              <label className="label-premium">Business Type</label>
              <input value={businessData.type || ""} onChange={(e) => setBusinessData({ ...businessData, type: e.target.value })} className="input-premium" />
            </div>
            <div>
              <label className="label-premium">Description</label>
              <textarea value={businessData.description || ""} onChange={(e) => setBusinessData({ ...businessData, description: e.target.value })} className="input-premium h-24 resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-premium">City</label>
                <input value={businessData.city || ""} onChange={(e) => setBusinessData({ ...businessData, city: e.target.value })} className="input-premium" />
              </div>
              <div>
                <label className="label-premium">Country</label>
                <input value={businessData.country || ""} onChange={(e) => setBusinessData({ ...businessData, country: e.target.value })} className="input-premium" />
              </div>
            </div>
            <div>
              <label className="label-premium">Website</label>
              <input value={businessData.website || ""} onChange={(e) => setBusinessData({ ...businessData, website: e.target.value })} className="input-premium" />
            </div>
            <div>
              <label className="label-premium">Products & Services</label>
              <textarea value={businessData.productsServices || ""} onChange={(e) => setBusinessData({ ...businessData, productsServices: e.target.value })} className="input-premium h-20 resize-none" />
            </div>
          </div>
        )}

        {activeTab === "password" && (
          <div className="space-y-5">
            <div>
              <label className="label-premium">Current Password</label>
              <input type="password" onChange={(e) => setUserData({ ...userData, currentPassword: e.target.value })} className="input-premium" />
            </div>
            <div>
              <label className="label-premium">New Password</label>
              <input type="password" onChange={(e) => setUserData({ ...userData, newPassword: e.target.value })} className="input-premium" />
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
          <button onClick={handleSave} disabled={saving} className="btn-premium btn-premium-primary">
            <Save size={16} /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
