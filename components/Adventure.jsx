"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Compass, 
  Waves, 
  Flame, 
  Snowflake, 
  Zap, 
  Trees, 
  ArrowUpRight,
  X,
  Star,
  ExternalLink,
} from "lucide-react";
import { ADVENTURES_DATA } from "@/lib/adventure-data";

const ADVENTURES = [
  {
    id: "trekking",
    title: "High Altitude Trekking",
    description: "Trek through pristine alpine meadows like Valley of Flowers, Har Ki Dun, or Kedarkantha with certified mountain guides.",
    icon: Compass,
    difficulty: "Moderate to Challenging",
    accent: "from-emerald-400 to-teal-500",
    glow: "shadow-emerald-500/10"
  },
  {
    id: "rafting",
    title: "White Water Rafting",
    description: "Conquer wild Grade III and IV rapids along the cold, crystalline currents of the Ganges in Rishikesh.",
    icon: Waves,
    difficulty: "Moderate",
    accent: "from-cyan-400 to-sky-500",
    glow: "shadow-cyan-500/10"
  },
  {
    id: "camping",
    title: "Alpine Meadow Camping",
    description: "Sleep under a blanket of infinite stars, surrounded by dense silver fir forests and crisp mountain air.",
    icon: Flame,
    difficulty: "Easy / Family Friendly",
    accent: "from-amber-400 to-orange-500",
    glow: "shadow-amber-500/10"
  },
  {
    id: "skiing",
    title: "Himalayan Skiing",
    description: "Slide down the powdery snow slopes of Auli, featuring one of the longest and most scenic chairlifts in Asia.",
    icon: Snowflake,
    difficulty: "Beginner to Advanced",
    accent: "from-blue-300 to-indigo-500",
    glow: "shadow-blue-500/10"
  },
  {
    id: "bungee",
    title: "Bungee Jumping",
    description: "Take a giant leap of faith from India's highest fixed cantilever platform (83 meters) over a rocky river.",
    icon: Zap,
    difficulty: "Extreme Thrill",
    accent: "from-rose-400 to-red-500",
    glow: "shadow-rose-500/10"
  },
  {
    id: "safari",
    title: "Wildlife Wilderness Safari",
    description: "Embark on an open-roof Jeep safari through Corbett National Park to catch a glimpse of wild tigers.",
    icon: Trees,
    difficulty: "Easy / Peaceful",
    accent: "from-green-500 to-emerald-700",
    glow: "shadow-green-500/10"
  }
];

export default function Adventure() {
  const [activeAdventure, setActiveAdventure] = useState(null);

  const handleCardClick = (id) => {
    const advData = ADVENTURES_DATA[id];
    if (advData) {
      setActiveAdventure(advData);
    }
  };

  return (
    <section id="adventure" className="py-24 bg-stone-50 relative overflow-hidden">
      {/* Visual background details */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-300/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div className="text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center space-x-2 text-orange-600 text-xs sm:text-sm font-sans font-extrabold uppercase tracking-widest mb-3"
            >
              <Zap className="w-4 h-4 text-orange-600 animate-pulse" />
              <span>Unleash the Thrill</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-3xl sm:text-5xl font-serif font-black text-stone-900"
            >
              Adventure Activities
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true }}
              className="w-32 h-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full mt-4 origin-left"
            />
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-stone-600 font-sans max-w-md text-sm sm:text-base font-light mt-4 md:mt-0 leading-relaxed"
          >
            Devbhoomi is not just about peace; it's a giant playground for the brave. Experience high-octane thrills in the lap of snow-bound giants.
          </motion.p>
        </div>

        {/* Adventure Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ADVENTURES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.08 }}
                whileHover={{ 
                  scale: 1.02, 
                  y: -5,
                  transition: { duration: 0.2 }
                }}
                onClick={() => handleCardClick(item.id)}
                className={`group p-6 rounded-2xl bg-white hover:bg-orange-50/60 border border-stone-200 hover:border-orange-300 flex flex-col justify-between h-72 shadow-lg shadow-stone-900/5 ${item.glow} hover:shadow-2xl transition-all duration-300 cursor-pointer`}
              >
                <div>
                  {/* Icon with glow background */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-3.5 rounded-xl bg-gradient-to-br ${item.accent} text-stone-950 flex items-center justify-center shadow-md`}>
                      <Icon className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                    </div>
                    <span className="text-[10px] font-sans font-extrabold uppercase tracking-wider text-orange-700 bg-orange-100 border border-orange-200 px-2.5 py-1 rounded-full">
                      {item.difficulty}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-serif font-bold text-stone-900 mb-2 group-hover:text-orange-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-sans font-normal text-stone-600 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>

                {/* Explore link */}
                <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                  <span className="text-xs font-sans font-bold text-orange-600 group-hover:text-orange-700 flex items-center gap-1">
                    Explore Details
                  </span>
                  <div className="p-1.5 rounded-lg bg-orange-100 text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Activity Details Modal */}
      <AnimatePresence>
        {activeAdventure && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveAdventure(null)}
              className="fixed inset-0 bg-stone-950/80 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10 border border-stone-200"
            >
              {/* Modal Header */}
              <div className="relative p-6 sm:p-8 bg-stone-950 text-white flex items-center justify-between shrink-0">
                <div className="absolute inset-0 opacity-40 z-0">
                  <Image
                    src={activeAdventure.heroImage}
                    alt={activeAdventure.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-stone-950/40" />
                </div>

                <div className="relative z-10 pr-8">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider bg-orange-500 text-white rounded-full">
                      {activeAdventure.difficulty}
                    </span>
                    <span className="flex items-center gap-1 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider bg-amber-400 text-stone-900 rounded-full">
                      <Star className="w-3 h-3 fill-stone-900" />
                      {activeAdventure.rating} Rating
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-4xl font-serif font-black text-white mb-1">
                    {activeAdventure.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-300 font-sans font-light">
                    "{activeAdventure.subtitle}"
                  </p>
                </div>

                <button
                  onClick={() => setActiveAdventure(null)}
                  className="relative z-10 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition backdrop-blur-md"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Scrollable Body */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-1 bg-stone-50/50">
                
                {/* Overview */}
                <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm">
                  <p className="text-stone-700 text-xs sm:text-sm leading-relaxed">
                    {activeAdventure.overview}
                  </p>
                </div>

                <div className="flex justify-center">
                  <Link
                    href={`/adventure/${activeAdventure.id}`}
                    className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1"
                  >
                    <span>Full Activity Page</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
