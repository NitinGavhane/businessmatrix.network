"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const suggestions = [
  "Raw materials", "Electronics", "Packaging", "Chemicals", "Textiles", "Machinery",
  "Automotive parts", "Pharmaceuticals", "Medical equipment", "Food ingredients",
  "Beverages", "Cosmetics", "Plastics", "Rubber", "Metals", "Steel", "Aluminum",
  "Wood", "Paper", "Construction materials", "Cement", "Fertilizers", "Pesticides",
  "Seeds", "Agricultural equipment", "IT services", "Software", "Hardware",
  "Cloud services", "Consulting", "Logistics", "Transportation", "Warehousing",
  "Furniture", "Home decor", "Apparel", "Footwear", "Jewelry", "Watches",
  "Sports equipment", "Toys", "Pet supplies", "Office supplies", "Printing",
  "Packaging materials", "Industrial equipment", "HVAC", "Electrical components",
  "Solar panels", "Batteries", "Cables", "LED lighting", "Sanitary ware",
  "Ceramics", "Glass", "Paints", "Adhesives", "Lubricants", "Fuels",
  "Finished goods", "Services", "OEM", "OEM manufacturing", "Spare parts",
  "Tools", "Safety equipment", "Laboratory equipment", "Testing services",
  "Marketing services", "Digital marketing", "Web development", "Mobile apps",
  "IoT devices", "Smart home", "Security systems", "CCTV", "Biometrics",
];

function SuggestionInput({ value, onChange, placeholder, label }: { value: string; onChange: (v: string) => void; placeholder: string; label: string }) {
  const [open, setOpen] = useState(false);
  const [focusedIdx, setFocusedIdx] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const lastWord = value.split(",").pop()?.trim().toLowerCase() || "";
  const matches = lastWord.length >= 1
    ? suggestions.filter((s) => s.toLowerCase().includes(lastWord) && !value.toLowerCase().includes(s.toLowerCase())).slice(0, 8)
    : [];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function select(suggestion: string) {
    const parts = value.split(",").map((s) => s.trim()).filter(Boolean);
    if (parts.length > 0 && lastWord) {
      parts[parts.length - 1] = suggestion;
    } else {
      parts.push(suggestion);
    }
    onChange(parts.join(", ") + ", ");
    setOpen(false);
    setFocusedIdx(-1);
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open || !matches.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setFocusedIdx((i) => Math.min(i + 1, matches.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setFocusedIdx((i) => Math.max(i - 1, 0)); }
    if (e.key === "Enter" && focusedIdx >= 0) { e.preventDefault(); select(matches[focusedIdx]); }
    if (e.key === "Escape") { setOpen(false); setFocusedIdx(-1); }
  }

  return (
    <div ref={ref} className="relative">
      <label className="label-premium">{label}</label>
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true); setFocusedIdx(-1); }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        className="input-premium"
        placeholder={placeholder}
      />
      {open && matches.length > 0 && (
        <div className="absolute z-20 top-full mt-1 w-full bg-white border rounded-xl shadow-xl max-h-48 overflow-y-auto" style={{ borderColor: 'var(--border)' }}>
          {matches.map((s, i) => (
            <button
              key={s}
              type="button"
              onMouseDown={() => select(s)}
              className={`w-full text-left px-4 py-2 text-sm font-medium ${i === focusedIdx ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"}`}
            >{s}</button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
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

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name")
      .then((r) => r.json())
      .then((data) => setCountries(data.map((c: any) => c.name.common).sort()))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!form.country) { setStates([]); setCities([]); return; }
    setLoadingLocations(true);
    setCities([]);
    fetch("https://countriesnow.space/api/v0.1/countries/states", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country: form.country }),
    })
      .then((r) => r.json())
      .then((data) => setStates(data.data?.states?.map((s: any) => s.name)?.sort() || []))
      .catch(() => setStates([]))
      .finally(() => setLoadingLocations(false));
  }, [form.country]);

  useEffect(() => {
    if (!form.country || !form.state) { setCities([]); return; }
    setLoadingLocations(true);
    fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country: form.country, state: form.state }),
    })
      .then((r) => r.json())
      .then((data) => setCities(data.data || []))
      .catch(() => setCities([]))
      .finally(() => setLoadingLocations(false));
  }, [form.country, form.state]);

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
          <Image src="/businessmatrix-logo-crop.png" alt="BusinessMatrix" width={56} height={56} className="rounded-2xl shadow-lg mx-auto mb-6" />
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
                  {["Manufacturer", "Wholesaler", "Service Provider", "Retailer", "Other"].map((t) => (
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
                  <label className="label-premium">Country</label>
                  <select value={form.country} onChange={(e) => { setForm({ ...form, country: e.target.value, state: "", city: "" }); }} className="input-premium">
                    <option value="">Select Country</option>
                    {countries.map((c) => (<option key={c} value={c}>{c}</option>))}
                  </select>
                </div>
                <div>
                  <label className="label-premium">State</label>
                  <select value={form.state} onChange={(e) => { setForm({ ...form, state: e.target.value, city: "" }); }} className="input-premium" disabled={!form.country || loadingLocations}>
                    <option value="">Select State</option>
                    {states.map((s) => (<option key={s} value={s}>{s}</option>))}
                  </select>
                </div>
                <div>
                  <label className="label-premium">City</label>
                  <select value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input-premium" disabled={!form.state || loadingLocations}>
                    <option value="">Select City</option>
                    {cities.map((c) => (<option key={c} value={c}>{c}</option>))}
                  </select>
                </div>
              </div>
              <div>
                <label className="label-premium">Business Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-premium h-24 resize-none" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-xl font-black text-slate-900">Products & Services</h2>
              <SuggestionInput value={form.buyingProducts} onChange={(v) => setForm({ ...form, buyingProducts: v })} placeholder="e.g., Raw materials, Electronics, Packaging" label="What do you buy? (comma separated)" />
              <SuggestionInput value={form.sellingProducts} onChange={(v) => setForm({ ...form, sellingProducts: v })} placeholder="e.g., Finished goods, Services, OEM" label="What do you sell? (comma separated)" />
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
