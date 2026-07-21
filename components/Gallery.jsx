"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

const GALLERY_IMAGES = [
  {
    id: 1,
    url: "/kedar.png",
    title: "Kedarnath Temple Peak",
    caption: "A magnificent snowy peak hovering over the ancient Kedarnath Shrine.",
    size: "tall"
  },
  {
    id: 2,
    url: "/rafting.jpeg",
    title: "White Water Currents",
    caption: "Conquering wild rapids under deep green gorges of Rishikesh.",
    size: "wide"
  },
  {
    id: 3,
    url: "/mussorie.png",
    title: "Misty Mussoorie Hills",
    caption: "Golden clouds sweeping through dense pine ridges of Garhwal.",
    size: "square"
  },
  {
    id: 4,
    url: "/nanital.jpg",
    title: "Rowboats in Nainital",
    caption: "Colorful traditional rowboats lined up along the serene Naini lake.",
    size: "tall"
  },
  {
    id: 5,
    url: "/auli.jpeg",
    title: "Auli Snow Slopes",
    caption: "Thick ski slopes facing the monumental Nanda Devi Himalayan Peak.",
    size: "wide"
  },
  {
    id: 6,
    url: "/jim.webp",
    title: "Royal Bengal Tiger",
    caption: "A majestic tiger cooling off in the dense riverine forests of Corbett.",
    size: "tall"
  },
  {
    id: 7,
    url: "/auli.jpeg",
    title: "Alpine Meadows of Auli",
    caption: "Lush bugyals blooming with wildflower colonies under sun-kissed peaks.",
    size: "wide"
  },
  {
    id: 8,
    url: "/lakshman.jpeg",
    title: "Sacred Lakshman Jhula",
    caption: "A historic suspension bridge overlooking spiritual chants along the Ganges.",
    size: "square"
  }
];

export default function Gallery() {
  const [activeIdx, setActiveIdx] = useState(null);

  // Close lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setActiveIdx(null);
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    if (activeIdx !== null) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIdx]);

  const handlePrev = () => {
    setActiveIdx((prev) => (prev === 0 ? GALLERY_IMAGES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev === GALLERY_IMAGES.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="gallery" className="py-24 bg-gradient-to-b from-stone-100 to-stone-50 relative border-t border-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center justify-center space-x-2 text-black-400 text-xs sm:text-sm font-sans font-extrabold uppercase tracking-widest mb-3"
          >
            <ImageIcon className="w-4 h-4" />
            <span>Captured Landscapes</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl font-serif font-black text-stone-800 mb-4"
          >
            Devbhoomi Photo Gallery
          </motion.h2>
          <motion.div className="w-24 h-1 bg-gradient-to-r from-gold-500 to-amber-500 mx-auto rounded-full mb-6" />
          <p className="text-stone-600 font-sans max-w-xl mx-auto text-sm sm:text-base font-light">
            Take a visual tour through our postcard-perfect lens. Click any photograph to launch the cinematic lightbox.
          </p>
        </div>

        {/* Masonry Layout Grid using CSS columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 box-border mx-auto w-full">
          {GALLERY_IMAGES.map((img, idx) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.05 }}
              onClick={() => setActiveIdx(idx)}
              className="relative break-inside-avoid mb-6 rounded-2xl overflow-hidden cursor-pointer group bg-white border border-orange-100 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <img
                src={img.url}
                alt={img.title}
                loading="lazy"
                className="w-full object-cover rounded-2xl transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 z-10">
                <div className="w-8 h-8 rounded-full bg-gold-500 text-forest-950 flex items-center justify-center mb-3 self-end shadow-md scale-75 group-hover:scale-100 transition-transform duration-300">
                  <ZoomIn className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <h4 className="text-sm font-serif font-bold text-gold-400">{img.title}</h4>
                  <p className="text-[11px] font-sans text-stone-200 font-light mt-1 line-clamp-2 leading-relaxed">
                    {img.caption}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Portal Backdrop */}
      <AnimatePresence>
        {activeIdx !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Dark glassmorphic portal background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveIdx(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-zoom-out"
            />

            {/* Portal Content Frame */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="relative w-full max-w-5xl z-10 flex flex-col items-center justify-center"
            >
              {/* Lightbox Header UI */}
              <div className="absolute -top-12 left-0 right-0 flex items-center justify-between text-white px-2">
                <span className="font-sans text-xs font-semibold text-stone-400 uppercase tracking-widest">
                  Postcard {activeIdx + 1} of {GALLERY_IMAGES.length}
                </span>
                <button
                  onClick={() => setActiveIdx(null)}
                  className="flex items-center space-x-1.5 px-3 py-1 bg-white/5 border border-white/10 hover:bg-white/15 rounded-full text-xs font-sans font-bold tracking-wider transition-colors focus:outline-none"
                >
                  <X className="w-4 h-4 text-stone-300" />
                  <span>Close</span>
                </button>
              </div>

              {/* Navigation Left Arrow */}
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white z-20 focus:outline-none transition-colors hidden sm:block"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Main Expanded Image */}
              <div className="max-h-[70vh] max-w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl flex items-center justify-center bg-stone-950">
                <img
                  src={GALLERY_IMAGES[activeIdx].url}
                  alt={GALLERY_IMAGES[activeIdx].title}
                  className="max-h-[70vh] object-contain w-auto max-w-full"
                />
              </div>

              {/* Navigation Right Arrow */}
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white z-20 focus:outline-none transition-colors hidden sm:block"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Description Drawer Details */}
              <div className="w-full max-w-2xl bg-stone-900/90 border border-white/5 rounded-2xl p-5 mt-6 text-center text-white backdrop-blur-md">
                <h3 className="text-xl font-serif font-black text-gold-400">
                  {GALLERY_IMAGES[activeIdx].title}
                </h3>
                <p className="text-sm font-sans font-light text-stone-300 mt-2 leading-relaxed">
                  {GALLERY_IMAGES[activeIdx].caption}
                </p>

                {/* Mobile Navigation controls */}
                <div className="flex sm:hidden justify-center space-x-6 mt-4 pt-3 border-t border-white/5">
                  <button onClick={handlePrev} className="px-3 py-1 bg-white/5 border border-white/10 rounded font-sans text-xs">Prev</button>
                  <button onClick={handleNext} className="px-3 py-1 bg-white/5 border border-white/10 rounded font-sans text-xs">Next</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
