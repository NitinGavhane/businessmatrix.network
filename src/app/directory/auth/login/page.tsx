"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    const res = await fetch("/api/auth/session");
    const session = await res.json();
    if (session?.user?.role === "ADMIN") {
      router.push("/directory/admin");
    } else {
      router.push("/directory/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #3D5A7A 0%, #2E4A6A 100%)' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8 sm:mb-10 animate-fade-in-up">
          <Link href="/" className="inline-flex items-center justify-center mb-6">
            <Image src="/businessmatrix-logo-crop.png" alt="BusinessMatrix.Network" width={48} height={48} className="sm:w-14 sm:h-14 rounded-2xl shadow-lg" style={{ boxShadow: '0 4px 14px rgba(0,0,0,0.25)' }} />
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3 tracking-tight">Welcome Back</h1>
          <p className="text-sm sm:text-base text-white/70">Sign in to BusinessMatrix.Network</p>
        </div>

        <div className="card-premium animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="p-5 sm:p-8">
            {error && (
              <div className="mb-6 p-4 rounded-xl text-xs font-bold text-center border" style={{ background: 'var(--red-light)', borderColor: 'var(--red)', color: 'var(--red)' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleEmailLogin} className="space-y-5">
              <div>
                <label className="label-premium">Email Address</label>
                <div className="relative">
                  {!email && <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />}
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-premium pl-11" required />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="label-premium mb-0">Password</label>
                  <Link href="#" className="text-xs font-bold" style={{ color: 'var(--brand-primary)' }}>Forgot?</Link>
                </div>
                <div className="relative">
                  {!password && <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />}
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-premium pl-11" required />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-premium btn-premium-primary w-full py-3.5">
                {loading ? "Signing in..." : "Sign In to Dashboard"} <ArrowRight size={16} />
              </button>
            </form>


          </div>
        </div>

        <p className="text-center text-sm text-white/70 mt-8 font-medium animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Don't have an account?{" "}
          <Link href="/directory/auth/signup" className="font-bold" style={{ color: '#C9A84C' }}>Create Account</Link>
        </p>
      </div>
    </div>
  );
}
