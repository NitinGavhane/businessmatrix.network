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
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

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

      router.push("/directory/onboarding");
    } catch (err: any) {
      if (err?.name === "AbortError") {
        setError("Request timed out. Database may be unreachable.");
      } else {
        setError(err?.message || "Something went wrong. Please try again.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-12" style={{ background: '#FFFFFF' }}>
      <a href="https://www.businessmatrix.network/" className="fixed top-4 right-4 sm:top-6 sm:right-6 px-4 py-2 text-sm font-bold rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 transition-colors z-50">Back</a>
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8 sm:mb-10 animate-fade-in-up">
          <Link href="/" className="inline-flex items-center justify-center mb-6">
            <Image src="/businessmatrix-logo-original (1).png" alt="BusinessMatrix.Network" width={560} height={150} className="h-40 sm:h-44 w-auto" />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Create an Account</h1>
          <p className="text-sm sm:text-base text-slate-500 mt-2">Join the network</p>
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
                {!name && <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />}
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-premium pl-11" required />
              </div>
            </div>
            <div>
              <label className="label-premium">Email Address</label>
              <div className="relative">
                {!email && <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />}
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-premium pl-11" required />
              </div>
            </div>
            <div>
              <label className="label-premium">Password</label>
              <div className="relative">
                {!password && <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />}
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
                {!confirmPassword && <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />}
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

        <p className="text-center text-sm text-slate-500 mt-8 font-medium">
          Already have an account? <Link href="/directory/auth/login" className="font-bold hover:underline" style={{ color: '#1A6FD4' }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
