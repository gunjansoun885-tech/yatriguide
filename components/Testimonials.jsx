"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Star, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";

const TESTIMONIALS_DATA = [
  {
    id: 1,
    name: "Aarav Sharma",
    location: "New Delhi, India",
    review: "Our sacred Char Dham yatra was incredibly organized! Our elderly parents had VIP passes, pure satvik food, and comfortable SUVs. YatraSarthi truly made our pilgrimage feel holy, peaceful, and entirely stress-free.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80"
  },
  {
    id: 2,
    name: "Priya Patel",
    location: "Mumbai, India",
    review: "I took a group trip with my friends for white-water rafting in Rishikesh and skiing in Auli. The equipment, guides, and camping sites were incredibly premium. The local stories told by our guide by the bonfire were the absolute highlight!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80"
  },
  {
    id: 3,
    name: "Dr. Robert Miller",
    location: "London, UK",
    review: "We booked the Corbett wilderness safari. Incredible luxury tents, and on day two, we saw a gorgeous Bengal Tiger stalking a deer under the morning mist. Outstanding support. Highly recommended for international travelers!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80"
  }
];

export default function Testimonials() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const timerRef = useRef(null);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setDirection(1);
      setCurrentIdx((prev) => (prev + 1) % TESTIMONIALS_DATA.length);
    }, 6000);
  };

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIdx((prev) => (prev === 0 ? TESTIMONIALS_DATA.length - 1 : prev - 1));
    resetTimer();
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIdx((prev) => (prev + 1) % TESTIMONIALS_DATA.length);
    resetTimer();
  };

  const handleDotClick = (idx) => {
    setDirection(idx > currentIdx ? 1 : -1);
    setCurrentIdx(idx);
    resetTimer();
  };

  // Slider animation variants
  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 150 : -150,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 28 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 }
      }
    },
    exit: (dir) => ({
      x: dir < 0 ? 150 : -150,
      opacity: 0,
      scale: 0.95,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 28 },
        opacity: { duration: 0.3 },
        scale: { duration: 0.3 }
      }
    })
  };

  return (
    <section id="testimonials" className="py-24 bg-forest-950 relative overflow-hidden border-t border-white/5">
      {/* Dynamic green particle background */}
      <div className="absolute top-10 left-10 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl" />
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-gold-500/5 rounded-full blur-2xl" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Section Header */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center justify-center space-x-2 text-gold-400 text-xs sm:text-sm font-sans font-extrabold uppercase tracking-widest mb-3"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Voices of Devbhoomi</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl font-serif font-black text-white"
          >
            Travelers Testimonials
          </motion.h2>
          <motion.div className="w-24 h-1 bg-gradient-to-r from-gold-500 to-amber-500 mx-auto rounded-full mt-4" />
        </div>

        {/* Carousel Slider Panel */}
        <div className="relative min-h-[380px] sm:min-h-[300px] flex items-center justify-center">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIdx}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full glassmorphism p-8 sm:p-12 rounded-3xl border border-white/10 shadow-2xl relative"
            >
              {/* Giant floating Quote Icon */}
              <Quote className="absolute top-6 left-6 w-16 h-16 text-emerald-500/10 -scale-x-100 pointer-events-none" />

              {/* Review Ratings */}
              <div className="flex justify-center text-gold-400 mb-6 space-x-1">
                {Array.from({ length: TESTIMONIALS_DATA[currentIdx].rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>

              {/* Review Text */}
              <blockquote className="text-base sm:text-lg text-stone-200 font-serif leading-relaxed italic mb-8 max-w-2xl mx-auto">
                "{TESTIMONIALS_DATA[currentIdx].review}"
              </blockquote>

              {/* Profile Details */}
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                <img
                  src={TESTIMONIALS_DATA[currentIdx].avatar}
                  alt={TESTIMONIALS_DATA[currentIdx].name}
                  className="w-14 h-14 rounded-full border-2 border-gold-500/80 object-cover shadow"
                />
                <div className="text-left text-center sm:text-left">
                  <cite className="not-italic text-sm font-sans font-bold text-white block">
                    {TESTIMONIALS_DATA[currentIdx].name}
                  </cite>
                  <span className="text-xs font-sans text-stone-400">
                    {TESTIMONIALS_DATA[currentIdx].location}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-0 sm:-left-16 top-1/2 -translate-y-1/2 p-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full z-20 focus:outline-none transition-colors"
            aria-label="Previous review"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 sm:-right-16 top-1/2 -translate-y-1/2 p-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full z-20 focus:outline-none transition-colors"
            aria-label="Next review"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Carousel Pagination Dots */}
        <div className="flex justify-center space-x-2.5 mt-8">
          {TESTIMONIALS_DATA.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleDotClick(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                currentIdx === idx ? "bg-gold-500 w-6" : "bg-white/20 hover:bg-white/45"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
