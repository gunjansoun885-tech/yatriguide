"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Compass, Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, Building2, Landmark } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your admin email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed. Invalid credentials.");
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err.message || "Unable to log in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-stone-950 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden text-stone-100 font-sans">
      {/* Background Ambience & Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Government Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-bold uppercase tracking-widest mb-4">
            <Landmark className="h-3.5 w-3.5" />
            Government of Uttarakhand Portal
          </div>
          
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-tr from-orange-500 to-amber-500 rounded-2xl shadow-lg shadow-orange-500/20">
              <Compass className="h-8 w-8 text-stone-950" />
            </div>
            <div className="text-left">
              <h1 className="font-serif text-3xl font-black tracking-tight text-white">YatriGuide</h1>
              <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-orange-400">
                Devbhoomi Control Center
              </p>
            </div>
          </div>
          <p className="text-xs text-stone-400 mt-2">
            Authorized Portal for Tourist & Vehicle Pass Administration
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl border border-stone-800 bg-stone-900/90 p-7 sm:p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-6 flex items-center justify-between pb-4 border-b border-stone-800">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="h-5 w-5 text-orange-500" />
              <span className="text-sm font-bold text-stone-200">Administrator Sign In</span>
            </div>
            <span className="text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800">
              SSL SECURED
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                Admin Email Address
              </label>
              <div className="flex items-center gap-3 rounded-2xl border border-stone-800 bg-stone-950 px-4 py-3.5 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20 transition">
                <Mail className="h-4 w-4 text-stone-500 shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@yatriguide.in"
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-stone-600"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                Password
              </label>
              <div className="flex items-center gap-3 rounded-2xl border border-stone-800 bg-stone-950 px-4 py-3.5 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20 transition">
                <Lock className="h-4 w-4 text-stone-500 shrink-0" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-stone-600"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-stone-500 hover:text-stone-300 focus:outline-none p-1"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-2xl border border-rose-900/60 bg-rose-950/50 p-3.5 text-xs font-semibold text-rose-300 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-rose-500 shrink-0 animate-pulse" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:from-orange-400 hover:to-amber-500 active:scale-[0.99] disabled:opacity-60 min-h-[48px]"
            >
              {loading ? "Authenticating Administrator..." : "Access Control Center"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>

        <div className="text-center text-xs text-stone-500 mt-6 space-y-1">
          <p>&copy; 2026 YatriGuide Devbhoomi Travel Portal</p>
          <p className="text-[11px] text-stone-600">Restricted to authorized officials only &bull; System activities are logged</p>
        </div>
      </div>
    </main>
  );
}
