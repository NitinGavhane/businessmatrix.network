"use client";

import { Lock } from "lucide-react";

export default function MessagesPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center py-20">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Lock size={28} className="text-slate-400" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-3">Messages Locked</h2>
        <p className="text-slate-500 text-sm max-w-md mx-auto mb-8">
          Upgrade to Premium to unlock direct messaging with your matches and partners.
        </p>
        <button className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-xl text-sm font-black transition-all">
          Upgrade to Premium
        </button>
      </div>
    </div>
  );
}
