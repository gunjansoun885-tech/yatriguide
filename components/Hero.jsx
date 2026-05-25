"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Calendar, Users, ChevronRight, Compass } from "lucide-react";

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1626621340035-b86362d5ab85?auto=format&fit=crop&w=1920&q=85", // Snowy Peaks near Kedarnath
  "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1920&q=85", // River rafting & yoga in Rishikesh
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=85"  // Majestic Pine Valleys of Auli
];

const DESTINATIONS = [
  "Mussoorie (Queen of Hills)",
  "Nainital (Lake District)",
  "Rishikesh (Yoga Capital)",
  "Kedarnath (Sacred Peak)",
  "Auli (Skiing Paradise)",
  "Jim Corbett (Wildlife Safari)"
];

export default function Hero() {
  const [currentBg, setCurrentBg] = useState(0);
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [travelers, setTravelers] = useState("1");
  const [isSearching, setIsSearching] = useState(false);

  // Background image rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      alert(`Searching customized itinerary for ${destination || "Uttarakhand"} starting on ${date || "any date"} for ${travelers} traveler(s)!`);
      const element = document.querySelector("#destinations");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 1200);
  };

  return (
    <section id="home" className="relative w-full h-[100vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Images with AnimatePresence */}
      <div className="absolute inset-0 z-0 bg-stone-950">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBg}
            initial={{ opacity: 0, scale: 1.15 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${HERO_IMAGES[currentBg]}')` }}
          />
        </AnimatePresence>
        {/* Gradients Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-black/40 to-black/60 z-10" />
      </div>

      {/* Main Content */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6 flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 font-sans text-xs sm:text-sm font-semibold uppercase tracking-widest backdrop-blur-md"
        >
          <Compass className="w-4 h-4 text-gold-400 animate-spin-slow" />
          <span>Explore Devbhoomi Uttarakhand</span>
        </motion.div>

        {/* Cinematic Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-4xl sm:text-6xl md:text-7xl font-serif font-black tracking-tight text-white mb-6 leading-tight text-shadow-lg"
        >
          Discover the Beauty <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-amber-300 to-emerald-300">
            of Uttarakhand
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.7 }}
          className="text-base sm:text-xl text-stone-200/90 font-sans font-light max-w-2xl mb-12 leading-relaxed text-shadow-md"
        >
          Explore ancient temples, mystic mist-clad peaks, pristine river currents, and dense alpine forests. Plan your spiritual and thrill-seeking retreat.
        </motion.p>

        {/* Search Widget Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, type: "spring", stiffness: 100, delay: 0.9 }}
          className="w-full max-w-4xl"
        >
          <form
            onSubmit={handleSearchSubmit}
            className="glassmorphism p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/10 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between"
          >
            {/* Field 1: Destination Selector */}
            <div className="flex-1 text-left min-w-[200px] border-b md:border-b-0 md:border-r border-white/10 pb-3 md:pb-0 md:pr-4">
              <div className="flex items-center space-x-2 text-gold-400 mb-1.5">
                <MapPin className="w-4 h-4" />
                <label className="text-[11px] font-sans font-bold uppercase tracking-wider text-emerald-300">
                  Where to?
                </label>
              </div>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-transparent text-white font-sans text-sm font-semibold focus:outline-none cursor-pointer appearance-none"
              >
                <option value="" className="bg-forest-950 text-white/50">Select Destination</option>
                {DESTINATIONS.map((dest) => (
                  <option key={dest} value={dest} className="bg-forest-950 text-white">
                    {dest}
                  </option>
                ))}
              </select>
            </div>

            {/* Field 2: Date Picker */}
            <div className="flex-1 text-left min-w-[150px] border-b md:border-b-0 md:border-r border-white/10 pb-3 md:pb-0 md:pr-4">
              <div className="flex items-center space-x-2 text-gold-400 mb-1.5">
                <Calendar className="w-4 h-4" />
                <label className="text-[11px] font-sans font-bold uppercase tracking-wider text-emerald-300">
                  Travel Date
                </label>
              </div>
              <input
                type="date"
                value={date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-transparent text-white font-sans text-sm font-semibold focus:outline-none cursor-pointer scheme-dark"
              />
            </div>

            {/* Field 3: Travelers Counter */}
            <div className="flex-1 text-left min-w-[120px] pb-3 md:pb-0">
              <div className="flex items-center space-x-2 text-gold-400 mb-1.5">
                <Users className="w-4 h-4" />
                <label className="text-[11px] font-sans font-bold uppercase tracking-wider text-emerald-300">
                  Travelers
                </label>
              </div>
              <select
                value={travelers}
                onChange={(e) => setTravelers(e.target.value)}
                className="w-full bg-transparent text-white font-sans text-sm font-semibold focus:outline-none cursor-pointer appearance-none"
              >
                <option value="1" className="bg-forest-950 text-white">1 Guest</option>
                <option value="2" className="bg-forest-950 text-white">2 Guests</option>
                <option value="4" className="bg-forest-950 text-white">4 Guests</option>
                <option value="5+" className="bg-forest-950 text-white">Family / Group (5+)</option>
              </select>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSearching}
              className="px-6 py-4 bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-600 hover:to-amber-600 text-forest-950 font-sans font-extrabold text-sm uppercase tracking-wider rounded-xl sm:rounded-2xl shadow-xl shadow-gold-500/10 hover:shadow-gold-500/30 flex items-center justify-center space-x-2 cursor-pointer transition-all duration-300"
            >
              {isSearching ? (
                <div className="w-5 h-5 border-2 border-forest-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Explore Now</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>

      {/* Hero bottom glow overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-forest-950 to-transparent z-15" />
    </section>
  );
}
