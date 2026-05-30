"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

interface Props {
  className?: string;
  mobile?: boolean;
}

export default function SignOutButton({ className = "", mobile }: Props) {
  if (mobile) {
    return (
      <button
        onClick={async () => {
          await signOut({ redirect: false });
          window.location.replace("/directory/auth/login");
        }}
        className="flex flex-col items-center gap-0.5 p-1.5 rounded-xl text-[0.625rem] font-bold text-slate-400 hover:text-rose-500 transition-all"
      >
        <LogOut size={20} />
        <span>Sign Out</span>
      </button>
    );
  }

  return (
    <button
      onClick={async () => {
        await signOut({ redirect: false });
        window.location.replace("/directory/auth/login");
      }}
      className={`flex items-center gap-3 px-3 py-2 w-full text-slate-400 hover:text-rose-500 rounded-xl text-sm font-bold transition-all ${className}`}
    >
      <LogOut size={16} /> Sign Out
    </button>
  );
}
