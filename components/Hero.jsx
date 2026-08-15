"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HERO_IMAGES = [
  { desktop: "/oo1.png", mobile: "/mobile/oo1.png" },
  { desktop: "/g1.png", mobile: "/mobile/g1.png" },
  { desktop: "/ch.png", mobile: "/mobile/ch.png" },
  { desktop: "/nw.png", mobile: "/mobile/nw.png" },
  { desktop: "/opp.png", mobile: "/mobile/opp.png" },
  { desktop: "/jj1.png", mobile: "/mobile/jj1.png" },
  { desktop: "/nn1.png", mobile: "/mobile/nn1.png" },
  { desktop: "/s1.png", mobile: "/mobile/s1.png" },
  { desktop: "/kk2.png", mobile: "/mobile/kk2.png" },
];

export default function Hero() {
  const [currentBg, setCurrentBg] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setCurrentBg((prev) => (prev + 1) % HERO_IMAGES.length);
  };

  const handlePrev = () => {
    setCurrentBg((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);
  };

  return (
    <section
      id="home"
      className="relative h-[70vh] sm:h-[80vh] md:h-[85vh] lg:h-[90vh] xl:h-screen w-full overflow-hidden bg-stone-950 flex items-center justify-center"
    >
      {/* Full-bleed Hero Image covering 100% screen */}
      <div className="absolute inset-0 z-0 overflow-hidden flex items-center justify-center">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentBg}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 h-full w-full flex items-center justify-center"
          >
            {/* Desktop Hero Image (Unchanged) */}
            <Image
              src={HERO_IMAGES[currentBg].desktop}
              alt="Uttarakhand travel destination desktop"
              fill
              priority={currentBg === 0}
              unoptimized
              sizes="(min-width: 640px) 100vw, 0vw"
              className="hidden sm:block h-full w-full object-cover object-center transition-all duration-700"
            />

            {/* Mobile Hero Image (Custom generated portrait format for mobile) */}
            <Image
              src={HERO_IMAGES[currentBg].mobile}
              alt="Uttarakhand travel destination mobile"
              fill
              priority={currentBg === 0}
              unoptimized
              sizes="(max-width: 639px) 100vw, 0vw"
              className="block sm:hidden h-full w-full object-cover object-center transition-all duration-700"
            />
          </motion.div>
        </AnimatePresence>

        {/* Subtle Crisp Overlay for Text Legibility (No fog or image blur) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />
      </div>

      {/* Hero Content (Only shown on first slide or overlay) */}
      {currentBg === 0 && (
        <div className="relative z-10 flex h-full w-full items-center justify-center px-4 pb-16 pt-20 sm:px-6 md:pb-20 lg:px-8">
          <div className="max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block rounded-full bg-orange-500/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-orange-300 backdrop-blur-md border border-orange-500/30 mb-4">
                Devbhoomi Uttarakhand
              </span>
              <h1 className="font-serif text-[2.2rem] font-black leading-[1.05] tracking-tight text-white drop-shadow-md sm:text-[3.2rem] md:text-[4.2rem] lg:text-[5rem]">
                Discover the Beauty
                <br className="hidden sm:block" /> of Uttarakhand
              </h1>

              <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-stone-200/90 sm:text-base md:text-lg lg:text-xl">
                Explore ancient temples, mystic mist-clad peaks, pristine river currents, and dense alpine forests. Plan your spiritual and thrill-seeking retreat.
              </p>
            </motion.div>
          </div>
        </div>
      )}

      {/* Navigation Arrows for Desktop & Mobile */}
      <button
        type="button"
        onClick={handlePrev}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-2.5 text-white/80 backdrop-blur-md transition hover:bg-orange-600 hover:text-white focus:outline-none sm:left-6"
      >
        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>
      <button
        type="button"
        onClick={handleNext}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-2.5 text-white/80 backdrop-blur-md transition hover:bg-orange-600 hover:text-white focus:outline-none sm:right-6"
      >
        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      {/* Slide Indicator Dots */}
      <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2 px-4">
        {HERO_IMAGES.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setCurrentBg(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2.5 rounded-full transition-all duration-300 ${currentBg === index
              ? "w-8 bg-orange-500 shadow-md shadow-orange-500/50"
              : "w-2.5 bg-white/40 hover:bg-white/70"
              }`}
          />
        ))}
      </div>
    </section>
  );
}
