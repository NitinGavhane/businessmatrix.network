"use client";
import { Building2, MessageSquare, ShieldCheck, Zap, Settings, Users, LayoutDashboard, Crown, List } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SignOutButton from "@/components/auth/SignOutButton";

const navLinks = [
  { href: "/directory/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/directory/dashboard/directory", label: "Directory", icon: List },
  { href: "/directory/dashboard/matches", label: "Smart Matches", icon: Users },
  { href: "/directory/dashboard/messages", label: "Messages", icon: MessageSquare, hidden: true },
  { href: "/directory/dashboard/profile", label: "Business Profile", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/directory/dashboard") return pathname === href;
    return pathname.startsWith(href);
  }

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
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${active ? "text-white" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}`}
                  style={link.hidden ? { display: 'none' } : active ? { background: 'var(--brand-primary)' } : {}}
                >
                  <link.icon size={16} /> {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t" style={{ borderColor: 'var(--border)' }}>
          <div style={{ display: 'none' }}>
            <div className="p-4 rounded-xl text-white mb-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
              <div className="absolute top-0 right-0 p-3 opacity-10"><Crown size={48} /></div>
              <ShieldCheck size={20} className="mb-2" style={{ color: 'var(--gold)' }} />
              <h3 className="text-sm font-black mb-1">Upgrade to Premium</h3>
              <p className="text-[10px] text-slate-300 leading-relaxed mb-3">Unlock direct chat and AI matchmaking.</p>
              <button className="w-full py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5" style={{ background: 'var(--brand-primary)', color: 'white' }}>
                <Zap size={12} /> Upgrade Now
              </button>
            </div>
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
