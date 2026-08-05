"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ArrowUpRight, Compass, Star, X, CheckCircle2, Ticket, Sparkles, Navigation, Clock } from "lucide-react";
import { DESTINATIONS_DETAIL_DATA } from "@/lib/destinations-data";

const DESTINATIONS_DATA = [
  {
    id: "mussoorie",
    title: "Mussoorie",
    tagline: "The Queen of Hills",
    description: "Nestled in the Garhwal Himalayan foothills, Mussoorie offers stunning vistas of mist-shrouded valleys, colonial-era architecture, and cascading Kempty Falls.",
    image: "/mussorie.png",
    rating: 4.8,
    category: "Hill Station"
  },
  {
    id: "nainital",
    title: "Nainital",
    tagline: "The Lake District",
    description: "Centered around the emerald-tinted, pear-shaped Naini Lake, this scenic town is surrounded by seven dramatic hills and features classic wooden boating rows.",
    image: "/nanital.jpg",
    rating: 4.7,
    category: "Lakes & Leisure"
  },
  {
    id: "rishikesh",
    title: "Rishikesh",
    tagline: "Yoga & Adventure Capital",
    description: "Where the Ganges flows swiftly out of the Himalayas, Rishikesh hosts thousands for sacred aartis, yoga study, world-class white water rafting, and bungee jumping.",
    image: "/rishikesh.png",
    rating: 4.9,
    category: "Adventure & Spiritual"
  },
  {
    id: "kedarnath",
    title: "Kedarnath",
    tagline: "The Sacred Abode",
    description: "Located near the Mandakini river amidst majestic snow-covered peaks, Kedarnath is one of the holiest Char Dham destinations, housing the ancient stone temple of Lord Shiva.",
    image: "/kedar.png",
    rating: 4.95,
    category: "Spiritual Pilgrimage"
  },
  {
    id: "auli",
    title: "Auli",
    tagline: "The Skiing Paradise",
    description: "Surrounded by dense oak forests and massive peaks like Nanda Devi, Auli is a premier ski resort destination containing lush alpine meadows and crystal-clear lakes.",
    image: "/auli.png",
    rating: 4.8,
    category: "Snow Sports"
  },
  {
    id: "jim-corbett",
    title: "Jim Corbett",
    tagline: "Wildlife Haven",
    description: "India's oldest national park, home to the endangered Bengal Tiger, rare elephants, and leopards roaming across deep riverine belts and sal forest reserves.",
    image: "/jim.webp",
    rating: 4.75,
    category: "Wildlife Safari"
  }
];

