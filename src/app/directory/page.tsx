import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Building2, MapPin, CheckCircle, Search, Star, Zap } from "lucide-react";
import { prisma } from "@/lib/db";


export const metadata: Metadata = {
  title: "Business Directory — BusinessMatrix.Network",
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
      <section className="min-h-dvh flex flex-col" style={{ background: 'linear-gradient(160deg, #3D5A7A 0%, #2E4A6A 100%)' }}>
        <div className="w-full px-6 sm:px-10 lg:px-16 py-6 flex items-center justify-between">
          <Link href="/" className="flex flex-col items-center gap-1">
              <Image src="/businessmatrix-logo-crop.png" alt="BusinessMatrix.Network" width={100} height={100} className="h-14 sm:h-20 w-auto p-1" />
              <span className="text-white text-[6px] sm:text-[8px] tracking-[0.15em]">BUSINESSMATRIX.NETWORK</span>
          </Link>
          <Link href="/" className="text-sm font-bold text-white/80 hover:text-white transition-colors px-4 py-2 rounded-full border border-white/30 hover:border-white/60 transition-all">&larr; Back</Link>
        </div>

        <div className="flex-1 flex items-center px-4 sm:px-6 -mt-8 sm:-mt-12">
          <div className="container max-w-6xl w-full">

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8 mb-6 sm:mb-8">
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3 leading-tight">
                  Find Authentic<br /><span style={{ color: '#C9A84C' }}>Business Partners</span>
                </h1>
                <p className="text-white/70 text-sm sm:text-base max-w-lg">Verified businesses from across the globe.</p>
              </div>
              <Link href="/directory/auth/signup" className="inline-block font-bold text-[14px] tracking-wide px-7 py-3 rounded-full transition-all duration-200 hover:-translate-y-0.5 shrink-0 self-start lg:self-auto" style={{ background: '#C9A84C', color: '#FFFFFF', boxShadow: '0 4px 14px rgba(0,0,0,0.18)' }}>
                <Zap size={15} className="inline-block mr-1.5 -mt-0.5" /> List Your Business
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
              <div className="flex-1 flex items-center gap-3 bg-white/10 border border-white/15 rounded-xl px-4 py-3">
                <Search size={16} className="text-white/50 shrink-0" />
                <input type="text" placeholder="Search businesses, products, services..." className="bg-transparent text-white placeholder-white/50 text-sm outline-none w-full" />
              </div>
            </div>

          </div>
        </div>
      </section>

      <div className="container max-w-6xl py-8 sm:py-10 px-4 sm:px-6">
        <div className="flex gap-2 my-6 sm:my-8 overflow-x-auto no-scrollbar pb-1 -mx-4 sm:mx-0 px-4 sm:px-0">
          {filterChips.map((type) => (
            <button key={type} className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold border transition-all ${type === "All" ? "text-white border-[#1A6FD4]" : "bg-white text-slate-600 border-[#E5E5E5] hover:border-[#1A6FD4] hover:text-[#1A6FD4]"}`} style={type === "All" ? { background: '#1A6FD4', borderColor: '#1A6FD4' } : {}}>
              {type}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {listings.map((biz) => (
            <article key={biz.id} className="bg-white rounded-[6px] border border-[#E5E5E5] shadow-[0_2px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.14)] hover:-translate-y-0.5 transition-all duration-200 overflow-hidden">
              <div className={`h-1 bg-gradient-to-r ${biz.color}`} />
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${biz.color} flex items-center justify-center text-white font-black text-base shrink-0`}>{biz.name[0]}</div>
                  {biz.verified && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#10b981' }}>
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
                <div className="flex items-center gap-3 text-xs text-slate-400 pt-3 border-t border-slate-50">
                  <span className="flex items-center gap-1"><Star size={11} className="text-amber-400 fill-amber-400" /> {biz.rating}</span>
                  <span>{biz.yearsActive}y</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 sm:mt-14 p-6 sm:p-10 rounded-[6px] text-white text-center" style={{ background: 'linear-gradient(160deg, #3D5A7A 0%, #2E4A6A 100%)' }}>
          <Building2 size={36} className="mx-auto mb-4" style={{ color: '#C9A84C' }} />
          <h2 className="text-2xl font-black mb-2">Is Your Business Listed?</h2>
          <p className="text-white/70 mb-6 max-w-md mx-auto text-sm">Get discovered globally.</p>
          <Link href="/directory/auth/signup" className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-bold text-sm transition-all duration-200 hover:-translate-y-0.5" style={{ background: '#C9A84C', color: '#FFFFFF', boxShadow: '0 4px 14px rgba(0,0,0,0.18)' }}>
            <Zap size={15} /> List Your Business
          </Link>
        </div>
      </div>
    </div>
  );
}
