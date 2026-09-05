import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  ChevronLeft, 
  Star, 
  CheckCircle2, 
  ShieldCheck, 
  Compass, 
  Flame,
  Waves,
  Snowflake,
  Zap,
  Trees
} from "lucide-react";
import { ADVENTURES_DATA } from "@/lib/adventure-data";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ICON_MAP = {
  Compass,
  Waves,
  Flame,
  Snowflake,
  Zap,
  Trees
};

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams?.id?.toLowerCase();
  const adv = ADVENTURES_DATA[id];

  if (!adv) {
    return {
      title: "Adventure Not Found | YatriGuide",
      description: "Explore Uttarakhand adventure activities.",
    };
  }

  return {
    title: `${adv.title} | YatriGuide Uttarakhand`,
    description: `${adv.title} (${adv.subtitle}) — Explore trekking, rafting, skiing and wilderness activities with certified guides.`,
    keywords: `${adv.title}, Uttarakhand adventure, YatriGuide adventure`,
  };
}

export default async function AdventureDetailPage({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams?.id?.toLowerCase();
  const adv = ADVENTURES_DATA[id];

  if (!adv) {
    notFound();
  }

  const IconComponent = ICON_MAP[adv.icon] || Compass;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-orange-500 selection:text-white">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative pt-28 pb-20 sm:pt-36 sm:pb-28 bg-stone-950 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={adv.heroImage}
            alt={adv.title}
            fill
            priority
            className="object-cover object-center opacity-85 scale-100"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/50 to-transparent max-w-4xl" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-black/20" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-6 flex items-center space-x-2 text-xs sm:text-sm text-stone-300">
            <Link href="/" className="hover:text-orange-400 transition flex items-center gap-1">
              <ChevronLeft className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <span className="text-stone-600">/</span>
            <Link href="/#adventure" className="hover:text-orange-400 transition">
              Adventure
            </Link>
            <span className="text-stone-600">/</span>
            <span className="text-orange-400 font-bold">{adv.title}</span>
          </div>

          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3.5 py-1 text-xs font-sans font-extrabold uppercase tracking-wider text-stone-900 bg-orange-400 rounded-full shadow-md flex items-center gap-1.5">
                <IconComponent className="w-3.5 h-3.5 text-stone-900" />
                <span>{adv.difficulty}</span>
              </span>
              <div className="flex items-center space-x-1.5 px-3 py-1 bg-stone-900/80 border border-stone-700/80 rounded-full text-xs font-bold text-amber-400 backdrop-blur-md">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{adv.rating}</span>
                <span className="text-stone-400 font-normal">({adv.reviewsCount} reviews)</span>
              </div>
            </div>

            <h1 className="text-4xl sm:text-6xl font-serif font-black tracking-tight text-white mb-3 drop-shadow-md">
              {adv.title}
            </h1>
            <p className="text-lg sm:text-2xl font-serif text-orange-300 font-semibold mb-4 italic">
              "{adv.subtitle}"
            </p>
            <p className="text-sm sm:text-base text-stone-300 font-sans font-normal leading-relaxed mb-8 max-w-2xl">
              {adv.tagline}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Activity Column (2 Cols) */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Overview */}
            <section className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-serif font-black text-stone-900 mb-4">
                About {adv.title}
              </h2>
              <p className="text-stone-700 leading-relaxed text-base sm:text-lg font-normal">
                {adv.overview}
              </p>
            </section>

          </div>

          {/* Right Column / Sticky Sidebar */}
          <div className="space-y-8">
            <div className="sticky top-28 bg-gradient-to-b from-stone-900 to-stone-950 text-white rounded-3xl p-7 border border-stone-800 shadow-2xl space-y-6">
              
              <div className="flex items-center gap-3 pb-4 border-b border-stone-800">
                <div className="p-3 bg-gradient-to-tr from-orange-500 to-amber-500 rounded-2xl shadow-lg shadow-orange-500/30 text-stone-950">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-extrabold text-orange-400 block">Uttarakhand Tourism</span>
                  <h3 className="text-lg font-black text-white">Certified Safety Standards</h3>
                </div>
              </div>

              <p className="text-xs text-stone-300 leading-relaxed font-light">
                All <strong>{adv.title}</strong> expeditions are led by government-certified instructors with high-altitude safety equipment and instant digital permit verification.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2.5 text-xs text-stone-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Licensed Mount Guides & Instructors</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-stone-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Oxygen & Medical Support Included</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-stone-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Instant Yatri Travel Permit Support</span>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-800">
                <Link
                  href="/contact"
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 hover:from-orange-400 hover:to-amber-500 transition active:scale-[0.98]"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Registration</span>
                </Link>
              </div>

              <div className="text-center pt-2">
                <p className="text-[11px] text-stone-400 font-medium">Have questions about itineraries?</p>
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
