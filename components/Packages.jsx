"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Star, CheckCircle, Shield, ArrowRight, X } from "lucide-react";

const PACKAGES_DATA = [
  {
    id: "chardham",
    title: "Sacred Char Dham Pilgrimage",
    duration: "10 Nights / 11 Days",
    rating: 5,
    reviews: 142,
    price: "28,999",
    originalPrice: "34,999",
    image: "/chardham.jpg",
    inclusions: ["Chauffeur Driven SUV", "Premium Hotels", "VIP Temple Entry", "Pure Veg Meals"],
    badge: "Most Sacred"
  },
  {
    id: "adventure-ski",
    title: "Rishikesh Rafting & Auli Skiing Retreat",
    duration: "5 Nights / 6 Days",
    rating: 4,
    reviews: 98,
    price: "16,499",
    originalPrice: "19,999",
    image: "/rafting.jpeg",
    inclusions: ["Skiing Equipment", "Ganga White-Water Rafting", "Riverside Camping", "Scenic Cable Car Ticket"],
    badge: "Thrill Seeker"
  },
  {
    id: "hills-lakes",
    title: "Queen of Hills & Lakes Tour",
    duration: "4 Nights / 5 Days",
    rating: 5,
    reviews: 84,
    price: "11,999",
    originalPrice: "14,500",
    image: "/queen.jpg",
    inclusions: ["Private Luxury Sedan", "Lake-view Stays", "Boat Ride Tickets", "Local Tour Guide"],
    badge: "Leisure Escape"
  }
];

export default function Packages() {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", date: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setSelectedPackage(null);
        setFormData({ name: "", email: "", phone: "", date: "" });
      }, 2500);
    }, 1500);
  };

  return (
    <section id="packages" className="py-24 bg-stone-900/95 relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center justify-center space-x-2 text-gold-500 text-xs sm:text-sm font-sans font-extrabold uppercase tracking-widest mb-3"
          >
            <Shield className="w-4 h-4" />
            <span>100% Certified Safe Travels</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl font-serif font-black text-white mb-4"
          >
            Featured Travel Packages
          </motion.h2>
          <motion.div className="w-24 h-1 bg-gradient-to-r from-gold-500 to-amber-500 mx-auto rounded-full mb-6" />
          <p className="text-stone-300 font-sans max-w-xl mx-auto text-sm sm:text-base font-light">
            All-inclusive boutique experiences designed to give you a stress-free immersion into Uttarakhand's majestic landscape.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PACKAGES_DATA.map((pkg, idx) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="group flex flex-col justify-between rounded-2xl overflow-hidden bg-forest-950/20 border border-white/5 hover:border-emerald-500/30 shadow-xl shadow-black/30 hover:shadow-black/50 transition-all duration-300"
            >
              {/* Image & Badge Header */}
              <div className="relative h-60 w-full overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{ backgroundImage: `url('${pkg.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent z-10" />
                <span className="absolute top-4 left-4 z-20 px-3 py-1 bg-gold-500 text-forest-950 font-sans font-extrabold text-[10px] uppercase tracking-wider rounded shadow-md">
                  {pkg.badge}
                </span>
              </div>

              {/* Package Details */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-400 font-sans mb-3">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-gold-400" />
                      <span>{pkg.duration}</span>
                    </span>
                    <div className="flex items-center space-x-1">
                      <div className="flex text-gold-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 fill-current ${i < pkg.rating ? "text-gold-400" : "text-stone-600"}`}
                          />
                        ))}
                      </div>
                      <span className="font-bold text-[10px] text-stone-300 font-sans">({pkg.reviews})</span>
                    </div>
                  </div>

                  <h3 className="text-lg sm:text-xl font-serif font-black text-white mb-4 group-hover:text-gold-400 transition-colors">
                    {pkg.title}
                  </h3>

                  {/* Inclusion Tags */}
                  <div className="space-y-2 mb-6">
                    {pkg.inclusions.map((inc, i) => (
                      <div key={i} className="flex items-center space-x-2 text-xs text-stone-300 font-sans font-light">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price & Book Button */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-stone-400 block font-sans">Price starting at</span>
                    <div className="flex items-baseline space-x-1.5">
                      <span className="text-xl sm:text-2xl font-sans font-black text-gold-400">₹{pkg.price}</span>
                      <span className="text-xs text-stone-400 line-through">₹{pkg.originalPrice}</span>
                    </div>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedPackage(pkg)}
                    className="px-4 py-2.5 bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-600 hover:to-emerald-700 border border-emerald-500/30 text-white font-sans font-bold text-xs rounded-xl shadow flex items-center space-x-1 cursor-pointer transition-colors"
                  >
                    <span>Book Now</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Dynamic Booking Portal Overlay */}
      <AnimatePresence>
        {selectedPackage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Dark blur backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPackage(null)}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            />

            {/* Portal Content Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-stone-900 border border-white/10 p-6 rounded-2xl shadow-2xl z-10"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPackage(null)}
                className="absolute top-4 right-4 p-1 text-stone-400 hover:text-white border border-white/10 rounded-full hover:bg-white/5 transition-colors focus:outline-none"
              >
                <X className="w-4 h-4" />
              </button>

              {success ? (
                <div className="text-center py-10 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-400/40 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-400 animate-bounce" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-white mb-2">Booking Requested!</h3>
                  <p className="text-sm font-sans text-stone-400 max-w-xs leading-relaxed">
                    Thank you! Our personal Yatra Sarthi guide will call you within 2 hours with customized lodging options.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-6 text-left">
                    <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-emerald-400">
                      Customize Your Travel
                    </span>
                    <h3 className="text-xl font-serif font-black text-white mt-1">
                      {selectedPackage.title}
                    </h3>
                    <p className="text-xs font-sans text-stone-400 mt-1">
                      Package Rate: <span className="text-gold-400 font-bold">₹{selectedPackage.price}/person</span>
                    </p>
                  </div>

                  <form onSubmit={handleBookingSubmit} className="space-y-4 text-left">
                    <div>
                      <label className="block text-xs font-sans text-stone-300 font-bold mb-1.5 uppercase tracking-wider">
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-950 border border-white/10 text-white rounded-lg text-sm focus:outline-none focus:border-gold-500 font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-sans text-stone-300 font-bold mb-1.5 uppercase tracking-wider">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-950 border border-white/10 text-white rounded-lg text-sm focus:outline-none focus:border-gold-500 font-sans"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-sans text-stone-300 font-bold mb-1.5 uppercase tracking-wider">
                          Mobile Number
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="+91-"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-3 py-2 bg-stone-950 border border-white/10 text-white rounded-lg text-sm focus:outline-none focus:border-gold-500 font-sans"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-sans text-stone-300 font-bold mb-1.5 uppercase tracking-wider">
                          Start Date
                        </label>
                        <input
                          type="date"
                          required
                          value={formData.date}
                          min={new Date().toISOString().split("T")[0]}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className="w-full px-3 py-2 bg-stone-950 border border-white/10 text-white rounded-lg text-sm focus:outline-none focus:border-gold-500 font-sans scheme-dark"
                        />
                      </div>
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-600 hover:to-amber-600 text-forest-950 font-sans font-extrabold text-sm uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center space-x-2 cursor-pointer mt-6"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-forest-950 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <span>Confirm Inquiry</span>
                      )}
                    </motion.button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
