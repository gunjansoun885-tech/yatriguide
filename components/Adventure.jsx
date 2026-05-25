"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Compass, 
  Waves, 
  Flame, 
  Snowflake, 
  Zap, 
  Trees, 
  ArrowUpRight 
} from "lucide-react";

const ADVENTURES = [
  {
    id: "trekking",
    title: "High Altitude Trekking",
    description: "Trek through pristine alpine meadows like Valley of Flowers, Har Ki Dun, or Roopkund with professional guides.",
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
    description: "Embark on an open-roof Jeep safari through Corbett or Rajaji National Park to catch a glimpse of wild tigers.",
    icon: Trees,
    difficulty: "Easy / Peaceful",
    accent: "from-green-500 to-forest-800",
    glow: "shadow-green-500/10"
  }
];

export default function Adventure() {
  return (
    <section id="adventure" className="py-24 bg-stone-900 relative overflow-hidden">
      {/* Visual background details */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div className="text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center space-x-2 text-gold-400 text-xs sm:text-sm font-sans font-extrabold uppercase tracking-widest mb-3"
            >
              <Zap className="w-4 h-4 text-gold-400 animate-pulse" />
              <span>Unleash the Thrill</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-3xl sm:text-5xl font-serif font-black text-white"
            >
              Adventure Activities
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true }}
              className="w-32 h-1 bg-gradient-to-r from-gold-500 to-amber-500 rounded-full mt-4 origin-left"
            />
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-stone-400 font-sans max-w-md text-sm sm:text-base font-light mt-4 md:mt-0 leading-relaxed"
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
                className={`group p-6 rounded-2xl bg-forest-950/20 hover:bg-forest-950/40 border border-white/5 hover:border-emerald-500/30 flex flex-col justify-between h-72 shadow-lg shadow-black/20 ${item.glow} hover:shadow-2xl transition-all duration-300`}
              >
                <div>
                  {/* Icon with glow background */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-3.5 rounded-xl bg-gradient-to-br ${item.accent} text-forest-950 flex items-center justify-center shadow-md`}>
                      <Icon className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                    </div>
                    <span className="text-[10px] font-sans font-extrabold uppercase tracking-wider text-gold-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
                      {item.difficulty}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-serif font-bold text-white mb-2 group-hover:text-gold-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-sans font-light text-stone-300 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>

                {/* Explore link */}
                <div className="flex items-center space-x-1.5 text-xs font-sans font-semibold text-emerald-400 mt-4 cursor-pointer group-hover:text-gold-400 transition-colors">
                  <span>Explore packages</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
