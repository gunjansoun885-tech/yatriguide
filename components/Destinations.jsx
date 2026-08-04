"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, ArrowUpRight, Compass, Star } from "lucide-react";

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
            Discover the magical spirit of Uttarakhand. From rapid white water rivers to peaceful mountain shrines, crystal-clear Himalayan adventures await.
          </motion.p>
        </div>

        {/* Destinations Grid (100% Crystal Clear Images - Zero Blur) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {DESTINATIONS_DATA.map((dest, idx) => (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              className="group relative rounded-3xl overflow-hidden aspect-[4/5] bg-stone-100 shadow-xl shadow-stone-900/10 cursor-pointer border border-stone-200 transition-all duration-500"
            >
              {/* Card Image (Sharp High Definition - Zero Blur/Filter) */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                style={{ 
                  backgroundImage: `url('${dest.image}')`,
                  filter: "none",
                  backdropFilter: "none",
                  opacity: 1
                }}
              />

              {/* Minimal Bottom Text Gradient Only (Keeps 80% of Image 100% Crystal Clear) */}
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

                <h3 className="text-2xl sm:text-3xl font-serif font-black text-white flex items-center justify-between drop-shadow-md">
                  <span>{dest.title}</span>
                  <ArrowUpRight className="w-6 h-6 text-orange-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 shrink-0 ml-2" />
                </h3>

                {/* Expandable Details */}
                <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-500 ease-in-out overflow-hidden">
                  <p className="text-xs sm:text-sm font-sans font-normal text-stone-200 leading-relaxed border-t border-white/20 pt-3 mt-3">
                    {dest.description}
                  </p>
                  
                  <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-orange-400 uppercase tracking-wider">
                    <span>Explore Details</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
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
