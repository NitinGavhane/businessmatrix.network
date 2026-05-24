"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Building2 } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    businessName: "",
    businessType: "Manufacturer",
    ownerName: "",
    city: "",
    state: "",
    country: "",
    description: "",
    buyingProducts: "",
    sellingProducts: "",
  });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/directory/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          buyingProducts: form.buyingProducts.split(",").map((s) => s.trim()).filter(Boolean),
          sellingProducts: form.sellingProducts.split(",").map((s) => s.trim()).filter(Boolean),
        }),
      });
      if (res.ok) {
        router.push("/directory/dashboard");
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg mx-auto mb-6 gradient-brand">
            <Building2 size={28} />
          </div>
          <h1 className="text-3xl font-black text-slate-900">Complete Your Profile</h1>
          <p className="text-slate-500 mt-2">Set up your business to start connecting</p>
        </div>

        <div className="flex items-center gap-2 mb-8 justify-center">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${step >= s ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-500"}`}>{s}</div>
              {s < 2 && <div className={`w-12 h-1 rounded ${step > s ? "bg-indigo-600" : "bg-slate-200"}`} />}
            </div>
          ))}
        </div>

        <div className="card-premium p-8">
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-xl font-black text-slate-900">Basic Business Information</h2>
              <div>
                <label className="label-premium">Business Name</label>
                <input value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} className="input-premium" required />
              </div>
              <div>
                <label className="label-premium">Business Type</label>
                <select value={form.businessType} onChange={(e) => setForm({ ...form, businessType: e.target.value })} className="input-premium">
                  {["Manufacturer", "Wholesale Distributor", "Supplier", "Exporter", "Service Provider", "Retailer"].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-premium">Owner/Contact Name</label>
                <input value={form.ownerName} onChange={(e) => setForm({ ...form, ownerName: e.target.value })} className="input-premium" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="label-premium">City</label>
                  <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input-premium" />
                </div>
                <div>
                  <label className="label-premium">State</label>
                  <input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="input-premium" />
                </div>
                <div>
                  <label className="label-premium">Country</label>
                  <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="input-premium" />
                </div>
              </div>
              <div>
                <label className="label-premium">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-premium h-24 resize-none" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-xl font-black text-slate-900">Products & Services</h2>
              <div>
                <label className="label-premium">What do you buy? (comma separated)</label>
                <input value={form.buyingProducts} onChange={(e) => setForm({ ...form, buyingProducts: e.target.value })} className="input-premium" placeholder="e.g., Raw materials, Electronics, Packaging" />
              </div>
              <div>
                <label className="label-premium">What do you sell? (comma separated)</label>
                <input value={form.sellingProducts} onChange={(e) => setForm({ ...form, sellingProducts: e.target.value })} className="input-premium" placeholder="e.g., Finished goods, Services, OEM" />
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t flex justify-between" style={{ borderColor: 'var(--border)' }}>
            {step > 1 && (
              <button onClick={() => setStep(step - 1)} className="btn-premium btn-premium-secondary">Back</button>
            )}
            {step < 2 ? (
              <button onClick={() => setStep(step + 1)} className="btn-premium btn-premium-primary ml-auto">Continue <ArrowRight size={16} /></button>
            ) : (
              <button onClick={handleSubmit} disabled={loading} className="btn-premium btn-premium-primary ml-auto">
                {loading ? "Saving..." : "Complete Setup"} <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
