"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LockKeyhole, Mail, ShieldCheck } from "lucide-react";

const STORAGE_KEY = "yatri-guide-owner-auth";

export default function StartupLoginPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedAuth = window.localStorage.getItem(STORAGE_KEY);

    if (!savedAuth) {
      setIsOpen(true);
      const autoCloseTimer = window.setTimeout(() => {
        setIsOpen(false);
      }, 5000);

      return () => window.clearTimeout(autoCloseTimer);
    }

    try {
      const parsed = JSON.parse(savedAuth);
      if (parsed?.email && parsed?.password) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
        const autoCloseTimer = window.setTimeout(() => {
          setIsOpen(false);
        }, 5000);

        return () => window.clearTimeout(autoCloseTimer);
      }
    } catch {
      setIsOpen(true);
      const autoCloseTimer = window.setTimeout(() => {
        setIsOpen(false);
      }, 5000);

      return () => window.clearTimeout(autoCloseTimer);
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError("Email and password are required.");
      return;
    }

    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);
    if (!validEmail) {
      setError("Please enter a valid email address.");
      return;
    }

    if (trimmedPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: trimmedEmail,
          password: trimmedPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed.");
        return;
      }

      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          email: trimmedEmail,
          password: trimmedPassword,
        }),
      );

      setError("");
      setIsOpen(false);
    } catch {
      setError("Unable to process login right now.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-950/70 px-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 10, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-md rounded-3xl border border-orange-200 bg-white p-6 shadow-2xl shadow-stone-950/30"
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl bg-orange-100 p-3 text-orange-600">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-orange-600">Owner Access</p>
                <h2 className="text-2xl font-black text-stone-900">Private Login</h2>
              </div>
            </div>

            <p className="mb-5 text-sm text-stone-600">
              Enter your email and create a secure password to continue to the private owner area.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-stone-700">Email Address</span>
                <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-3 py-3 focus-within:border-orange-500">
                  <Mail className="h-4 w-4 text-stone-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-transparent text-sm text-stone-800 outline-none placeholder:text-stone-400"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-stone-700">Create Password</span>
                <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-3 py-3 focus-within:border-orange-500">
                  <LockKeyhole className="h-4 w-4 text-stone-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full bg-transparent text-sm text-stone-800 outline-none placeholder:text-stone-400"
                  />
                </div>
              </label>

              {error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>
              ) : null}

              <button
                type="submit"
                className="w-full rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:from-orange-400 hover:to-orange-500"
              >
                Continue to Website
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
