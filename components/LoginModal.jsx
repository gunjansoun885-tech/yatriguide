"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LockKeyhole, Mail, ShieldCheck, X, KeyRound, CheckCircle2, ArrowLeft, Send, ShieldCheck as ShieldIcon } from "lucide-react";

const STORAGE_KEY = "yatri-guide-owner-auth";

export default function LoginModal({ isOpen, onClose }) {
  const [mode, setMode] = useState("login"); // "login" | "forgot"
  const [forgotStep, setForgotStep] = useState(1); // 1: Send Code, 2: Verify Code, 3: New Password

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");

  const [status, setStatus] = useState({ type: "", message: "" });
  const [demoCodeNotice, setDemoCodeNotice] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setIdentifier("");
    setPassword("");
    setVerificationCode("");
    setNewPassword("");
    setConfirmPassword("");
    setResetToken("");
    setStatus({ type: "", message: "" });
    setDemoCodeNotice("");
    setForgotStep(1);
    setMode("login");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    const cleanIdentifier = identifier.trim();
    const cleanPassword = password.trim();

    if (!cleanIdentifier || !cleanPassword) {
      setStatus({ type: "error", message: "Please enter your Email/Vehicle number and Password." });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleanIdentifier,
          password: cleanPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed. Please check your credentials.");
      }

      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          email: cleanIdentifier,
          password: cleanPassword,
        })
      );

      setStatus({ type: "success", message: "Login successful! Welcome to Yatriguide." });
      setTimeout(() => {
        handleClose();
      }, 1200);
    } catch (err) {
      setStatus({ type: "error", message: err.message || "Unable to log in right now." });
    } finally {
      setLoading(false);
    }
  };

  // STEP 1: Send Verification Code
  const handleSendCode = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });
    setDemoCodeNotice("");

    const cleanIdentifier = identifier.trim();
    if (!cleanIdentifier) {
      setStatus({ type: "error", message: "Please enter your Email Address or Vehicle Number." });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "SEND_CODE",
          identifier: cleanIdentifier,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to send verification code.");
      }

      setStatus({
        type: "success",
        message: data.message || "6-digit verification code sent to your email address!",
      });

      if (data.demoCode) {
        setDemoCodeNotice(data.demoCode);
      }

      setForgotStep(2);
    } catch (err) {
      setStatus({ type: "error", message: err.message || "Failed to send code. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify Code
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    const cleanCode = verificationCode.trim();
    if (!cleanCode || cleanCode.length < 6) {
      setStatus({ type: "error", message: "Please enter the 6-digit code sent to your email." });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "VERIFY_CODE",
          identifier: identifier.trim(),
          code: cleanCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Code verification failed.");
      }

      setResetToken(data.resetToken || "");
      setStatus({
        type: "success",
        message: "Code verified successfully! Please create your new password.",
      });
      setDemoCodeNotice("");
      setForgotStep(3);
    } catch (err) {
      setStatus({ type: "error", message: err.message || "Invalid or expired code." });
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: Create New Password
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    const cleanNewPass = newPassword.trim();
    const cleanConfPass = confirmPassword.trim();

    if (!cleanNewPass || cleanNewPass.length < 6) {
      setStatus({ type: "error", message: "New password must be at least 6 characters long." });
      return;
    }
    if (cleanNewPass !== cleanConfPass) {
      setStatus({ type: "error", message: "New password and Confirm password do not match." });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "UPDATE_PASSWORD",
          identifier: identifier.trim(),
          resetToken,
          newPassword: cleanNewPass,
          confirmPassword: cleanConfPass,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to update password.");
      }

      setStatus({
        type: "success",
        message: data.message || "Password updated successfully! Please sign in with your new password.",
      });

      setTimeout(() => {
        setMode("login");
        setPassword(cleanNewPass);
        setForgotStep(1);
        setStatus({ type: "success", message: "Password updated successfully! Sign in below." });
      }, 1500);
    } catch (err) {
      setStatus({ type: "error", message: err.message || "Password update failed." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-950/75 px-4 backdrop-blur-md"
        >
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 10, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md rounded-3xl border border-orange-200 bg-white p-6 shadow-2xl shadow-stone-950/40"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 rounded-full p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            {mode === "login" ? (
              <>
                <div className="mb-5 flex items-center gap-3">
                  <div className="rounded-2xl bg-orange-100 p-3 text-orange-600">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-orange-600">Yatriguide Portal</p>
                    <h2 className="text-2xl font-black text-stone-900">User & Owner Login</h2>
                  </div>
                </div>

                <p className="mb-5 text-sm text-stone-600">
                  Enter your email address or vehicle number and password to sign in.
                </p>

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-stone-700">
                      Email or Vehicle Number *
                    </label>
                    <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-3 py-3 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100">
                      <Mail className="h-4 w-4 text-stone-400" />
                      <input
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="email@example.com or UK07AB1234"
                        className="w-full bg-transparent text-sm text-stone-800 outline-none placeholder:text-stone-400"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                        Password *
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setMode("forgot");
                          setForgotStep(1);
                          setStatus({ type: "", message: "" });
                          setDemoCodeNotice("");
                        }}
                        className="text-xs font-semibold text-orange-600 hover:text-orange-700 hover:underline"
                      >
                        Forgot Password? (पासवर्ड भूल गए?)
                      </button>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-3 py-3 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100">
                      <LockKeyhole className="h-4 w-4 text-stone-400" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full bg-transparent text-sm text-stone-800 outline-none placeholder:text-stone-400"
                        required
                      />
                    </div>
                  </div>

                  {status.message && (
                    <div
                      className={`rounded-2xl border p-3 text-xs font-semibold ${
                        status.type === "success"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-rose-200 bg-rose-50 text-rose-700"
                      }`}
                    >
                      {status.message}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:from-orange-400 hover:to-orange-500 disabled:opacity-70 min-h-[46px]"
                  >
                    {loading ? "Signing in..." : "Sign In to Yatriguide"}
                  </button>
                </form>

                <div className="mt-5 border-t border-stone-100 pt-4 text-center text-xs text-stone-500">
                  New vehicle registration?{" "}
                  <a href="/contact" className="font-bold text-orange-600 hover:underline">
                    Register Travel Vehicle
                  </a>
                </div>
              </>
            ) : (
              <>
                {/* FORGOT PASSWORD FLOW */}
                <div className="mb-4 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (forgotStep > 1) {
                        setForgotStep((prev) => prev - 1);
                        setStatus({ type: "", message: "" });
                      } else {
                        setMode("login");
                        setStatus({ type: "", message: "" });
                      }
                    }}
                    className="rounded-xl border border-stone-200 p-2 text-stone-600 hover:bg-stone-100"
                    title="Back"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-orange-600">
                      Step {forgotStep} of 3 • Password Reset
                    </p>
                    <h2 className="text-xl font-black text-stone-900">
                      {forgotStep === 1
                        ? "Forgot Password"
                        : forgotStep === 2
                        ? "Enter Verification Code"
                        : "Create New Password"}
                    </h2>
                  </div>
                </div>

                {/* STEP 1: Enter Email / Vehicle No */}
                {forgotStep === 1 && (
                  <form onSubmit={handleSendCode} className="space-y-3.5">
                    <p className="text-xs text-stone-600">
                      Enter your Email Address or Vehicle Number. We will send a 6-digit verification code to your email.
                    </p>

                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-stone-700">
                        Email or Vehicle Number *
                      </label>
                      <div className="flex items-center gap-2.5 rounded-2xl border border-stone-200 bg-stone-50 px-3 py-2.5 focus-within:border-orange-500">
                        <Mail className="h-4 w-4 text-stone-400" />
                        <input
                          type="text"
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          placeholder="email@example.com or UK07AB1234"
                          className="w-full bg-transparent text-sm text-stone-800 outline-none placeholder:text-stone-400"
                          required
                        />
                      </div>
                    </div>

                    {status.message && (
                      <div
                        className={`rounded-2xl border p-3 text-xs font-semibold ${
                          status.type === "success"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-rose-200 bg-rose-50 text-rose-700"
                        }`}
                      >
                        {status.message}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:from-orange-400 hover:to-orange-500 disabled:opacity-70 min-h-[44px]"
                    >
                      <Send className="h-4 w-4" />
                      {loading ? "Sending Code..." : "Send Verification Code"}
                    </button>
                  </form>
                )}

                {/* STEP 2: Enter 6-Digit Code */}
                {forgotStep === 2 && (
                  <form onSubmit={handleVerifyCode} className="space-y-3.5">
                    <p className="text-xs text-stone-600">
                      Check your email inbox. Enter the 6-digit verification code sent to your email.
                    </p>

                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-stone-700">
                        6-Digit Verification Code *
                      </label>
                      <div className="flex items-center gap-2.5 rounded-2xl border border-orange-300 bg-orange-50/50 px-3 py-2.5 focus-within:border-orange-500">
                        <ShieldIcon className="h-4 w-4 text-orange-600" />
                        <input
                          type="text"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                          placeholder="e.g. 482915"
                          className="w-full bg-transparent text-lg font-mono font-bold tracking-widest text-orange-900 outline-none placeholder:text-stone-400 placeholder:font-normal placeholder:text-sm"
                          required
                          maxLength={6}
                          autoFocus
                        />
                      </div>
                    </div>

                    {demoCodeNotice && (
                      <div className="rounded-2xl border-2 border-orange-400 bg-orange-50/90 p-3.5 text-center shadow-xs">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-orange-800 mb-0.5">
                          🔑 Your 6-Digit OTP Code
                        </p>
                        <p className="text-3xl font-mono font-black tracking-[0.25em] text-orange-600 my-1">
                          {demoCodeNotice}
                        </p>
                        <p className="text-[10px] font-medium text-stone-500">
                          (Enter this 6-digit code below to verify and create your new password)
                        </p>
                      </div>
                    )}

                    {status.message && (
                      <div
                        className={`rounded-2xl border p-3 text-xs font-semibold ${
                          status.type === "success"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-rose-200 bg-rose-50 text-rose-700"
                        }`}
                      >
                        {status.message}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:from-orange-400 hover:to-orange-500 disabled:opacity-70 min-h-[44px]"
                    >
                      {loading ? "Verifying Code..." : "Verify Code & Proceed"}
                    </button>

                    <button
                      type="button"
                      onClick={handleSendCode}
                      disabled={loading}
                      className="w-full text-center text-xs font-semibold text-orange-600 hover:underline pt-1"
                    >
                      Didn&apos;t get code? Resend Code
                    </button>
                  </form>
                )}

                {/* STEP 3: Create New Password */}
                {forgotStep === 3 && (
                  <form onSubmit={handleUpdatePassword} className="space-y-3.5">
                    <p className="text-xs text-stone-600">
                      Code verified! Set your new password below.
                    </p>

                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-stone-700">
                        New Password *
                      </label>
                      <div className="flex items-center gap-2.5 rounded-2xl border border-stone-200 bg-stone-50 px-3 py-2.5 focus-within:border-orange-500">
                        <KeyRound className="h-4 w-4 text-stone-400" />
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Minimum 6 characters"
                          className="w-full bg-transparent text-sm text-stone-800 outline-none placeholder:text-stone-400"
                          required
                          minLength={6}
                          autoFocus
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-stone-700">
                        Confirm New Password *
                      </label>
                      <div className="flex items-center gap-2.5 rounded-2xl border border-stone-200 bg-stone-50 px-3 py-2.5 focus-within:border-orange-500">
                        <CheckCircle2 className="h-4 w-4 text-stone-400" />
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter new password"
                          className="w-full bg-transparent text-sm text-stone-800 outline-none placeholder:text-stone-400"
                          required
                          minLength={6}
                        />
                      </div>
                    </div>

                    {status.message && (
                      <div
                        className={`rounded-2xl border p-3 text-xs font-semibold ${
                          status.type === "success"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-rose-200 bg-rose-50 text-rose-700"
                        }`}
                      >
                        {status.message}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:from-orange-400 hover:to-orange-500 disabled:opacity-70 min-h-[44px]"
                    >
                      {loading ? "Saving Password..." : "Save & Create New Password"}
                    </button>
                  </form>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setForgotStep(1);
                    setStatus({ type: "", message: "" });
                  }}
                  className="w-full text-center text-xs font-semibold text-stone-600 hover:text-stone-800 pt-3 border-t border-stone-100 mt-4"
                >
                  ← Return to Sign In
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
