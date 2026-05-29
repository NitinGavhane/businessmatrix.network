"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Mail, Lock, User, ArrowRight, Globe } from "lucide-react";

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
            <Image src="/businessmatrix-logo-crop.png" alt="BusinessMatrix" width={56} height={56} className="rounded-2xl shadow-lg" style={{ boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)' }} />
          </Link>
          <h1 className="text-3xl font-black text-slate-900">Join BusinessMatrix.network</h1>
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