export default function Destinations() {
  const [activeModalDest, setActiveModalDest] = useState(null);

  const handleExploreClick = (e, destId) => {
    e.stopPropagation();
    const detailData = DESTINATIONS_DETAIL_DATA[destId] || DESTINATIONS_DETAIL_DATA.mussoorie;
    setActiveModalDest(detailData);
  };

  return (
    <section id="destinations" className="py-24 bg-gradient-to-b from-stone-50 via-white to-stone-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center space-x-2 text-orange-600 text-xs sm:text-sm font-sans font-extrabold uppercase tracking-widest mb-3"
          >
            <Compass className="w-4 h-4 text-orange-600" />
            <span>Curated Handpicked Vistas</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-3xl sm:text-5xl font-serif font-black text-stone-900 mb-4"
          >
            Popular Destinations
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-24 h-1.5 bg-gradient-to-r from-orange-500 to-amber-500 mx-auto rounded-full mb-6"
          />

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-stone-600 font-sans max-w-xl mx-auto text-sm sm:text-base font-normal"
          >
            Discover the magical spirit of Uttarakhand. Click "Explore Details" to view famous places, travel guides, and mandatory travel pass details.
          </motion.p>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {DESTINATIONS_DATA.map((dest, idx) => (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              className="group relative rounded-3xl overflow-hidden aspect-[4/5] bg-stone-100 shadow-xl shadow-stone-900/10 border border-stone-200 transition-all duration-500"
            >
              {/* Card Image (100% Crystal Clear - Zero Blur) */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                style={{ 
                  backgroundImage: `url('${dest.image}')`,
                  filter: "none",
                  backdropFilter: "none",
                  opacity: 1
                }}
              />

              {/* Minimal Bottom Text Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/25 to-transparent transition-all duration-300" />

              {/* Category Badge */}
              <div className="absolute top-4 left-4 z-20">
                <span className="px-3 py-1.5 text-[11px] font-sans font-extrabold uppercase tracking-wider text-stone-900 bg-white/95 backdrop-blur-sm border border-white shadow-md rounded-full">
                  {dest.category}
                </span>
              </div>

              {/* Rating Badge */}
              <div className="absolute top-4 right-4 z-20 flex items-center space-x-1 px-2.5 py-1 text-[11px] font-sans font-bold text-stone-900 bg-amber-400 border border-amber-300 shadow-md rounded-full">
                <Star className="w-3 h-3 fill-stone-900 text-stone-900" />
                <span>{dest.rating}</span>
              </div>

              {/* Card Bottom Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-left flex flex-col justify-end">
                <div className="flex items-center space-x-1.5 text-amber-300 mb-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-orange-400" />
                  <span className="text-xs font-sans font-bold tracking-wider uppercase text-orange-300">{dest.tagline}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-serif font-black text-white flex items-center justify-between drop-shadow-md mb-2">
                  <span>{dest.title}</span>
                  <ArrowUpRight className="w-6 h-6 text-orange-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 shrink-0 ml-2" />
                </h3>

                <p className="text-xs font-sans font-normal text-stone-200 leading-relaxed line-clamp-2 mb-3">
                  {dest.description}
                </p>

                {/* Explore Details Trigger Button */}
                <div className="pt-2">
                  <button
                    onClick={(e) => handleExploreClick(e, dest.id)}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange-500/30 transition active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                    <span>Explore Details</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════
          MODAL: DESTINATION EXPLORE DETAILS (POPUP)
      ════════════════════════════════════════ */}
      <AnimatePresence>
        {activeModalDest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-stone-950/80 p-4 sm:p-6 backdrop-blur-md overflow-y-auto"
            onClick={() => setActiveModalDest(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200 max-h-[90vh] flex flex-col text-stone-900 my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModalDest(null)}
                className="absolute right-4 top-4 z-30 p-2.5 rounded-full bg-stone-900/80 text-white hover:bg-stone-900 transition backdrop-blur-sm"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header / Banner */}
              <div className="relative h-64 sm:h-80 w-full shrink-0 bg-stone-900 text-white flex flex-col justify-end p-6 sm:p-8">
                <Image
                  src={activeModalDest.heroImage}
                  alt={activeModalDest.title}
                  fill
                  className="object-cover opacity-50"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
                
                <div className="relative z-10">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider bg-orange-500 text-white rounded-full">
                      {activeModalDest.category}
                    </span>
                    <span className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider bg-white/20 text-white rounded-full backdrop-blur-sm">
                      Elevation: {activeModalDest.elevation}
                    </span>
                  </div>
                  
                  <h2 className="text-3xl sm:text-5xl font-serif font-black text-white mb-1 drop-shadow-md">
                    {activeModalDest.title}
                  </h2>
                  <p className="text-sm sm:text-lg font-serif italic text-orange-300 font-bold">
                    "{activeModalDest.subtitle}"
                  </p>
                </div>
              </div>

              {/* Modal Scrollable Body */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-1">
                
                {/* Description */}
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-orange-600 mb-2">
                    About {activeModalDest.title}
                  </h3>
                  <p className="text-stone-700 text-sm sm:text-base leading-relaxed font-normal">
                    {activeModalDest.description}
                  </p>
                </div>

                {/* Highlights */}
                <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 mb-3">
                    Top Experiences & Key Highlights:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-stone-800">
                    {activeModalDest.highlights?.map((hl, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Famous Places Section (Requested Feature) */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg sm:text-xl font-serif font-black text-stone-900 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-orange-600" />
                      Famous Sightseeing Places in {activeModalDest.title}
                    </h3>
                    <span className="text-xs font-bold text-stone-500">
                      {activeModalDest.famousPlaces?.length || 0} Places
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {activeModalDest.famousPlaces?.map((place, i) => (
                      <div
                        key={place.id || i}
                        className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm hover:border-orange-200 transition space-y-2 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                            <span className="px-2.5 py-0.5 rounded bg-orange-100 text-orange-700 uppercase tracking-wider">
                              {place.tag}
                            </span>
                            <span className="text-stone-500 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-orange-500" />
                              {place.distance}
                            </span>
                          </div>

                          <h4 className="text-base font-serif font-bold text-stone-900">
                            {i + 1}. {place.name}
                          </h4>
                          <p className="text-xs text-stone-600 leading-relaxed font-normal mt-1">
                            {place.description}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500 font-semibold mt-2">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-stone-400" /> {place.timings}
                          </span>
                          <span className="text-stone-900 font-bold">{place.entryFee}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* How to Reach & Pass Note */}
                <div className="p-4 rounded-2xl bg-stone-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-orange-400 tracking-wider">Official Checkpost Requirement</span>
                    <h4 className="text-base font-serif font-bold">Visiting {activeModalDest.title}?</h4>
                    <p className="text-xs text-stone-300">Mandatory Yatri Pass required for all private & commercial tourist vehicles.</p>
                  </div>
                  <Link
                    href={`/destinations/${activeModalDest.id}`}
                    onClick={() => setActiveModalDest(null)}
                    className="shrink-0 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5"
                  >
                    <span>View Full {activeModalDest.title} Page</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="p-4 sm:p-6 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
                <Link
                  href={`/destinations/${activeModalDest.id}`}
                  onClick={() => setActiveModalDest(null)}
                  className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1"
                >
                  <span>Open Full {activeModalDest.title} Dedicated Guide</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveModalDest(null)}
                    className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold text-xs transition"
                  >
                    Close
                  </button>
                  <Link
                    href="/registrations"
                    onClick={() => setActiveModalDest(null)}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs uppercase tracking-wider shadow-md transition flex items-center gap-1.5"
                  >
                    <Ticket className="w-3.5 h-3.5" />
                    <span>Get Travel Pass</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
