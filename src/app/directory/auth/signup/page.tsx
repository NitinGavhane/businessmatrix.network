"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building2, Mail, Lock, User, ArrowRight, Globe } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      await signIn("credentials", {
        email,
        password,
        callbackUrl: "/directory/onboarding",
      });
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    signIn("google", { callbackUrl: "/directory/onboarding" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12" style={{ background: 'var(--bg-primary)' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full opacity-[0.04] blur-[120px]" style={{ background: 'var(--brand-primary)' }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-10 animate-fade-in-up">
          <Link href="/" className="inline-flex items-center justify-center mb-6">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg gradient-brand" style={{ boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)' }}>
              <Building2 size={28} />
            </div>
          </Link>
          <h1 className="text-3xl font-black text-slate-900">Create Account</h1>
          <p className="text-slate-500 mt-2">Join BusinessMatrix global directory</p>
        </div>

        <div className="card-premium p-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {error && (
            <div className="mb-6 p-4 rounded-xl text-xs font-bold text-center" style={{ background: 'var(--red-light)', border: '1px solid var(--red)', color: 'var(--red)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="label-premium">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-premium pl-11" required />
              </div>
            </div>
            <div>
              <label className="label-premium">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-premium pl-11" required />
              </div>
            </div>
            <div>
              <label className="label-premium">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-premium pl-11" required minLength={8} />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-premium btn-premium-primary w-full py-3.5">
              {loading ? "Creating Account..." : "Create Account"} <ArrowRight size={16} />
            </button>
          </form>

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t" style={{ borderColor: 'var(--border)' }}></div></div>
            <div className="relative flex justify-center"><span className="bg-white px-4 label-premium">Or continue with</span></div>
          </div>

          <button onClick={handleGoogleSignup} type="button" className="btn-premium btn-premium-secondary w-full mt-8 py-3.5">
            <Globe size={18} className="text-blue-500" /> Sign up with Google
          </button>
        </div>

        <p className="text-center text-sm text-slate-500 mt-8 font-medium">
          Already have an account? <Link href="/directory/auth/login" className="text-indigo-600 font-bold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
