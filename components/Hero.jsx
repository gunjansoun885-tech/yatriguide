"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Calendar, Users, ChevronRight, Compass } from "lucide-react";

const HERO_IMAGES = [
  "/o1.png",
  "/kedarnath modi.png",
  "/modiji.png",
  "/psd.png",
  "/nanital.png",
  "/kedar.png",
  "/image.png",
  "/kainchi.png",
  "/mussorie.png",
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
   <section
  id="home"
 className="relative w-full h-[100svh] min-h-[600px] flex items-center justify-center overflow-hidden"
>
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
        <div> className="absolute inset-0 bg-cover bg-center md:bg-center bg-top"
      </div>

      

        {/* Cinematic Main Heading */}
       
        


      {/* Hero bottom glow overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-orange-950/80 to-transparent z-15" />
    </section>
    );
    }
  
  
  

