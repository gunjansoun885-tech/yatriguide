"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  MapPin,
  PhoneCall,
  ShieldAlert,
  Ambulance,
  LifeBuoy,
  Flame,
  Download,
  Printer,
  Calendar,
  Car,
  User,
  Users,
  AlertCircle,
  CheckCircle2,
  Copy,
  Check,
  Lock,
  Unlock,
  KeyRound,
  PlusCircle,
  X,
  Route,
} from "lucide-react";
import LoginModal from "@/components/LoginModal";

const EXTEND_DESTINATIONS = [
  "Haldwani",
  "Kathgodam",
  "Nainital",
  "Almora",
  "Ranikhet",
  "Kausani",
  "Bhimtal",
  "Mukteshwar",
  "Rishikesh",
  "Haridwar",
  "Dehradun",
  "Mussoorie",
  "Kedarnath",
  "Badrinath",
  "Gangotri",
  "Yamunotri",
  "Chopta",
  "Auli",
  "Joshimath",
  "Pithoragarh",
  "Chamoli",
  "Rudraprayag",
  "Uttarkashi",
  "Tehri",
  "Other",
];

// Masking & Encryption Helpers for Privacy (Public Scan View)
const maskVehicleNumber = (veh) => {
  if (!veh) return "XXXX-XXXX";
  const str = String(veh).trim();
  if (str.length <= 4) return "X".repeat(str.length);
  const start = str.slice(0, 4);
  const end = str.slice(-2);
  const middle = "X".repeat(Math.max(2, str.length - 6));
  return `${start} ${middle} ${end}`;
};

const maskName = (name) => {
  if (!name) return "XXXXXX";
  const words = String(name).trim().split(/\s+/);
  return words
    .map((w) => (w.length <= 1 ? "X" : w[0] + "X".repeat(w.length - 1)))
    .join(" ");
};

const maskPhone = (phone) => {
  if (!phone) return "XXXXXXXXXX";
  const str = String(phone).trim();
  if (str.length <= 4) return "X".repeat(str.length);
  return "X".repeat(str.length - 4) + str.slice(-4);
};

const maskRoute = (route) => {
  if (!route) return "XXXXXX";
  const str = String(route).trim();
  if (str.length <= 2) return "XX";
  return str[0] + "X".repeat(Math.max(3, str.length - 2)) + str.slice(-1);
};

const maskDate = (dateStr) => {
  if (!dateStr) return "XXXX-XX-XX";
  return "XXXX-XX-XX";
};

const formatAadhaar = (aadhar, isUnmasked = false) => {
  if (!aadhar) return "•••• •••• ••••";
  const str = String(aadhar).trim().replace(/\s+/g, "");
  if (isUnmasked) {
    return str.replace(/(\d{4})(?=\d)/g, "$1 ");
  }
  if (str.length >= 4) {
    return `•••• •••• ${str.slice(-4)}`;
  }
  return "•••• •••• ••••";
};

