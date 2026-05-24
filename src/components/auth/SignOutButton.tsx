"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

interface Props {
  className?: string;
}

export default function SignOutButton({ className = "" }: Props) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/directory/auth/login" })}
      className={`flex items-center gap-3 px-3 py-2 w-full text-slate-400 hover:text-rose-500 rounded-xl text-sm font-bold transition-all ${className}`}
    >
      <LogOut size={16} /> Sign Out
    </button>
  );
}
