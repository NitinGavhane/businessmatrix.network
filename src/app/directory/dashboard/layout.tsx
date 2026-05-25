import { Building2, MessageSquare, ShieldCheck, Zap, Settings, Users, LayoutDashboard, Crown, List } from "lucide-react";
import Link from "next/link";
import SignOutButton from "@/components/auth/SignOutButton";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex pt-[72px]" style={{ background: 'var(--bg-primary)' }}>
      <aside className="w-64 bg-white border-r hidden md:flex flex-col fixed top-0 bottom-0 left-0 z-40" style={{ borderColor: 'var(--border)' }}>
        <div className="p-6">
          <Link href="/" className="flex items-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg gradient-brand" style={{ boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)' }}>
              <Building2 size={20} />
            </div>
            <div>
              <h2 className="font-black text-slate-900 text-sm leading-tight">BusinessMatrix</h2>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--gold)' }}>Network</span>
              </div>
            </div>
          </Link>

          <nav className="space-y-1.5">
            <Link href="/directory/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--brand-primary)' }}>
              <LayoutDashboard size={16} /> Overview
            </Link>
            <Link href="/directory/dashboard/directory" className="flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:bg-slate-50 hover:text-slate-700 rounded-xl text-sm font-bold transition-all">
              <List size={16} /> Directory
            </Link>
            <Link href="/directory/dashboard/matches" className="flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:bg-slate-50 hover:text-slate-700 rounded-xl text-sm font-bold transition-all">
              <Users size={16} /> Smart Matches
            </Link>
            <Link href="/directory/dashboard/messages" className="flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:bg-slate-50 hover:text-slate-700 rounded-xl text-sm font-bold transition-all" style={{ display: 'none' }}>
              <MessageSquare size={16} /> Messages
            </Link>
            <Link href="/directory/dashboard/profile" className="flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:bg-slate-50 hover:text-slate-700 rounded-xl text-sm font-bold transition-all" style={{ display: 'none' }}>
              <Settings size={16} /> Business Profile
            </Link>
          </nav>
        </div>

        <div className="mt-auto p-6 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="p-4 rounded-xl text-white mb-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
            <div className="absolute top-0 right-0 p-3 opacity-10"><Crown size={48} /></div>
            <ShieldCheck size={20} className="mb-2" style={{ color: 'var(--gold)' }} />
            <h3 className="text-sm font-black mb-1">Upgrade to Premium</h3>
            <p className="text-[10px] text-slate-300 leading-relaxed mb-3">Unlock direct chat and AI matchmaking.</p>
            <button className="w-full py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5" style={{ background: 'var(--brand-primary)', color: 'white' }}>
              <Zap size={12} /> Upgrade Now
            </button>
          </div>
          <SignOutButton />
        </div>
      </aside>

      <main className="flex-1 md:ml-64 p-6 md:p-10 pt-24">
        {children}
      </main>
    </div>
  );
}
