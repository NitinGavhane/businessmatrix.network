import type { Metadata } from "next";
import Link from "next/link";
import { Building2, MapPin, CheckCircle, ArrowRight, Search, Star, Zap } from "lucide-react";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Business Directory — BusinessMatrix",
  description: "Browse verified global businesses. Find manufacturers, wholesalers and service providers.",
};

const typeColors: Record<string, { bg: string, color: string, border: string }> = {
  "Manufacturer":            { bg: "rgba(64, 96, 144, 0.1)", color: "var(--brand-primary)", border: "rgba(64, 96, 144, 0.1)" },
  "Wholesale Distributor":   { bg: "var(--gold-light)", color: "var(--gold)", border: "var(--gold-light)" },
  "Wholesaler":              { bg: "var(--gold-light)", color: "var(--gold)", border: "var(--gold-light)" },
  "Service Provider":        { bg: "rgba(139, 92, 246, 0.1)", color: "#8b5cf6", border: "rgba(139, 92, 246, 0.1)" },
  "Retailer":                { bg: "rgba(236, 72, 153, 0.1)", color: "#ec4899", border: "rgba(236, 72, 153, 0.1)" },
};

const filterChips = ["All", "Manufacturer", "Wholesaler", "Retailer", "Service Provider"];

function getColor(type: string): string {
  const colors: Record<string, string> = {
    Manufacturer: "from-indigo-600 to-indigo-800",
    "Wholesale Distributor": "from-emerald-500 to-emerald-700",
    Wholesaler: "from-emerald-500 to-emerald-700",
    "Service Provider": "from-sky-500 to-sky-700",
    Retailer: "from-violet-500 to-violet-700",
  };
  return colors[type] || "from-slate-500 to-slate-700";
}

export default async function DirectoryPage() {
  const profiles = await prisma.businessProfile.findMany({
    include: { user: { select: { name: true } } },
    orderBy: { verified: "desc" },
  });

  const listings = profiles.map((p) => ({
    id: p.id,
    name: p.companyName,
    type: p.type,
    location: p.location || "Global",
    description: p.description || "",
    verified: p.verified,
    rating: 4.5,
    yearsActive: p.yearsActive || 3,
    tags: p.keyMarkets?.length ? p.keyMarkets : [p.category || "General"].filter(Boolean),
    color: getColor(p.type),
  }));

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <section className="bg-slate-900 pt-32 pb-16 px-6">
        <div className="container max-w-6xl">

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-3 leading-tight">
                Find Authentic<br /><span className="text-indigo-400">Business Partners</span>
              </h1>
              <p className="text-slate-400 text-base max-w-lg">Verified businesses from across the globe.</p>
            </div>
            <Link href="/directory/auth/signup" className="btn-premium btn-premium-primary shrink-0">
              <Zap size={15} /> List Your Business
            </Link>
          </div>

          <div className="flex gap-3 max-w-2xl">
            <div className="flex-1 flex items-center gap-3 bg-white/10 border border-white/15 rounded-xl px-4 py-3">
              <Search size={16} className="text-slate-500 shrink-0" />
              <input type="text" placeholder="Search businesses, products, services..." className="bg-transparent text-white placeholder-slate-500 text-sm outline-none w-full" />
            </div>

          </div>

          <div className="mt-12 p-1 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="bg-slate-900/50 rounded-xl px-6 py-5 flex flex-wrap items-center justify-between gap-6">
              {[["10,000+", "Businesses"], ["50+", "Countries"], ["8", "Business Types"], ["Verified", "Authenticity"]].map(([v, l]) => (
                <div key={l} className="flex flex-col">
                  <span className="text-xl font-black text-white">{v}</span>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="container max-w-6xl py-10 px-6">
        <div className="flex flex-wrap gap-2 mb-8">
          {filterChips.map((type) => (
            <button key={type} className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${type === "All" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"}`}>
              {type}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {listings.map((biz) => (
            <article key={biz.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden">
              <div className={`h-1.5 bg-gradient-to-r ${biz.color}`} />
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${biz.color} flex items-center justify-center text-white font-black text-base shrink-0`}>{biz.name[0]}</div>
                  {biz.verified && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-[10px] font-bold text-emerald-700">
                      <CheckCircle size={10} /> Verified
                    </div>
                  )}
                </div>
                <h2 className="font-black text-slate-900 text-sm leading-snug mb-1">{biz.name}</h2>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${typeColors[biz.type] || "bg-slate-50 text-slate-600 border-slate-200"}`}>{biz.type}</span>
                  <span className="flex items-center gap-1 text-[11px] text-slate-400"><MapPin size={10} /> {biz.location}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">{biz.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {biz.tags.map((tag: string) => (
                    <span key={tag} className="px-2 py-0.5 bg-slate-100 rounded-full text-[10px] font-semibold text-slate-500">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Star size={11} className="text-amber-400 fill-amber-400" /> {biz.rating}</span>
                    <span>{biz.yearsActive}y</span>
                  </div>
                  <button className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:gap-2 transition-all">View Details <ArrowRight size={12} /></button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-14 p-10 bg-slate-900 rounded-2xl text-white text-center">
          <Building2 size={36} className="mx-auto mb-4 text-indigo-400" />
          <h2 className="text-2xl font-black mb-2">Is Your Business Listed?</h2>
          <p className="text-slate-400 mb-6 max-w-md mx-auto text-sm">Get discovered globally.</p>
          <Link href="/directory/auth/signup" className="inline-flex items-center gap-2 px-7 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm transition-all">
            <Zap size={15} /> List Your Business
          </Link>
        </div>
      </div>
    </div>
  );
}
