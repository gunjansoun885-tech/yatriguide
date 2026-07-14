"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, ArrowUpRight, Compass } from "lucide-react";

const DESTINATIONS_DATA = [
  {
    id: "mussoorie",
    title: "Mussoorie",
    tagline: "The Queen of Hills",
    description: "Nestled in the Garhwal Himalayan foothills, Mussoorie offers stunning vistas of mist-shrouded valleys, colonial-era architecture, and the cascading Kempty Falls.",
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
    image: "/auli.jpeg",
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
  return (
    <section id="destinations" className="py-24 bg-gradient-to-b from-forest-950 to-stone-900 relative">
      {/* Decorative leaf/forest background elements */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center space-x-2 text-gold-400 text-xs sm:text-sm font-sans font-extrabold uppercase tracking-widest mb-3"
          >
            <Compass className="w-4 h-4 text-gold-400" />
            <span>Curated Handpicked Vistas</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-3xl sm:text-5xl font-serif font-black text-white mb-4"
          >
            Popular Destinations
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-24 h-1 bg-gradient-to-r from-gold-500 to-amber-500 mx-auto rounded-full mb-6"
          />
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-stone-300 font-sans max-w-xl mx-auto text-sm sm:text-base font-light"
          >
            Discover the magical spirit of Northern India. From rapid cold rivers to peaceful mountain shrines, adventure awaits in every corner.
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
              whileHover={{ y: -12 }}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-stone-950 shadow-xl shadow-black/35 cursor-pointer border border-white/5 transition-all duration-500"
            >
              {/* Card Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                style={{ backgroundImage: `url('${dest.image}')` }}
              />

              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-black/10 group-hover:via-stone-950/30 transition-all duration-300" />

              {/* Card Badge */}
              <div className="absolute top-4 left-4 z-20">
                <span className="px-3 py-1 text-[10px] font-sans font-bold uppercase tracking-widest text-white bg-forest-950/70 border border-emerald-500/35 rounded-full backdrop-blur-md">
                  {dest.category}
                </span>
              </div>

              {/* Card Content (Always visible/Floating up on hover) */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-left flex flex-col justify-end h-1/2">
                <div className="flex items-center space-x-1.5 text-gold-400 mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="text-xs font-sans font-semibold tracking-wider">{dest.tagline}</span>
                </div>
                
                <h3 className="text-xl sm:text-2xl font-serif font-black text-white group-hover:text-gold-400 transition-colors flex items-center justify-between">
                  <span>{dest.title}</span>
                  <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 text-gold-400" />
                </h3>

                {/* Smooth expanding description */}
                <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-500 ease-in-out overflow-hidden mt-3">
                  <p className="text-xs sm:text-sm font-sans font-light text-stone-200/90 leading-relaxed border-t border-white/10 pt-3">
                    {dest.description}
                  </p>
                </div>
                
                {/* Rating Bar */}
                <div className="flex items-center justify-between mt-3 text-[11px] font-sans text-stone-400">
                  <span>Explore Itinerary</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-gold-400 font-bold">★</span>
                    <span className="text-stone-200 font-bold">{dest.rating}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
