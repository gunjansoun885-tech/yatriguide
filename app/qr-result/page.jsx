"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ShieldCheck,
  MapPin,
  PhoneCall,
  ShieldAlert,
  Ambulance,
  LifeBuoy,
  Flame,
  Car,
  User,
  Users,
  AlertCircle,
  Phone,
} from "lucide-react";
import { toDataURL } from "qrcode";

const maskPhone = (phone) => {
  if (!phone) return "-";
  const str = String(phone).trim();
  if (str.length <= 2) return str;
  return "X".repeat(str.length - 2) + str.slice(-2);
};

const maskAadhaar = (aadhar) => {
  if (!aadhar) return "-";
  const str = String(aadhar).trim();
  if (str.length <= 3) return str;
  return "X".repeat(str.length - 3) + str.slice(-3);
};

export default function QrResultPage({ searchParams }) {
  const resolvedSearchParams = searchParams ? use(Promise.resolve(searchParams)) : {};
  const passId = resolvedSearchParams?.id || resolvedSearchParams?.registrationId;

  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const hasPassId = Boolean(passId);

  useEffect(() => {
    if (!hasPassId) return;

    async function fetchPassDetails() {
      try {
        const response = await fetch(`/api/pass/${encodeURIComponent(passId)}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to load registration details.");
        }

        setRegistration(data.registration);

        if (typeof window !== "undefined") {
          const currentUrl = window.location.href;
          const qr = await toDataURL(currentUrl, { errorCorrectionLevel: "M", margin: 2 });
          setQrCodeUrl(qr);
        }
      } catch (err) {
        setError(err.message || "Failed to load registration details.");
      } finally {
        setLoading(false);
      }
    }

    fetchPassDetails();
  }, [hasPassId, passId]);

  const handleShareLocationOnWhatsapp = () => {
    setIsGettingLocation(true);

    const openWhatsappWithMessage = (locationUrl) => {
      const regId = registration?.id || passId || "-";
      const vehicleNum = registration?.vehicleNumber || "-";
      const route = `${registration?.travelFrom || "-"} to ${registration?.travelTo || "-"}`;

      const message = `🚗 *Yatriguide Digital Pass Verification*\n\n📌 *Registration ID:* ${regId}\n🚘 *Vehicle Number:* ${vehicleNum}\n🗺️ *Route:* ${route}\n📍 *Live Location:* ${locationUrl || "Not provided"}\n\nVerification Link:\n${window.location.href}`;

      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");
      setIsGettingLocation(false);
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const mapsUrl = `https://maps.google.com/?q=${lat},${lng}`;
          openWhatsappWithMessage(mapsUrl);
        },
        (err) => {
          console.warn("Geolocation permission error", err);
          openWhatsappWithMessage("https://maps.google.com");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      openWhatsappWithMessage("https://maps.google.com");
    }
  };

  const driverName =
    registration?.driverType === "owner"
      ? registration?.ownerName
      : registration?.driverType === "driver"
        ? registration?.driverName
        : registration?.otherName;

  const driverPhone =
    registration?.driverType === "owner"
      ? registration?.ownerPhone
      : registration?.driverType === "driver"
        ? registration?.driverPhone
        : registration?.otherPhone;

  const driverAadhaar =
    registration?.driverType === "owner"
      ? registration?.ownerAadhar
      : registration?.driverType === "driver"
        ? registration?.driverAadhar
        : null;

  const noPassIdState = !hasPassId;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-stone-100 py-12 px-4 sm:px-6 lg:px-8 text-stone-800">
        <div className="mx-auto max-w-2xl pt-16">
          {noPassIdState ? (
            <div className="rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-lg">
              <AlertCircle className="mx-auto h-12 w-12 text-rose-500 mb-3" />
              <h2 className="text-xl font-bold text-stone-900">Registration Not Found</h2>
              <p className="mt-2 text-sm text-stone-600">No Registration ID provided in URL.</p>
              <Link
                href="/contact"
                className="mt-6 inline-block rounded-xl bg-orange-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-orange-700"
              >
                Go to Vehicle Registration
              </Link>
            </div>
          ) : loading ? (
            <div className="rounded-3xl border border-stone-200 bg-white p-12 text-center shadow-lg">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
              <p className="mt-4 font-bold text-stone-700">Loading Registration Result...</p>
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-lg">
              <AlertCircle className="mx-auto h-12 w-12 text-rose-500 mb-3" />
              <h2 className="text-xl font-bold text-stone-900">Registration Not Found</h2>
              <p className="mt-2 text-sm text-stone-600">{error}</p>
              <Link
                href="/contact"
                className="mt-6 inline-block rounded-xl bg-orange-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-orange-700"
              >
                Go to Vehicle Registration
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-orange-200 bg-white shadow-2xl">
              {/* Header */}
              <div className="bg-linear-to-r from-orange-600 via-amber-600 to-orange-500 p-6 text-white text-center relative">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                  <ShieldCheck className="h-4 w-4 text-emerald-300" />
                  Verified Travel Pass Result
                </div>

                <h1 className="mt-3 text-2xl font-black sm:text-3xl tracking-tight">
                  Uttarakhand Travel Pass Result
                </h1>
                <p className="mt-1 text-xs text-orange-100 font-mono font-bold">
                  Registration ID: <span className="text-white underline">{registration.id}</span>
                </p>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6">
                {/* Vehicle & Journey Info */}
                <section className="rounded-2xl border border-orange-100 bg-orange-50/50 p-4">
                  <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-orange-800">
                    <Car className="h-4 w-4" />
                    Vehicle & Journey Details
                  </h2>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="block text-xs font-semibold text-stone-500">Vehicle Number</span>
                      <span className="font-bold font-mono text-base text-stone-900">{registration.vehicleNumber || "-"}</span>
                    </div>
                    <div>
                      <span className="block text-xs font-semibold text-stone-500">Category</span>
                      <span className="font-bold capitalize text-stone-900">{registration.vehicleType || "-"}</span>
                    </div>
                    <div>
                      <span className="block text-xs font-semibold text-stone-500">Journey Route</span>
                      <span className="font-bold text-stone-900">{registration.travelFrom || "-"} &rarr; {registration.travelTo || "-"}</span>
                    </div>
                    <div>
                      <span className="block text-xs font-semibold text-stone-500">Travel Dates</span>
                      <span className="font-bold text-stone-900">{registration.tourFrom || "-"} to {registration.tourTo || "-"}</span>
                    </div>
                  </div>
                </section>

                {/* Driver & Contact Info */}
                <section className="rounded-2xl border border-stone-200 bg-stone-50/80 p-4">
                  <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-stone-800">
                    <User className="h-4 w-4 text-orange-600" />
                    Driver & Contact Information
                  </h2>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="block text-xs font-semibold text-stone-500">Driver Name</span>
                      <span className="font-bold text-stone-900">{driverName || "-"}</span>
                    </div>
                    <div>
                      <span className="block text-xs font-semibold text-stone-500">Contact Phone (Masked)</span>
                      <span className="font-bold font-mono text-stone-900">{maskPhone(driverPhone)}</span>
                    </div>
                    {driverAadhaar && (
                      <div>
                        <span className="block text-xs font-semibold text-stone-500">Aadhaar No. (Masked)</span>
                        <span className="font-bold font-mono text-stone-900">{maskAadhaar(driverAadhaar)}</span>
                      </div>
                    )}
                    <div>
                      <span className="block text-xs font-semibold text-stone-500">Emergency Phone</span>
                      {registration.emergencyContactNo ? (
                        <a
                          href={`tel:${registration.emergencyContactNo}`}
                          className="inline-flex items-center gap-1 font-bold font-mono text-rose-600 hover:text-rose-700 hover:underline"
                          title="Click to call emergency contact"
                        >
                          📞 {registration.emergencyContactNo}
                        </a>
                      ) : (
                        <span className="font-bold font-mono text-stone-400">-</span>
                      )}
                    </div>
                  </div>
                </section>

                {/* Passengers List */}
                {registration.passengerDetails && registration.passengerDetails.length > 0 && (
                  <section className="rounded-2xl border border-stone-200 bg-white p-4">
                    <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-stone-800">
                      <Users className="h-4 w-4 text-orange-600" />
                      Passengers ({registration.passengerDetails.length})
                    </h2>
                    <div className="mt-3 divide-y divide-stone-100">
                      {registration.passengerDetails.map((p, idx) => (
                        <div key={idx} className="py-2 flex items-center justify-between text-xs">
                          <span className="font-bold text-stone-800">{idx + 1}. {p.name || "-"}</span>
                          <span className="text-stone-500">{p.age} yrs, {p.gender}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* UTTARAKHAND EMERGENCY CONTACTS (DIRECT CALL) */}
                <section className="rounded-2xl border border-rose-200 bg-rose-50/50 p-5 space-y-3">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-rose-900 flex items-center gap-2 border-b border-rose-200/60 pb-3">
                    <ShieldAlert className="h-5 w-5 text-rose-600 shrink-0" />
                    UTTARAKHAND EMERGENCY CONTACTS (DIRECT CALL)
                  </h2>

                  <div className="space-y-2 text-xs sm:text-sm pt-1">
                    <div className="flex items-center justify-between rounded-xl bg-white p-3 border border-rose-200 font-medium text-stone-900 shadow-2xs">
                      <span className="font-bold">Police —</span>
                      <a
                        href="tel:112"
                        className="inline-flex items-center font-mono font-bold text-rose-600 text-sm bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 transition hover:bg-rose-100 active:scale-95"
                        aria-label="Call police helpline 112"
                        title="Call 112"
                      >
                        112
                      </a>
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-white p-3 border border-amber-200 font-medium text-stone-900 shadow-2xs">
                      <span className="font-bold">Ambulance —</span>
                      <a
                        href="tel:108"
                        className="inline-flex items-center font-mono font-bold text-amber-600 text-sm bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 transition hover:bg-amber-100 active:scale-95"
                        aria-label="Call ambulance helpline 108"
                        title="Call 108"
                      >
                        108
                      </a>
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-white p-3 border border-blue-200 font-medium text-stone-900 shadow-2xs">
                      <span className="font-bold">UK SDRF —</span>
                      <a
                        href="tel:1070"
                        className="inline-flex items-center font-mono font-bold text-blue-600 text-sm bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 transition hover:bg-blue-100 active:scale-95"
                        aria-label="Call UK SDRF helpline 1070"
                        title="Call 1070"
                      >
                        1070
                      </a>
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-white p-3 border border-emerald-200 font-medium text-stone-900 shadow-2xs">
                      <span className="font-bold">NDRF —</span>
                      <a
                        href="tel:1078"
                        className="inline-flex items-center font-mono font-bold text-emerald-600 text-sm bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 transition hover:bg-emerald-100 active:scale-95"
                        aria-label="Call NDRF helpline 1078"
                        title="Call 1078"
                      >
                        1078
                      </a>
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-white p-3 border border-purple-200 font-medium text-stone-900 shadow-2xs">
                      <span className="font-bold">Women —</span>
                      <a
                        href="tel:1090"
                        className="inline-flex items-center font-mono font-bold text-purple-600 text-sm bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200 transition hover:bg-purple-100 active:scale-95"
                        aria-label="Call women helpline 1090"
                        title="Call 1090"
                      >
                        1090
                      </a>
                    </div>
                  </div>
                </section>

                {/* QR Image Verification */}
                {qrCodeUrl && (
                  <div className="text-center pt-2">
                    <p className="text-xs font-bold text-stone-600 mb-2">Verification Link QR Code</p>
                    <Image src={qrCodeUrl} alt="Result Pass QR Code" width={150} height={150} unoptimized className="mx-auto rounded-xl border p-2 bg-white shadow-xs" />
                  </div>
                )}

                {/* Location Share Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleShareLocationOnWhatsapp}
                    disabled={isGettingLocation}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-700 active:scale-98 disabled:opacity-70 touch-manipulation min-h-[46px]"
                  >
                    <MapPin className="h-5 w-5 animate-bounce" />
                    {isGettingLocation ? "Fetching GPS Location..." : "📍 Share Live Location on WhatsApp"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
