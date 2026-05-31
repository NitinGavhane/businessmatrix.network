"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Mail, Lock, User, ArrowRight } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const passwordRules = {
    minLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const passwordsMatch = password === confirmPassword;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!passwordsMatch) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

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

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #3D5A7A 0%, #2E4A6A 100%)' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8 sm:mb-10 animate-fade-in-up">
          <Link href="/" className="inline-flex items-center justify-center mb-6">
            <Image src="/businessmatrix-logo-crop.png" alt="BusinessMatrix.Network" width={48} height={48} className="sm:w-14 sm:h-14 rounded-2xl shadow-lg" style={{ boxShadow: '0 4px 14px rgba(64, 96, 144, 0.3)' }} />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Join BusinessMatrix.Network</h1>
        </div>

        <div className="bg-white rounded-[6px] border border-[#E5E5E5] p-5 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.08)] animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
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
              {password && (
                <div className="mt-3 space-y-1.5">
                  <div className={`text-xs ${passwordRules.minLength ? 'text-green-600' : 'text-slate-400'}`}>{passwordRules.minLength ? '✓' : '○'} At least 8 characters</div>
                  <div className={`text-xs ${passwordRules.hasUpper ? 'text-green-600' : 'text-slate-400'}`}>{passwordRules.hasUpper ? '✓' : '○'} One uppercase letter</div>
                  <div className={`text-xs ${passwordRules.hasLower ? 'text-green-600' : 'text-slate-400'}`}>{passwordRules.hasLower ? '✓' : '○'} One lowercase letter</div>
                  <div className={`text-xs ${passwordRules.hasNumber ? 'text-green-600' : 'text-slate-400'}`}>{passwordRules.hasNumber ? '✓' : '○'} One number</div>
                  <div className={`text-xs ${passwordRules.hasSpecial ? 'text-green-600' : 'text-slate-400'}`}>{passwordRules.hasSpecial ? '✓' : '○'} One special character</div>
                </div>
              )}
            </div>
            <div>
              <label className="label-premium">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input-premium pl-11" required />
              </div>
              {confirmPassword && !passwordsMatch && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
              )}
            </div>
            <button type="submit" disabled={loading || (!!password && !passwordsMatch)} className="btn-premium btn-premium-primary w-full py-3.5">
              {loading ? "Creating Account..." : "Create Account"} <ArrowRight size={16} />
            </button>
          </form>


        </div>

        <p className="text-center text-sm text-white/70 mt-8 font-medium">
          Already have an account? <Link href="/directory/auth/login" className="font-bold hover:underline" style={{ color: '#C9A84C' }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
