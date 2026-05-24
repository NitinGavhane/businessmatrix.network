"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building2, Mail, Lock, ArrowRight, Globe } from "lucide-react";

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
      setError("Invalid email or password");
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

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/directory/dashboard" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full opacity-[0.04] blur-[120px]" style={{ background: 'var(--brand-primary)' }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full opacity-[0.04] blur-[120px]" style={{ background: 'var(--green)' }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-10 animate-fade-in-up">
          <Link href="/" className="inline-flex items-center justify-center mb-6">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 gradient-brand">
              <Building2 size={28} className="text-white" />
            </div>
          </Link>
          <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Welcome Back</h1>
          <p className="text-slate-500 text-base">Sign in to BusinessMatrix</p>
        </div>

        <div className="card-premium animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 rounded-xl text-xs font-bold text-center border" style={{ background: 'var(--red-light)', borderColor: 'var(--red)', color: 'var(--red)' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleEmailLogin} className="space-y-5">
              <div>
                <label className="label-premium">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-premium pl-11" required />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="label-premium mb-0">Password</label>
                  <Link href="#" className="text-xs font-bold" style={{ color: 'var(--brand-primary)' }}>Forgot?</Link>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-premium pl-11" required />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-premium btn-premium-primary w-full py-3.5">
                {loading ? "Signing in..." : "Sign In to Dashboard"} <ArrowRight size={16} />
              </button>
            </form>

            <div className="mt-8 relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t" style={{ borderColor: 'var(--border)' }}></div></div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 label-premium">Or continue with</span>
              </div>
            </div>

            <button onClick={handleGoogleLogin} type="button" className="btn-premium btn-premium-secondary w-full mt-8 py-3.5">
              <Globe size={18} className="text-blue-500" /> Sign in with Google
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-slate-500 mt-8 font-medium animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Don't have an account?{" "}
          <Link href="/directory/auth/signup" className="font-bold" style={{ color: 'var(--brand-primary)' }}>Create Account</Link>
        </p>
      </div>
    </div>
  );
}
