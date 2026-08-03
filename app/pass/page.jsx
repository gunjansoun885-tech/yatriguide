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
  Download,
  Share2,
  Calendar,
  Car,
  User,
  Users,
  AlertCircle,
  QrCode as QrIcon,
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

export default function TravelPassPage({ searchParams }) {
  // Unwrap searchParams if passed as a promise in Next.js 15+
  const resolvedSearchParams = searchParams ? use(Promise.resolve(searchParams)) : {};
  const passId = resolvedSearchParams?.id;

  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  useEffect(() => {
    if (!passId) {
      setError("No Registration ID provided in URL.");
      setLoading(false);
      return;
    }

    async function fetchPassDetails() {
      try {
        const response = await fetch(`/api/pass/${encodeURIComponent(passId)}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to load travel pass.");
        }

        setRegistration(data.registration);

        // Generate QR code for current pass page URL
        if (typeof window !== "undefined") {
          const currentUrl = window.location.href;
          const qr = await toDataURL(currentUrl, { errorCorrectionLevel: "M", margin: 2 });
          setQrCodeUrl(qr);
        }
      } catch (err) {
        setError(err.message || "Failed to load pass details.");
      } finally {
        setLoading(false);
      }
    }

    fetchPassDetails();
  }, [passId]);

  const handleShareLocationOnWhatsapp = () => {
    setIsGettingLocation(true);

    const openWhatsappWithMessage = (locationUrl) => {
      const regId = registration?.id || passId || "-";
      const vehicleNum = registration?.vehicleNumber || "-";
      const route = `${registration?.travelFrom || "-"} to ${registration?.travelTo || "-"}`;

      const message = `🚗 *Yatriguide Digital Travel Pass*\n\n📌 *Registration ID:* ${regId}\n🚘 *Vehicle Number:* ${vehicleNum}\n🗺️ *Route:* ${route}\n📍 *Live Current Location:* ${locationUrl || "Not provided"}\n\nPass Verification Link:\n${window.location.href}`;

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

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-stone-100 py-12 px-4 sm:px-6 lg:px-8 text-stone-800">
        <div className="mx-auto max-w-2xl pt-16">
          {loading ? (
            <div className="rounded-3xl border border-stone-200 bg-white p-12 text-center shadow-lg">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
              <p className="mt-4 font-bold text-stone-700">Loading Yatriguide Travel Pass...</p>
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-lg">
              <AlertCircle className="mx-auto h-12 w-12 text-rose-500 mb-3" />
              <h2 className="text-xl font-bold text-stone-900">Pass Not Found</h2>
              <p className="mt-2 text-sm text-stone-600">{error}</p>
              <Link
                href="/contact"
                className="mt-6 inline-block rounded-xl bg-orange-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-orange-700"
              >
                Register Travel Vehicle
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-orange-200 bg-white shadow-2xl">
              {/* Pass Header */}
              <div className="bg-linear-to-r from-orange-600 via-amber-600 to-orange-500 p-6 text-white text-center relative">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                  <ShieldCheck className="h-4 w-4 text-emerald-300" />
                  Verified Yatriguide Pass
                </div>

                <h1 className="mt-3 text-2xl font-black sm:text-3xl tracking-tight">
                  Uttarakhand Digital Travel Pass
                </h1>
                <p className="mt-1 text-xs text-orange-100 font-mono font-bold">
                  Registration ID: <span className="text-white underline">{registration.id}</span>
                </p>
              </div>

              {/* Pass Details Body */}
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
                      <span className="block text-xs font-semibold text-stone-500">Emergency Phone (Click to Call)</span>
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

                {/* QR Code Verification Image */}
                {qrCodeUrl && (
                  <div className="text-center pt-2">
                    <p className="text-xs font-bold text-stone-600 mb-2">QR Code Pass Link</p>
                    <Image src={qrCodeUrl} alt="Pass QR Code" width={160} height={160} unoptimized className="mx-auto rounded-xl border p-2 bg-white shadow-xs" />
                  </div>
                )}

                {/* Action Buttons: WhatsApp Location Share */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleShareLocationOnWhatsapp}
                    disabled={isGettingLocation}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-700 active:scale-98 disabled:opacity-70 touch-manipulation min-h-[46px]"
                  >
                    <MapPin className="h-5 w-5 animate-bounce" />
                    {isGettingLocation ? "Fetching Live GPS Location..." : "📍 Share Live Location on WhatsApp"}
                  </button>
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
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
