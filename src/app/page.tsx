import Image from "next/image";
import Link from "next/link";
import { Building2, Globe, Handshake, ArrowRight, Shield, Users, Zap, Sparkles, CheckCircle, MapPin } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/businessmatrix-logo-crop.png" alt="BusinessMatrix" width={36} height={36} className="rounded-xl" />
            <span className="font-black text-sm" style={{ color: 'var(--brand-primary)' }}>BusinessMatrix</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/directory" className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">Directory</Link>
            <Link href="/directory/auth/login" className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">Sign In</Link>
            <Link href="/directory/auth/signup" className="btn-premium btn-premium-primary py-2 px-5 text-xs">Register</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full opacity-[0.03] blur-[120px]" style={{ background: 'var(--brand-primary)' }} />
          <div className="absolute bottom-[-10%] right-[-5%] w-[40%]] h-[40%] rounded-full opacity-[0.03] blur-[120px]" style={{ background: 'var(--green)' }} />
        </div>
        <div className="max-w-6xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-sm font-bold text-indigo-700 mb-8">
            <Sparkles size={12} /> Global B2B Network
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.05] mb-6 tracking-tight">
            Connect &<br />
            <span className="gradient-text">Grow Together</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Intelligent B2B Platform
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/directory/auth/signup" className="btn-premium btn-premium-primary px-8 py-4 text-base">
              Join Now <ArrowRight size={18} />
            </Link>
            <Link href="/directory" className="btn-premium btn-premium-secondary px-8 py-4 text-base">
              Browse Directory
            </Link>
          </div>
          <div className="mt-16 flex items-center justify-center gap-8 text-base text-slate-400">
            <span className="flex items-center gap-2"><CheckCircle size={18} className="text-green-500" /> Verified Businesses</span>
            <span className="flex items-center gap-2"><CheckCircle size={18} className="text-green-500" /> AI Matchmaking</span>
            <span className="flex items-center gap-2"><CheckCircle size={18} className="text-green-500" /> Direct Messaging</span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-slate-900 rounded-3xl p-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              ["50+", "Countries"],
              ["8", "Business Types"],
              ["95%", "Match Accuracy"],
            ].map(([val, label]) => (
              <div key={label}>
                <div className="text-5xl font-black text-white mb-1">{val}</div>
                <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-slate-900 mb-4">How BusinessMatrix Works</h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">Connect with the right business partners through intelligent matching.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Building2, title: "Create Your Profile", desc: "List your business, products, and what you're looking for in a partner." },
              { icon: Zap, title: "AI Smart Matchmaking", desc: "Our algorithm finds the best matches based on your Give & Ask requirements." },
              { icon: Handshake, title: "Connect & Grow", desc: "Chat directly with matched partners and start doing business." },
            ].map((feature) => (
              <div key={feature.title} className="card-premium p-8 text-center">
                <div className="w-14 h-14 rounded-2xl gradient-brand flex items-center justify-center mx-auto mb-6">
                  <feature.icon size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-base text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Directory Preview */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-5xl font-black text-slate-900 mb-2">Featured Businesses</h2>
              <p className="text-lg text-slate-500">Top verified businesses in the network</p>
            </div>
            <Link href="/directory" className="btn-premium btn-premium-primary">View All <ArrowRight size={16} /></Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Sunrise Electronics Co.", type: "Manufacturer", location: "Shenzhen, China", desc: "Leading OEM/ODM electronics manufacturer with 15+ years of experience." },
              { name: "Mumbai Hub", type: "Wholesale Distributor", location: "Mumbai, India", desc: "Premium FMCG distributor serving 500+ retail chains across India." },
              { name: "GlobalFit Supplies", type: "Wholesaler", location: "Dubai, UAE", desc: "End-to-end fitness equipment supplier for commercial and home gyms." },
            ].map((biz) => (
              <div key={biz.name} className="card-premium p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center text-white font-black">{biz.name[0]}</div>
                  <div>
                    <h3 className="font-black text-slate-900 text-base">{biz.name}</h3>
                    <span className="text-xs font-bold text-indigo-600">{biz.type}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1 mb-3"><MapPin size={11} /> {biz.location}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{biz.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/20">
            <Globe size={28} className="text-white" />
          </div>
          <h2 className="text-5xl font-black text-slate-900 mb-4">Ready to Grow Your Network?</h2>
          <p className="text-lg text-slate-500 mb-8 max-w-lg mx-auto">Join Existing Global business already connecting on BusinessMatrix.network</p>
          <Link href="/directory/auth/signup" className="btn-premium btn-premium-primary px-10 py-4 text-base">
            Create Account <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image src="/businessmatrix-logo-crop.png" alt="BusinessMatrix" width={28} height={28} className="rounded-lg" />
            <span className="font-black text-xs" style={{ color: 'var(--brand-primary)' }}>BusinessMatrix</span>
          </div>
          <div className="flex items-center gap-6 text-xs font-bold text-slate-500">
            <Link href="/directory">Directory</Link>
            <Link href="/directory/auth/login">Sign In</Link>
            <Link href="/directory/auth/signup">Join Now</Link>
          </div>
          <p className="text-xs text-slate-400">&copy; 2026 BusinessMatrix. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
