"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import MobileNav from "@/app/MobileNav";

export default function SiteHeader() {
  const pathname = usePathname();
  const isDirectory = pathname === "/directory";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b" style={{ borderColor: 'var(--border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/businessmatrix-logo-crop.png" alt="BusinessMatrix.Network" width={32} height={32} className="rounded-xl sm:w-9 sm:h-9" />
          <span className="font-black text-xs sm:text-sm" style={{ color: 'var(--brand-primary)' }}>BusinessMatrix.Network</span>
        </Link>
        <div className="hidden md:flex items-center gap-4">
          <Link href={isDirectory ? "/" : "/directory"} className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">{isDirectory ? "Home" : "Directory"}</Link>
          <Link href="/directory/auth/login" className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">Sign In</Link>
          <Link href="/directory/auth/signup" className="btn-premium btn-premium-primary py-2 px-5 text-xs">Register</Link>
        </div>
        <MobileNav isDirectory={isDirectory} />
      </div>
    </nav>
  );
}
