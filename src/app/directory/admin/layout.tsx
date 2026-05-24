import { LayoutDashboard, Building2, Settings, Users } from "lucide-react";
import Link from "next/link";
import SignOutButton from "@/components/auth/SignOutButton";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex pt-[72px]" style={{ background: 'var(--bg-primary)' }}>
      <aside className="w-64 bg-white border-r hidden md:flex flex-col fixed top-0 bottom-0 left-0 z-40" style={{ borderColor: 'var(--border)' }}>
        <div className="p-6">
          <Link href="/" className="flex items-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg gradient-brand">
              <Building2 size={20} />
            </div>
            <div>
              <h2 className="font-black text-slate-900 text-sm leading-tight">Admin</h2>
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--gold)' }}>BusinessMatrix</span>
            </div>
          </Link>
          <nav className="space-y-1.5">
            <Link href="/directory/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--brand-primary)' }}>
              <LayoutDashboard size={16} /> Dashboard
            </Link>
            <Link href="/directory/admin/profile" className="flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:bg-slate-50 hover:text-slate-700 rounded-xl text-sm font-bold transition-all">
              <Settings size={16} /> Settings
            </Link>
          </nav>
        </div>
        <div className="mt-auto p-6 border-t" style={{ borderColor: 'var(--border)' }}>
          <SignOutButton />
        </div>
      </aside>
      <main className="flex-1 md:ml-64 p-6 md:p-10 pt-24">{children}</main>
    </div>
  );
}