export default function PassClientView({
  registration: initialRegistration,
  qrCodeUrl: initialQrUrl,
  error,
  isInitialAuth = false,
}) {
  const [registration, setRegistration] = useState(initialRegistration);
  const [qrCodeUrl, setQrCodeUrl] = useState(initialQrUrl);
  const [copied, setCopied] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(isInitialAuth);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Extend Journey Route Modal States
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);
  const [extendDestination, setExtendDestination] = useState("Haldwani");
  const [extendOtherDestination, setExtendOtherDestination] = useState("");
  const [extendNewTourTo, setExtendNewTourTo] = useState("");
  const [extendPassword, setExtendPassword] = useState("");
  const [extendStatus, setExtendStatus] = useState({ type: "", message: "" });
  const [isExtending, setIsExtending] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !registration) return;

    if (isInitialAuth) {
      setIsLoggedIn(true);
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const authParam =
      params.get("auth") === "1" ||
      params.get("unmask") === "1" ||
      params.get("login") === "1";

    if (authParam) {
      setIsLoggedIn(true);
      return;
    }

    const savedAuth = window.localStorage.getItem("yatri-guide-owner-auth");
    if (savedAuth) {
      try {
        const parsed = JSON.parse(savedAuth);
        if (parsed.password) {
          setExtendPassword(parsed.password);
        }
        if (parsed.auth === true || (parsed.registrationId && parsed.registrationId === registration.id)) {
          setIsLoggedIn(true);
          return;
        }
        const normSaved = (parsed.email || "").replace(/[\s-]/g, "").toLowerCase();
        const normVeh = (registration.vehicleNumber || "").replace(/[\s-]/g, "").toLowerCase();
        const normEmail = (registration.email || "").trim().toLowerCase();
        const normId = (registration.id || "").replace(/[\s-]/g, "").toLowerCase();

        if (
          normSaved &&
          (normSaved === normVeh || normSaved === normEmail || normSaved === normId)
        ) {
          setIsLoggedIn(true);
          return;
        }
      } catch {}
    }
  }, [registration, isInitialAuth]);

  const handleCopyPassLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleExtendSubmit = async (e) => {
    e.preventDefault();
    const finalDestination =
      extendDestination === "Other" ? extendOtherDestination.trim() : extendDestination.trim();

    if (!finalDestination) {
      setExtendStatus({ type: "error", message: "Please enter or select a destination." });
      return;
    }
    if (!extendPassword.trim()) {
      setExtendStatus({ type: "error", message: "Please enter your registration password." });
      return;
    }

    setIsExtending(true);
    setExtendStatus({ type: "loading", message: "Extending route..." });

    try {
      const response = await fetch("/api/pass/extend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrationId: registration.id,
          password: extendPassword.trim(),
          newDestination: finalDestination,
          newTourTo: extendNewTourTo.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setExtendStatus({ type: "error", message: data.error || "Failed to extend route." });
        setIsExtending(false);
        return;
      }

      setRegistration(data.registration);
      if (data.passUrl && typeof window !== "undefined") {
        const nextUrl = isLoggedIn && !data.passUrl.includes("auth=1") ? `${data.passUrl}&auth=1` : data.passUrl;
        window.history.replaceState({}, "", nextUrl);
      }

      setExtendStatus({
        type: "success",
        message: `✅ Route extended to ${finalDestination}!`,
      });

      setTimeout(() => {
        setIsExtendModalOpen(false);
        setExtendOtherDestination("");
        setExtendStatus({ type: "", message: "" });
      }, 1400);
    } catch (err) {
      setExtendStatus({ type: "error", message: "Network error. Please try again." });
    } finally {
      setIsExtending(false);
    }
  };

  if (error || !registration) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-lg">
        <AlertCircle className="mx-auto h-12 w-12 text-rose-500 mb-3" />
        <h2 className="text-xl font-bold text-stone-900">Pass Not Found</h2>
        <p className="mt-2 text-sm text-stone-600">{error || "Registration pass not found or ID is invalid."}</p>
        <Link
          href="/contact"
          className="mt-6 inline-block rounded-xl bg-orange-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-orange-700"
        >
          Register Travel Vehicle
        </Link>
      </div>
    );
  }

  const driverName =
    registration.driverType === "owner"
      ? registration.ownerName
      : registration.driverType === "driver"
        ? registration.driverName
        : registration.otherName;

  const driverPhone =
    registration.driverType === "owner"
      ? registration.ownerPhone
      : registration.driverType === "driver"
        ? registration.driverPhone
        : registration.otherPhone;

  const driverAadhaar =
    registration.driverType === "owner"
      ? registration.ownerAadhar
      : registration.driverType === "driver"
        ? registration.driverAadhar
        : null;

  const isCommercial = registration?.vehicleType?.toLowerCase() === "commercial";

  const stops =
    Array.isArray(registration.routeStops) && registration.routeStops.length > 0
      ? registration.routeStops
      : [registration.travelFrom, registration.travelTo].filter(Boolean);

  const destinationQuery = encodeURIComponent(
    stops.length ? `${stops[stops.length - 1]}, Uttarakhand` : "Uttarakhand"
  );
  const liveLocationTrackingUrl = `https://maps.google.com/?q=${destinationQuery}`;

  const whatsappMessage = `📍 *My Live / Current Location:*\n${liveLocationTrackingUrl}`;
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <>
      <div className="overflow-hidden rounded-3xl border-2 border-orange-200 bg-white shadow-2xl print:border print:shadow-none">
        {/* Official Travel Pass Header */}
        <div className="bg-linear-to-r from-orange-600 via-amber-600 to-orange-500 p-6 text-white text-center relative print:bg-orange-600 print:text-white">
          <h1 className="text-2xl font-black sm:text-3xl tracking-tight">
            Uttarakhand Digital Travel Pass
          </h1>
          <p className="mt-1 text-xs text-orange-100 font-mono font-bold">
            Registration ID: <span className="text-white underline">{registration.id}</span>
          </p>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <div className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/90 px-3 py-1 text-xs font-extrabold text-white shadow-xs">
              <CheckCircle2 className="h-3.5 w-3.5" />
              STATUS: {(registration.status || "APPROVED").toUpperCase()}
            </div>

            {isLoggedIn ? (
              <div className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-800 px-3 py-1 text-xs font-black text-white shadow-md border border-emerald-400/40 animate-in fade-in">
                <Unlock className="h-3.5 w-3.5 text-emerald-300" />
                LOGGED IN (FULL DETAILS NORMAL / UNMASKED)
              </div>
            ) : (
              <div className="inline-flex items-center gap-1 rounded-lg bg-stone-900/40 px-2.5 py-1 text-xs font-bold text-orange-200 backdrop-blur-xs">
                <Lock className="h-3.5 w-3.5" />
                PRIVACY PROTECTED (XXXX MASKED)
              </div>
            )}
          </div>
        </div>

        {/* Action Toolbar (Hidden during print) */}
        <div className="border-b border-stone-200 bg-stone-50 p-3 flex flex-wrap items-center justify-between gap-2 print:hidden">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-lg bg-stone-900 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-black transition active:scale-95 cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              Print Pass / PDF
            </button>

            <button
              type="button"
              onClick={handleCopyPassLink}
              className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-3.5 py-2 text-xs font-bold text-stone-700 shadow-xs hover:bg-stone-100 transition active:scale-95 cursor-pointer"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              {copied ? "Link Copied!" : "Copy Pass URL"}
            </button>
          </div>

          <div className="flex items-center gap-2">
            {!isLoggedIn ? (
              <button
                type="button"
                onClick={() => setIsLoginModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition active:scale-95 cursor-pointer"
              >
                <KeyRound className="h-4 w-4" />
                Login ID to View Real Details
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsLoggedIn(false);
                  if (typeof window !== "undefined") {
                    window.localStorage.removeItem("yatri-guide-owner-auth");
                    const url = new URL(window.location.href);
                    url.searchParams.delete("auth");
                    url.searchParams.delete("unmask");
                    window.history.replaceState({}, "", url.toString());
                  }
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-bold text-stone-700 shadow-xs hover:bg-stone-100 transition active:scale-95 cursor-pointer"
              >
                <Lock className="h-3.5 w-3.5" />
                Switch to Masked View
              </button>
            )}

            {qrCodeUrl && (
              <a
                href={qrCodeUrl}
                download={`Yatriguide-Pass-${registration.id}.png`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 px-3.5 py-2 text-xs font-extrabold text-stone-950 shadow-xs transition active:scale-95 cursor-pointer"
              >
                <Download className="h-4 w-4" />
                Download QR
              </a>
            )}
          </div>
        </div>

        {/* Pass Details Body */}
        <div className="p-6 space-y-6">
          {/* Vehicle & Journey Info */}
          <section className="rounded-2xl border border-orange-200 bg-orange-50/40 p-5">
            <div className="flex items-center justify-between border-b border-orange-200/60 pb-3 mb-4">
              <h2 className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-orange-900">
                <Car className="h-4 w-4 text-orange-600" />
                Vehicle & Route Authorization
              </h2>
              <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-[11px] font-bold uppercase text-orange-800">
                {registration.vehicleType || "Private"}
              </span>
            </div>

            {/* Vehicle Plate Style Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-xl border border-orange-200 shadow-2xs">
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-500">
                  Vehicle Registration Number {isLoggedIn ? "(Verified)" : "(Masked)"}
                </span>
                <div
                  className={`inline-block mt-1 font-mono text-xl sm:text-2xl font-black px-4 py-1 rounded-lg border-2 tracking-wider ${
                    isCommercial
                      ? "bg-amber-300 text-stone-950 border-amber-500 shadow-xs"
                      : "bg-stone-50 text-stone-900 border-stone-800 shadow-xs"
                  }`}
                >
                  {isLoggedIn
                    ? registration.vehicleNumber?.toUpperCase() || "N/A"
                    : maskVehicleNumber(registration.vehicleNumber)}
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-500">
                  Category
                </span>
                <span className="font-bold text-stone-900 text-sm capitalize">
                  {registration.vehicleType || "Private"} Vehicle
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {/* Authorized Route with Extend Route Button */}
              <div className="rounded-xl bg-white p-3.5 border border-orange-100 sm:col-span-2">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-500">
                    Authorized Journey Route
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setExtendStatus({ type: "", message: "" });
                      setIsExtendModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-700 hover:text-orange-950 bg-orange-100/80 hover:bg-orange-200 px-2.5 py-1 rounded-lg border border-orange-300/80 shadow-2xs transition active:scale-95 print:hidden cursor-pointer"
                  >
                    <PlusCircle className="h-3.5 w-3.5 text-orange-600" />
                    Extend Route
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 font-mono font-bold text-stone-900 text-sm sm:text-base mt-1">
                  {stops.map((stop, index) => (
                    <span key={index} className="inline-flex items-center gap-1.5">
                      <span className="bg-orange-100/70 text-orange-950 px-2.5 py-1 rounded-lg border border-orange-200/80 shadow-2xs">
                        {isLoggedIn ? stop : maskRoute(stop)}
                      </span>
                      {index < stops.length - 1 && (
                        <span className="text-orange-600 font-extrabold text-sm">&rarr;</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-white p-3 border border-orange-100 sm:col-span-2">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-500">
                  Travel Duration Window
                </span>
                <span className="font-bold font-mono text-stone-900 text-sm mt-0.5 block flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-orange-600 shrink-0" />
                  {isLoggedIn
                    ? `${registration.tourFrom || "-"} to ${registration.tourTo || "-"}`
                    : `${maskDate(registration.tourFrom)} to ${maskDate(registration.tourTo)}`}
                </span>
              </div>
            </div>
          </section>

          {/* Driver & Contact Info */}
          <section className="rounded-2xl border border-stone-200 bg-stone-50/70 p-5">
            <h2 className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-stone-800 border-b border-stone-200 pb-3 mb-4">
              <User className="h-4 w-4 text-orange-600" />
              Driver & Emergency Contacts
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-white p-3 border border-stone-200">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-500">
                  Driver / Owner Name
                </span>
                <span className="font-bold font-mono text-stone-900 text-base">
                  {isLoggedIn ? driverName || "-" : maskName(driverName)}
                </span>
              </div>

              <div className="rounded-xl bg-white p-3 border border-stone-200">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-500">
                  Primary Contact Phone
                </span>
                {driverPhone ? (
                  isLoggedIn ? (
                    <a
                      href={`tel:${driverPhone}`}
                      className="mt-1 inline-flex items-center gap-1.5 font-mono font-bold text-sm text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition"
                    >
                      <PhoneCall className="h-3.5 w-3.5 text-emerald-600" />
                      📞 {driverPhone}
                    </a>
                  ) : (
                    <span className="mt-1 inline-flex items-center gap-1.5 font-mono font-bold text-sm text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      <PhoneCall className="h-3.5 w-3.5 text-emerald-600" />
                      {maskPhone(driverPhone)}
                    </span>
                  )
                ) : (
                  <span className="font-bold text-stone-400">-</span>
                )}
              </div>

              {driverAadhaar && (
                <div className="rounded-xl bg-white p-3 border border-stone-200">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-500">
                    Aadhaar Number
                  </span>
                  <span className="font-mono font-bold text-stone-800">
                    {formatAadhaar(driverAadhaar, isLoggedIn)}
                  </span>
                </div>
              )}

              <div className="rounded-xl bg-white p-3 border border-rose-200 bg-rose-50/30">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-rose-700">
                  Emergency Contact Phone
                </span>
                {registration.emergencyContactNo ? (
                  isLoggedIn ? (
                    <a
                      href={`tel:${registration.emergencyContactNo}`}
                      className="mt-1 inline-flex items-center gap-1.5 font-mono font-bold text-sm text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-300 hover:bg-rose-100 transition"
                    >
                      <ShieldAlert className="h-3.5 w-3.5 text-rose-600" />
                      📞 {registration.emergencyContactNo}
                    </a>
                  ) : (
                    <span className="mt-1 inline-flex items-center gap-1.5 font-mono font-bold text-sm text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-300">
                      <ShieldAlert className="h-3.5 w-3.5 text-rose-600" />
                      📞 {maskPhone(registration.emergencyContactNo)}
                    </span>
                  )
                ) : (
                  <span className="font-bold text-stone-400">-</span>
                )}
              </div>
            </div>
          </section>

          {/* Passengers List */}
          {registration.passengerDetails && registration.passengerDetails.length > 0 && (
            <section className="rounded-2xl border border-stone-200 bg-white p-5">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-3">
                <h2 className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-stone-800">
                  <Users className="h-4 w-4 text-orange-600" />
                  Authorized Passengers ({registration.passengerDetails.length})
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-stone-200 text-[11px] uppercase tracking-wider text-stone-500">
                      <th className="py-2 px-2 text-center w-12">#</th>
                      <th className="py-2 px-3">Passenger Name</th>
                      <th className="py-2 px-3 text-center">Age</th>
                      <th className="py-2 px-3 text-center">Gender</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {registration.passengerDetails.map((p, idx) => (
                      <tr key={idx} className="hover:bg-stone-50">
                        <td className="py-2.5 px-2 text-center font-bold text-stone-400">{idx + 1}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-stone-900">
                          {isLoggedIn ? p.name : maskName(p.name)}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono text-stone-600">
                          {isLoggedIn ? `${p.age} yrs` : "XX yrs"}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="inline-block rounded-full bg-stone-100 px-2 py-0.5 text-xs font-mono font-medium text-stone-700">
                            {isLoggedIn ? p.gender : "XX"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* QR Code Verification Box */}
          {qrCodeUrl && (
            <div className="rounded-2xl border border-stone-200 bg-stone-50/80 p-5 text-center">
              <p className="text-xs font-extrabold uppercase tracking-wider text-stone-700 mb-1">
                Checkpost Real-Time QR Verification
              </p>
              <p className="text-[11px] text-stone-500 mb-3">
                Police and checkpost authorities can scan this QR code to verify this official pass in real time.
              </p>
              <div className="inline-block rounded-2xl border-2 border-stone-300 bg-white p-3 shadow-md">
                <Image
                  src={qrCodeUrl}
                  alt="Pass QR Code"
                  width={200}
                  height={200}
                  unoptimized
                  className="mx-auto rounded-xl"
                />
              </div>
              <p className="mt-2 text-[10px] font-mono font-bold text-stone-500">
                ID: {registration.id}
              </p>
            </div>
          )}

          {/* Action Buttons: WhatsApp Location Share (Hidden in print) */}
          <div className="pt-2 print:hidden">
            <a
              href={whatsappShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 px-4 py-4 text-base font-extrabold text-white shadow-xl transition touch-manipulation cursor-pointer"
            >
              <MapPin className="h-5 w-5 animate-bounce" />
              📍 Share Live Location on WhatsApp
            </a>
          </div>

          {/* Uttarakhand Emergency Helplines Direct Calling Buttons */}
          <div className="border-t border-stone-200 pt-5">
            <h3 className="text-center text-xs font-bold uppercase tracking-wider text-stone-600 mb-3 flex items-center justify-center gap-1.5">
              📞 Uttarakhand Emergency Helplines (Click to Call)
            </h3>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
              <a
                href="tel:112"
                className="flex flex-col items-center justify-center rounded-xl border border-rose-200 bg-rose-50 p-3 text-center transition hover:bg-rose-100 active:scale-95 shadow-xs cursor-pointer"
              >
                <ShieldAlert className="h-5 w-5 text-rose-600 mb-1" />
                <span className="text-xs font-bold text-rose-900">Police</span>
                <span className="text-[11px] font-bold text-rose-600">📞 112 / 100</span>
              </a>

              <a
                href="tel:108"
                className="flex flex-col items-center justify-center rounded-xl border border-amber-200 bg-amber-50 p-3 text-center transition hover:bg-amber-100 active:scale-95 shadow-xs cursor-pointer"
              >
                <Ambulance className="h-5 w-5 text-amber-600 mb-1" />
                <span className="text-xs font-bold text-amber-900">Ambulance</span>
                <span className="text-[11px] font-bold text-amber-600">📞 108</span>
              </a>

              <a
                href="tel:1070"
                className="flex flex-col items-center justify-center rounded-xl border border-blue-200 bg-blue-50 p-3 text-center transition hover:bg-blue-100 active:scale-95 shadow-xs cursor-pointer"
              >
                <LifeBuoy className="h-5 w-5 text-blue-600 mb-1" />
                <span className="text-xs font-bold text-blue-900">UK SDRF</span>
                <span className="text-[11px] font-bold text-blue-600">📞 1070</span>
              </a>

              <a
                href="tel:1078"
                className="flex flex-col items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center transition hover:bg-emerald-100 active:scale-95 shadow-xs cursor-pointer"
              >
                <Flame className="h-5 w-5 text-emerald-600 mb-1" />
                <span className="text-xs font-bold text-emerald-900">NDRF</span>
                <span className="text-[11px] font-bold text-emerald-600">📞 1078</span>
              </a>

              <a
                href="tel:1090"
                className="flex flex-col items-center justify-center rounded-xl border border-purple-200 bg-purple-50 p-3 text-center transition hover:bg-purple-100 active:scale-95 shadow-xs cursor-pointer col-span-2 sm:col-span-1"
              >
                <PhoneCall className="h-5 w-5 text-purple-600 mb-1" />
                <span className="text-xs font-bold text-purple-900">Women Helpline</span>
                <span className="text-[11px] font-bold text-purple-600">📞 1090</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Extend Journey Route Modal */}
      {isExtendModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-orange-200 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsExtendModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1.5 text-orange-600">
              <Route className="w-5 h-5" />
              <h3 className="text-lg font-black text-stone-900">Extend Journey Route</h3>
            </div>
            <p className="text-xs text-stone-600 mb-4">
              Add your next destination to this travel pass without deleting or replacing previous stops.
            </p>

            {/* Current Itinerary Display */}
            <div className="bg-orange-50/70 border border-orange-200 rounded-xl p-3 mb-4">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-orange-800 mb-1">
                Current Route Itinerary
              </span>
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold font-mono text-stone-800">
                {stops.map((stop, i) => (
                  <span key={i} className="flex items-center gap-1">
                    <span className="bg-white px-2 py-0.5 rounded-md border border-orange-200 shadow-2xs">
                      {isLoggedIn ? stop : maskRoute(stop)}
                    </span>
                    {i < stops.length - 1 && <span className="text-orange-600 font-extrabold">&rarr;</span>}
                  </span>
                ))}
                <span className="text-orange-600 font-extrabold">&rarr;</span>
                <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md border border-amber-300 font-bold animate-pulse">
                  + Next Destination
                </span>
              </div>
            </div>

            <form onSubmit={handleExtendSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Select Next Destination
                </label>
                <select
                  value={extendDestination}
                  onChange={(e) => setExtendDestination(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-stone-900 focus:border-orange-500 focus:outline-none"
                  required
                >
                  {EXTEND_DESTINATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              {extendDestination === "Other" && (
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Custom Destination Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter destination in Uttarakhand"
                    value={extendOtherDestination}
                    onChange={(e) => setExtendOtherDestination(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm font-semibold text-stone-900 focus:border-orange-500 focus:outline-none"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Extend Tour End Date (Optional)
                </label>
                <input
                  type="date"
                  value={extendNewTourTo}
                  min={registration.tourFrom || ""}
                  onChange={(e) => setExtendNewTourTo(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 px-3.5 py-2 text-sm text-stone-900 focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Registration Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your registration password"
                  value={extendPassword}
                  onChange={(e) => setExtendPassword(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm font-semibold text-stone-900 focus:border-orange-500 focus:outline-none"
                  required
                />
              </div>

              {extendStatus.message && (
                <div
                  className={`p-3 rounded-xl text-xs font-bold ${
                    extendStatus.type === "success"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-rose-50 text-rose-800 border border-rose-200"
                  }`}
                >
                  {extendStatus.message}
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsExtendModalOpen(false)}
                  className="w-1/3 rounded-xl border border-stone-300 px-4 py-2.5 text-xs font-bold text-stone-700 hover:bg-stone-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isExtending}
                  className="w-2/3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 px-4 py-2.5 text-xs font-bold text-white shadow-md transition disabled:opacity-50 cursor-pointer"
                >
                  {isExtending ? "Extending Route..." : "Add to Route & Update Pass"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
}
