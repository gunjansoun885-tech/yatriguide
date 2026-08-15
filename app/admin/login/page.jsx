"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Compass, Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, Landmark } from "lucide-react";

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
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-sky-100/40 to-blue-50 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden text-slate-900 font-sans">
      {/* Light Blue Ambience & Background Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-400/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-blue-500/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Government Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-200 bg-sky-100/80 text-sky-800 text-xs font-bold uppercase tracking-widest mb-4 shadow-sm backdrop-blur-sm">
            <Landmark className="h-3.5 w-3.5 text-sky-600" />
            Government of Uttarakhand Portal
          </div>
          
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-tr from-sky-500 to-blue-600 rounded-2xl shadow-lg shadow-sky-500/30">
              <Compass className="h-8 w-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="font-serif text-3xl font-black tracking-tight text-slate-900">YatriGuide</h1>
              <p className="text-[10px] uppercase tracking-[0.25em] font-extrabold text-sky-600">
                Devbhoomi Control Center
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-2 font-medium">
            Authorized Portal for Tourist & Vehicle Pass Administration
          </p>
        </div>

        {/* Login Card (Light Blue & White Theme) */}
        <div className="rounded-3xl border border-sky-100 bg-white/95 p-7 sm:p-8 shadow-2xl shadow-sky-500/10 backdrop-blur-xl">
          <div className="mb-6 flex items-center justify-between pb-4 border-b border-sky-100">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="h-5 w-5 text-sky-600" />
              <span className="text-sm font-bold text-slate-800">Website Owner Sign In</span>
            </div>
            <span className="text-[10px] font-mono font-bold bg-sky-50 text-sky-700 px-2 py-0.5 rounded border border-sky-200">
              SSL SECURED
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Owner Email Address
              </label>
              <div className="flex items-center gap-3 rounded-2xl border border-sky-200 bg-sky-50/50 px-4 py-3.5 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/20 focus-within:bg-white transition">
                <Mail className="h-4 w-4 text-sky-500 shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@yatriguide.in"
                  className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400"
                  style={{ color: "#000000", WebkitTextFillColor: "#000000", fontWeight: 600 }}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Password
              </label>
              <div className="flex items-center gap-3 rounded-2xl border border-sky-200 bg-sky-50/50 px-4 py-3.5 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/20 focus-within:bg-white transition">
                <Lock className="h-4 w-4 text-sky-500 shrink-0" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400"
                  style={{ color: "#000000", WebkitTextFillColor: "#000000", fontWeight: 600 }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-sky-600 focus:outline-none p-1"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-semibold text-rose-700 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-rose-600 shrink-0 animate-pulse" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-500/25 transition hover:from-sky-600 hover:to-blue-700 active:scale-[0.99] disabled:opacity-60 min-h-[48px]"
            >
              {loading ? "Authenticating Administrator..." : "Access Control Center"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>

        <div className="text-center text-xs text-slate-500 mt-6 space-y-1 font-medium">
          <p>&copy; 2026 YatriGuide Devbhoomi Travel Portal</p>
          <p className="text-[11px] text-slate-500">Restricted to authorized officials only &bull; System activities are logged</p>
        </div>
      </div>
    </main>
  );
}
