import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  Star,
  Compass,
  Calendar,
  Clock,
  Car,
  CheckCircle2,
  ChevronLeft,
  ArrowRight,
  ShieldCheck,
  Plane,
  Train,
  Ticket,
  ExternalLink,
  Navigation,
  Info,
  Sparkles
} from "lucide-react";
import { DESTINATIONS_DETAIL_DATA } from "@/lib/destinations-data";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams?.id?.toLowerCase();
  const dest = DESTINATIONS_DETAIL_DATA[id];

  if (!dest) {
    return {
      title: "Destination Not Found | YatriGuide",
      description: "Explore top tourist destinations in Uttarakhand.",
    };
  }

  return {
    title: `${dest.title} Travel Guide & Famous Places | YatriGuide Uttarakhand`,
    description: `Discover ${dest.title} (${dest.subtitle}) — Famous tourist places to visit, Kempty Falls, Mall Road, Gun Hill, best time to visit, and get official Uttarakhand travel pass.`,
    keywords: `${dest.title}, ${dest.title} tourist places, ${dest.title} sightseeing, Uttarakhand tourism, Kempty Falls Mussoorie, Gun Hill Mussoorie`,
  };
}

export default async function DestinationDetailPage({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams?.id?.toLowerCase();
  const dest = DESTINATIONS_DETAIL_DATA[id];

  if (!dest) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-orange-500 selection:text-white">
      <Navbar />

      {/* Hero Banner Section */}
      <section className="relative pt-28 pb-20 sm:pt-36 sm:pb-28 bg-stone-950 overflow-hidden text-white">
        {/* Banner Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={dest.heroImage}
            alt={dest.title}
            fill
            priority
            className="object-cover object-center opacity-100 scale-100"
            unoptimized
          />
          {/* Subtle text readability gradient ONLY on the left, keeping image 100% HD clear */}
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-stone-950/40 to-transparent max-w-4xl" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-black/20" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb Navigation */}
          <div className="mb-6 flex items-center space-x-2 text-xs sm:text-sm text-stone-300">
            <Link href="/" className="hover:text-orange-400 transition flex items-center gap-1">
              <ChevronLeft className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <span className="text-stone-600">/</span>
            <Link href="/#destinations" className="hover:text-orange-400 transition">
              Destinations
            </Link>
            <span className="text-stone-600">/</span>
            <span className="text-orange-400 font-bold">{dest.title}</span>
          </div>

          <div className="max-w-3xl">
            {/* Category Tag & Rating */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3.5 py-1 text-xs font-sans font-extrabold uppercase tracking-wider text-stone-900 bg-orange-400 rounded-full shadow-md">
                {dest.category}
              </span>
              <div className="flex items-center space-x-1.5 px-3 py-1 bg-stone-900/80 border border-stone-700/80 rounded-full text-xs font-bold text-amber-400 backdrop-blur-md">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{dest.rating}</span>
                <span className="text-stone-400 font-normal">({dest.reviewsCount} reviews)</span>
              </div>
            </div>

            {/* Title & Subtitle */}
            <h1 className="text-4xl sm:text-6xl font-serif font-black tracking-tight text-white mb-3 drop-shadow-md">
              {dest.title}
            </h1>
            <p className="text-lg sm:text-2xl font-serif text-orange-300 font-semibold mb-4 italic">
              "{dest.subtitle}"
            </p>
            <p className="text-sm sm:text-base text-stone-300 font-sans font-normal leading-relaxed mb-8 max-w-2xl">
              {dest.tagline}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/registrations"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 text-white font-bold text-sm shadow-xl shadow-orange-500/30 hover:from-orange-600 hover:to-amber-700 transition active:scale-[0.98]"
              >
                <Ticket className="w-4 h-4" />
                <span>Get Yatri Travel Pass</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <a
                href="#famous-places"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md font-bold text-sm transition"
              >
                <Compass className="w-4 h-4 text-orange-400" />
                <span>Explore Sightseeing</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Info Bar */}
      <section className="bg-white border-b border-stone-200 py-6 shadow-sm relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-100">
              <div className="p-2.5 bg-orange-100 text-orange-600 rounded-xl">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">Elevation</p>
                <p className="text-xs sm:text-sm font-extrabold text-stone-900">{dest.elevation}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-100">
              <div className="p-2.5 bg-orange-100 text-orange-600 rounded-xl">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">Ideal Trip</p>
                <p className="text-xs sm:text-sm font-extrabold text-stone-900">{dest.idealDuration}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-100">
              <div className="p-2.5 bg-orange-100 text-orange-600 rounded-xl">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">Best Season</p>
                <p className="text-xs sm:text-sm font-extrabold text-stone-900">{dest.bestTime}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-100">
              <div className="p-2.5 bg-orange-100 text-orange-600 rounded-xl">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">Yatri Pass</p>
                <p className="text-xs sm:text-sm font-extrabold text-emerald-700 flex items-center gap-1">
                  <span>Mandatory / Active</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left / Main Column (2 Cols) */}
          <div className="lg:col-span-2 space-y-16">
            
            {/* Overview & About */}
            <section className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-orange-600 mb-2">
                <Info className="w-4 h-4" />
                <span>Destination Overview</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-black text-stone-900 mb-6">
                About {dest.title}
              </h2>
              <p className="text-stone-700 leading-relaxed text-base sm:text-lg mb-6 font-normal">
                {dest.description}
              </p>

              {/* Highlights Bullet List */}
              <div className="mt-8 pt-6 border-t border-stone-100">
                <h3 className="text-sm font-bold uppercase tracking-wider text-stone-800 mb-4">
                  Key Experiences & Highlights:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {dest.highlights?.map((hl, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-orange-50/60 border border-orange-100/80">
                      <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm font-semibold text-stone-800">{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Famous Sightseeing Places (The Core Request!) */}
            <section id="famous-places" className="scroll-mt-28">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-orange-600 mb-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Must-Visit Places</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-serif font-black text-stone-900">
                    Famous Places in {dest.title}
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-stone-500 font-medium mt-2 sm:mt-0">
                  {dest.famousPlaces?.length || 0} Key Attractions Included
                </p>
              </div>

              {/* Places Cards Grid */}
              <div className="space-y-8">
                {dest.famousPlaces?.map((place, idx) => (
                  <div
                    key={place.id || idx}
                    className="group bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row"
                  >
                    {/* Place Image */}
                    <div className="relative w-full md:w-2/5 aspect-[4/3] md:aspect-auto shrink-0 bg-stone-200">
                      <Image
                        src={place.image || dest.heroImage}
                        alt={place.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-stone-900/90 text-white rounded-full backdrop-blur-md">
                          #{idx + 1} Famous Spot
                        </span>
                      </div>
                    </div>

                    {/* Place Content */}
                    <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider bg-orange-100 text-orange-700 rounded-lg">
                            {place.tag}
                          </span>
                          <span className="text-xs font-semibold text-stone-500 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-orange-500" />
                            {place.distance}
                          </span>
                        </div>

                        <h3 className="text-xl sm:text-2xl font-serif font-black text-stone-900 mb-3 group-hover:text-orange-600 transition-colors">
                          {place.name}
                        </h3>

                        <p className="text-stone-600 text-sm leading-relaxed mb-6 font-normal">
                          {place.description}
                        </p>
                      </div>

                      {/* Timings & Entry Fee Bar */}
                      <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-600 font-semibold">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-stone-400" />
                          <span>Timings: <strong className="text-stone-900">{place.timings}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Ticket className="w-4 h-4 text-stone-400" />
                          <span>Entry: <strong className="text-stone-900">{place.entryFee}</strong></span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Travel Guide & How to Reach */}
            <section className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-8">
              <div>
                <h2 className="text-2xl font-serif font-black text-stone-900 mb-4 flex items-center gap-2">
                  <Navigation className="w-6 h-6 text-orange-600" />
                  How to Reach {dest.title}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {dest.travelGuide?.howToReach?.map((mode, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
                      <div className="flex items-center gap-2 font-bold text-stone-900 text-sm mb-2">
                        {mode.mode.includes("Road") ? <Car className="w-4 h-4 text-orange-600" /> : mode.mode.includes("Train") ? <Train className="w-4 h-4 text-orange-600" /> : <Plane className="w-4 h-4 text-orange-600" />}
                        <span>{mode.mode}</span>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed font-medium">{mode.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-stone-100">
                <h3 className="text-sm font-bold uppercase tracking-wider text-stone-800 mb-3">
                  Essential Travel Guidelines:
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-stone-600">
                  {dest.travelGuide?.essentialTips?.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-orange-500 font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

          </div>

          {/* Right Column / Sticky Booking & Pass Sidebar */}
          <div className="space-y-8">
            <div className="sticky top-28 bg-gradient-to-b from-stone-900 to-stone-950 text-white rounded-3xl p-7 border border-stone-800 shadow-2xl space-y-6">
              
              <div className="flex items-center gap-3 pb-4 border-b border-stone-800">
                <div className="p-3 bg-gradient-to-tr from-orange-500 to-amber-500 rounded-2xl shadow-lg shadow-orange-500/30 text-stone-950">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-extrabold text-orange-400 block">Uttarakhand Portal</span>
                  <h3 className="text-lg font-black text-white">Yatri Pass Mandatory</h3>
                </div>
              </div>

              <p className="text-xs text-stone-300 leading-relaxed font-light">
                Planning your journey to <strong>{dest.title}</strong>? All vehicles and tourists entering Uttarakhand state must obtain an official QR Travel Pass for checkposts.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2.5 text-xs text-stone-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Instant Digital QR Pass Issued</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-stone-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Verified at State Checkposts</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-stone-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Valid for Private & Commercial Vehicles</span>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-800">
                <Link
                  href="/registrations"
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 hover:from-orange-400 hover:to-amber-500 transition active:scale-[0.98]"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Apply Travel Pass for {dest.title}</span>
                </Link>
              </div>

              <div className="text-center pt-2">
                <p className="text-[11px] text-stone-400 font-medium">Need immediate assistance?</p>
                <a href="tel:+917897654567" className="text-xs font-bold text-orange-400 hover:underline">
                  Helpline: +91 78976 54567
                </a>
              </div>

            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
