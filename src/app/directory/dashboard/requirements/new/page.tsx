"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, Check, X } from "lucide-react";

const tagSuggestions = [
  "wholesale", "retail", "OEM", "ODM", "certified", "organic", "eco-friendly",
  "bulk", "premium", "luxury", "handmade", "custom", "import", "export",
  "B2B", "B2C", "direct", "distributor", "manufacturer", "supplier",
  "private label", "white label", "raw", "finished", "sustainable",
  "recycled", "biodegradable", "halal", "kosher",
  "high quality", "low cost", "fast delivery", "made to order",
];

const categorySuggestions = [
  "Electronics", "Packaging", "Logistics", "Raw Materials", "Chemicals", "Textiles",
  "Machinery", "Automotive", "Pharmaceuticals", "Medical", "Food & Beverage",
  "Cosmetics", "Plastics & Rubber", "Metals", "Construction", "Agriculture",
  "IT & Software", "Hardware", "Cloud Services", "Consulting", "Transportation",
  "Furniture", "Apparel", "Footwear", "Jewelry", "Sports Equipment", "Toys",
  "Pet Supplies", "Office Supplies", "Printing", "Industrial Equipment",
  "Electrical", "Solar Energy", "Batteries", "Lighting", "Sanitary",
  "Ceramics & Glass", "Paints & Coatings", "Lubricants", "Fuels",
  "OEM Services", "Spare Parts", "Tools", "Safety Equipment",
  "Laboratory Equipment", "Marketing", "Digital Services", "IoT",
  "Security Systems", "Biometrics",
];

function TagInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [focusedIdx, setFocusedIdx] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const lastWord = value.split(",").pop()?.trim().toLowerCase() || "";
  const matches = lastWord.length >= 1
    ? tagSuggestions.filter((s) => s.toLowerCase().includes(lastWord) && !value.toLowerCase().includes(s.toLowerCase())).slice(0, 8)
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
      <label className="label-premium">Tags (comma separated)</label>
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true); setFocusedIdx(-1); }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        className="input-premium"
        placeholder="e.g., wholesale, OEM, certified"
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

function CategoryInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [focusedIdx, setFocusedIdx] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const lastWord = value.split(",").pop()?.trim().toLowerCase() || "";
  const matches = lastWord.length >= 1
    ? categorySuggestions.filter((s) => s.toLowerCase().includes(lastWord) && !value.toLowerCase().includes(s.toLowerCase())).slice(0, 8)
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
      <label className="label-premium">Category</label>
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true); setFocusedIdx(-1); }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        className="input-premium"
        placeholder="e.g., Electronics, Packaging, Logistics"
        required
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

export default function NewRequirementPage() {
  const router = useRouter();
  const [type, setType] = useState<"GIVE" | "ASK">("GIVE");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setShowConfirm(false);
    try {
      const res = await fetch("/api/directory/requirements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          category,
          description,
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
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
    <div className="max-w-2xl mx-auto space-y-8">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-700">
        <ArrowLeft size={16} /> Back
      </button>

      <h1 className="text-3xl font-black text-slate-900">New Requirement</h1>

      <form onSubmit={(e) => { e.preventDefault(); setShowConfirm(true); }} className="card-premium p-8 space-y-6">
        <div>
          <label className="label-premium">Type</label>
          <div className="flex gap-3">
            <button type="button" onClick={() => setType("GIVE")} className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all ${type === "GIVE" ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-500"}`}>
              Give (I Offer)
            </button>
            <button type="button" onClick={() => setType("ASK")} className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all ${type === "ASK" ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-slate-200 text-slate-500"}`}>
              Ask (I Need)
            </button>
          </div>
        </div>

        <CategoryInput value={category} onChange={setCategory} />

        <div>
          <label className="label-premium">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="input-premium h-28 resize-none" placeholder="Describe what you offer or need..." required />
        </div>

        <TagInput value={tags} onChange={setTags} />

        <button type="submit" disabled={loading} className="btn-premium btn-premium-primary w-full">
          <Send size={16} /> {loading ? "Posting..." : "Post Requirement"}
        </button>
      </form>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 mx-4 animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-slate-900">Confirm Requirement</h3>
              <button onClick={() => setShowConfirm(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Type:</span><span className="font-bold text-slate-900">{type === "GIVE" ? "Give (I Offer)" : "Ask (I Need)"}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Category:</span><span className="font-bold text-slate-900">{category}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Tags:</span><span className="font-bold text-slate-900">{tags || "—"}</span></div>
              <div><span className="text-slate-500 block mb-1">Description:</span><p className="font-medium text-slate-900 bg-slate-50 rounded-lg p-3">{description}</p></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowConfirm(false)} className="flex-1 py-3 rounded-xl text-sm font-bold border-2 border-slate-200 text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={handleSubmit} disabled={loading} className="flex-1 py-3 rounded-xl text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-500 flex items-center justify-center gap-2">
                {loading ? "Posting..." : <><Check size={16} /> Confirm & Post</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
