"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const HERO_IMAGES = [
  "/j1.png",
  "/kedarnath modi.png",
  "/modiji.png",
  "/psd.png",
  "/nainital.png",
  "/kedar.png",
  "/image.png",
  "/kainchi.png",
  "/mussorie.png",
];

export default function Hero() {
  const [currentBg, setCurrentBg] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="relative h-[100svh] w-full overflow-hidden">
      <div className="absolute inset-0 z-0 bg-stone-950">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBg}
            initial={{ opacity: 0, scale: 1.15 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute inset-0 overflow-hidden"
          >
            <Image
              src={HERO_IMAGES[currentBg]}
              alt="Uttarakhand travel destination"
              fill
              priority={currentBg === 0}
              sizes="100vw"
              className="h-full w-full bg-stone-950 object-cover object-center sm:object-cover"
              style={{ transform: "scale(1.04)" }}
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/55" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-orange-950/80 to-transparent" />
      </div>

      {currentBg === 0 && (
        <div className="relative z-10 flex h-[100svh] w-full items-center justify-center px-4 pb-8 pt-16 sm:px-6 sm:pb-10 sm:pt-0 lg:px-8 lg:pb-12">
          <div className="max-w-4xl text-center">
            <h1 className="font-serif text-[2rem] font-black leading-[0.95] tracking-tight text-white text-shadow-lg sm:text-[2.8rem] md:text-[3.8rem] lg:text-[4.5rem] xl:text-[5.2rem]">
              Discover the Beauty
              <br className="hidden sm:block" />
              of Uttarakhand
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-stone-100/95 sm:text-base md:max-w-3xl md:text-lg md:leading-7 lg:text-xl">
              Explore ancient temples, mystic mist-clad peaks, pristine river currents,
              and dense alpine forests. Plan your spiritual and thrill-seeking retreat.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
