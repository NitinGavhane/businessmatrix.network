"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight, ArrowLeft, Check, Globe } from "lucide-react";

const STEPS = ["Basic Info", "Business Details", "Give & Ask", "Media", "Review"];

export default function ListBusinessPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    businessName: "",
    businessType: [] as string[],
    country: "",
    city: "",
    address: "",
    contactPerson: "",
    phone: "",
    email: "",
    website: "",
    description: "",
    productsServices: "",
    scale: "",
    turnover: "",
    yearsActive: "",
    keyMarkets: "",
    whatYouOffer: "",
    whatYouNeed: "",
    partnershipTypes: [] as string[],
    moq: "",
    logo: "",
    banner: "",
    networkingInterest: "",
  });

  const businessTypes = ["Manufacturer", "Wholesaler", "Service Provider", "Retailer"];

  const update = (field: string, value: any) => setForm({ ...form, [field]: value });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/directory/list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: 'var(--bg-primary)' }}>
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: 'var(--green-light)' }}>
            <Check size={32} style={{ color: 'var(--green)' }} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-3">Business Listed!</h1>
          <p className="text-slate-500 mb-8">Your business is now live on BusinessMatrix. Start connecting with partners.</p>
          <button onClick={() => router.push("/directory/dashboard")} className="btn-premium btn-premium-primary">Go to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-6" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <Image src="/businessmatrix-logo-crop.png" alt="BusinessMatrix" width={56} height={56} className="rounded-2xl shadow-lg mx-auto mb-6" />
          <h1 className="text-3xl font-black text-slate-900">List Your Business</h1>
          <p className="text-slate-500 mt-2">Join the global B2B network</p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${step >= i ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-500"}`}>{i + 1}</div>
              <span className={`text-xs font-bold hidden sm:inline ${step >= i ? "text-slate-900" : "text-slate-400"}`}>{s}</span>
              {i < STEPS.length - 1 && <div className={`w-8 h-0.5 sm:w-12 ${step > i ? "bg-indigo-600" : "bg-slate-200"}`} />}
            </div>
          ))}
        </div>

        <div className="card-premium p-8">
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="text-xl font-black text-slate-900">Basic Information</h2>
              <div>
                <label className="label-premium">Business Name</label>
                <input value={form.businessName} onChange={(e) => update("businessName", e.target.value)} className="input-premium" required />
              </div>
              <div>
                <label className="label-premium">Business Type</label>
                <div className="flex flex-wrap gap-2">
                  {businessTypes.map((t) => (
                    <button key={t} type="button" onClick={() => update("businessType", form.businessType.includes(t) ? form.businessType.filter((x) => x !== t) : [...form.businessType, t])} className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${form.businessType.includes(t) ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-slate-200 text-slate-500"}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-premium">Country</label>
                  <input value={form.country} onChange={(e) => update("country", e.target.value)} className="input-premium" />
                </div>
                <div>
                  <label className="label-premium">City</label>
                  <input value={form.city} onChange={(e) => update("city", e.target.value)} className="input-premium" />
                </div>
              </div>
              <div>
                <label className="label-premium">Contact Person</label>
                <input value={form.contactPerson} onChange={(e) => update("contactPerson", e.target.value)} className="input-premium" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-premium">Phone</label>
                  <input value={form.phone} onChange={(e) => update("phone", e.target.value)} className="input-premium" />
                </div>
                <div>
                  <label className="label-premium">Email</label>
                  <input value={form.email} onChange={(e) => update("email", e.target.value)} className="input-premium" />
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-xl font-black text-slate-900">Business Details</h2>
              <div>
                <label className="label-premium">Description</label>
                <textarea value={form.description} onChange={(e) => update("description", e.target.value)} className="input-premium h-24 resize-none" />
              </div>
              <div>
                <label className="label-premium">Products & Services</label>
                <textarea value={form.productsServices} onChange={(e) => update("productsServices", e.target.value)} className="input-premium h-20 resize-none" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="label-premium">Scale</label>
                  <select value={form.scale} onChange={(e) => update("scale", e.target.value)} className="input-premium">
                    <option value="">Select</option>
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Large">Large</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </div>
                <div>
                  <label className="label-premium">Turnover</label>
                  <select value={form.turnover} onChange={(e) => update("turnover", e.target.value)} className="input-premium">
                    <option value="">Select</option>
                    <option value="< $100K">&lt; $100K</option>
                    <option value="$100K - $1M">$100K - $1M</option>
                    <option value="$1M - $10M">$1M - $10M</option>
                    <option value="$10M+">$10M+</option>
                  </select>
                </div>
                <div>
                  <label className="label-premium">Years Active</label>
                  <input type="number" value={form.yearsActive} onChange={(e) => update("yearsActive", e.target.value)} className="input-premium" />
                </div>
              </div>
              <div>
                <label className="label-premium">Key Markets (comma separated)</label>
                <input value={form.keyMarkets} onChange={(e) => update("keyMarkets", e.target.value)} className="input-premium" placeholder="e.g., North America, Europe, Asia" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-xl font-black text-slate-900">Give & Ask</h2>
              <p className="text-xs text-slate-500">Tell the network what you offer and what you need.</p>
              <div>
                <label className="label-premium">What do you offer? (Give)</label>
                <textarea value={form.whatYouOffer} onChange={(e) => update("whatYouOffer", e.target.value)} className="input-premium h-24 resize-none" placeholder="Describe products, services, or capabilities you offer..." />
              </div>
              <div>
                <label className="label-premium">What do you need? (Ask)</label>
                <textarea value={form.whatYouNeed} onChange={(e) => update("whatYouNeed", e.target.value)} className="input-premium h-24 resize-none" placeholder="Describe what you're looking for..." />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-xl font-black text-slate-900">Media</h2>
              <div>
                <label className="label-premium">Logo URL</label>
                <input value={form.logo} onChange={(e) => update("logo", e.target.value)} className="input-premium" placeholder="https://..." />
              </div>
              <div>
                <label className="label-premium">Banner URL</label>
                <input value={form.banner} onChange={(e) => update("banner", e.target.value)} className="input-premium" placeholder="https://..." />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <h2 className="text-xl font-black text-slate-900">Review</h2>
              <div className="bg-slate-50 rounded-xl p-6 space-y-3">
                {Object.entries(form).filter(([, v]) => v && (Array.isArray(v) ? v.length > 0 : true)).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="font-bold text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="text-slate-900 font-medium text-right max-w-[60%]">
                      {Array.isArray(value) ? value.join(", ") : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t flex justify-between" style={{ borderColor: 'var(--border)' }}>
            {step > 0 ? (
              <button onClick={() => setStep(step - 1)} className="btn-premium btn-premium-secondary"><ArrowLeft size={16} /> Back</button>
            ) : <div />}
            {step < STEPS.length - 1 ? (
              <button onClick={() => setStep(step + 1)} className="btn-premium btn-premium-primary">Continue <ArrowRight size={16} /></button>
            ) : (
              <button onClick={handleSubmit} disabled={loading} className="btn-premium btn-premium-primary">
                {loading ? "Submitting..." : "Submit Listing"} <Globe size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
