"use client";
import Image from "next/image";
import { LayoutDashboard, Settings, Users as UsersIcon, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import SignOutButton from "@/components/auth/SignOutButton";

const navLinks = [
  { href: "/directory/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/directory/admin/users", label: "Users", icon: UsersIcon },
  { href: "/directory/admin/profile", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  function isActive(href: string) {
    const p = pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname;
    if (href === "/directory/admin") return p === href;
    return p.startsWith(href);
  }

  useEffect(() => {
    import("next-auth/react").then(({ getSession }) => {
      getSession().then((session) => {
        if (!session) {
          router.replace("/directory/auth/login");
        }
      });
    });
  }, [router]);

  return (
    <div className="min-h-screen flex pt-[72px]" style={{ background: 'var(--bg-primary)' }}>
      <aside className="w-64 bg-white border-r hidden md:flex flex-col fixed top-0 bottom-0 left-0 z-40" style={{ borderColor: 'var(--border)' }}>
        <div className="p-6">
          <Link href="/directory/admin" className="flex items-center gap-3 mb-8">
            <Image src="/businessmatrix-logo-crop.png" alt="BusinessMatrix" width={44} height={44} className="rounded-xl shrink-0 shadow-lg" />
            <div>
              <h2 className="font-black text-slate-900 text-sm leading-tight">Admin</h2>
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-primary)' }}>BusinessMatrix</span>
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
                  style={active ? { background: 'var(--brand-primary)' } : {}}
                >
                  <link.icon size={16} /> {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="mt-auto p-6 border-t" style={{ borderColor: 'var(--border)' }}>
          <SignOutButton />
        </div>
      </aside>
      <main className="flex-1 md:ml-64 p-4 sm:p-6 md:p-10 pt-20 md:pt-24 pb-24 md:pb-10">{children}</main>

      {/* Mobile Bottom Nav */}
      <nav className="mobile-nav">
        {navLinks.map((link) => {
          const active = isActive(link.href);
          return (
            <Link key={link.href} href={link.href} className={active ? "active" : ""}>
              <link.icon size={20} />
              <span>{link.label}</span>
            </Link>
          );
        })}
        <SignOutButton mobile />
      </nav>
    </div>
  );
}
