"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";

export default function NewRequirementPage() {
  const router = useRouter();
  const [type, setType] = useState<"GIVE" | "ASK">("GIVE");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
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

      <form onSubmit={handleSubmit} className="card-premium p-8 space-y-6">
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

        <div>
          <label className="label-premium">Category</label>
          <input value={category} onChange={(e) => setCategory(e.target.value)} className="input-premium" placeholder="e.g., Electronics, Packaging, Logistics" required />
        </div>

        <div>
          <label className="label-premium">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="input-premium h-28 resize-none" placeholder="Describe what you offer or need..." required />
        </div>

        <div>
          <label className="label-premium">Tags (comma separated)</label>
          <input value={tags} onChange={(e) => setTags(e.target.value)} className="input-premium" placeholder="e.g., wholesale, OEM, certified" />
        </div>

        <button type="submit" disabled={loading} className="btn-premium btn-premium-primary w-full">
          <Send size={16} /> {loading ? "Posting..." : "Post Requirement"}
        </button>
      </form>
    </div>
  );
}
