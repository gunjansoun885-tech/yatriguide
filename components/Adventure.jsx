"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Compass, 
  Waves, 
  Flame, 
  Snowflake, 
  Zap, 
  Trees, 
  ArrowUpRight,
  X,
  Star,
  CheckCircle2,
  Clock,
  Ticket,
  ShieldCheck,
  Calendar,
  User,
  Phone,
  Mail,
  ExternalLink,
  Sparkles
} from "lucide-react";
import { ADVENTURES_DATA } from "@/lib/adventure-data";

const ADVENTURES = [
  {
    id: "trekking",
    title: "High Altitude Trekking",
    description: "Trek through pristine alpine meadows like Valley of Flowers, Har Ki Dun, or Kedarkantha with certified mountain guides.",
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
    description: "Embark on an open-roof Jeep safari through Corbett National Park to catch a glimpse of wild tigers.",
    icon: Trees,
    difficulty: "Easy / Peaceful",
    accent: "from-green-500 to-emerald-700",
    glow: "shadow-green-500/10"
  }
];

export default function Adventure() {
  const [activeAdventure, setActiveAdventure] = useState(null);
  const [bookingPackage, setBookingPackage] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", date: "", travelers: 2 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBooking, setSuccessBooking] = useState(null);

  const handleCardClick = (id) => {
    const advData = ADVENTURES_DATA[id];
    if (advData) {
      setActiveAdventure(advData);
      setBookingPackage(null);
      setSuccessBooking(null);
    }
  };

  const handleBookNow = (pkg) => {
    setBookingPackage(pkg);
    setSuccessBooking(null);
    setFormData({ name: "", email: "", phone: "", date: "", travelers: 2 });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const bookingId = "YATRI-ADV-" + Math.floor(100000 + Math.random() * 900000);
      setSuccessBooking({
        id: bookingId,
        packageName: bookingPackage.title,
        price: bookingPackage.price,
        travelers: formData.travelers,
        date: formData.date || "As Selected",
        name: formData.name
      });
    }, 1200);
  };

  return (
    <section id="adventure" className="py-24 bg-stone-50 relative overflow-hidden">
      {/* Visual background details */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-300/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div className="text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center space-x-2 text-orange-600 text-xs sm:text-sm font-sans font-extrabold uppercase tracking-widest mb-3"
            >
              <Zap className="w-4 h-4 text-orange-600 animate-pulse" />
              <span>Unleash the Thrill</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-3xl sm:text-5xl font-serif font-black text-stone-900"
            >
              Adventure Activities
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true }}
              className="w-32 h-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full mt-4 origin-left"
            />
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-stone-600 font-sans max-w-md text-sm sm:text-base font-light mt-4 md:mt-0 leading-relaxed"
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
                onClick={() => handleCardClick(item.id)}
                className={`group p-6 rounded-2xl bg-white hover:bg-orange-50/60 border border-stone-200 hover:border-orange-300 flex flex-col justify-between h-72 shadow-lg shadow-stone-900/5 ${item.glow} hover:shadow-2xl transition-all duration-300 cursor-pointer`}
              >
                <div>
                  {/* Icon with glow background */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-3.5 rounded-xl bg-gradient-to-br ${item.accent} text-stone-950 flex items-center justify-center shadow-md`}>
                      <Icon className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                    </div>
                    <span className="text-[10px] font-sans font-extrabold uppercase tracking-wider text-orange-700 bg-orange-100 border border-orange-200 px-2.5 py-1 rounded-full">
                      {item.difficulty}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-serif font-bold text-stone-900 mb-2 group-hover:text-orange-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-sans font-normal text-stone-600 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>

                {/* Explore link */}
                <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                  <span className="text-xs font-sans font-bold text-orange-600 group-hover:text-orange-700 flex items-center gap-1">
                    Explore Packages
                  </span>
                  <div className="p-1.5 rounded-lg bg-orange-100 text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Activity Packages Modal */}
      <AnimatePresence>
        {activeAdventure && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setActiveAdventure(null); setBookingPackage(null); setSuccessBooking(null); }}
              className="fixed inset-0 bg-stone-950/80 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10 border border-stone-200"
            >
              {/* Modal Header */}
              <div className="relative p-6 sm:p-8 bg-stone-950 text-white flex items-center justify-between shrink-0">
                <div className="absolute inset-0 opacity-40 z-0">
                  <Image
                    src={activeAdventure.heroImage}
                    alt={activeAdventure.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-stone-950/40" />
                </div>

                <div className="relative z-10 pr-8">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider bg-orange-500 text-white rounded-full">
                      {activeAdventure.difficulty}
                    </span>
                    <span className="flex items-center gap-1 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider bg-amber-400 text-stone-900 rounded-full">
                      <Star className="w-3 h-3 fill-stone-900" />
                      {activeAdventure.rating} Rating
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-4xl font-serif font-black text-white mb-1">
                    {activeAdventure.title} Packages
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-300 font-sans font-light">
                    "{activeAdventure.subtitle}"
                  </p>
                </div>

                <button
                  onClick={() => { setActiveAdventure(null); setBookingPackage(null); setSuccessBooking(null); }}
                  className="relative z-10 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition backdrop-blur-md"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Scrollable Body */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-1 bg-stone-50/50">
                
                {/* Overview */}
                <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm">
                  <p className="text-stone-700 text-xs sm:text-sm leading-relaxed">
                    {activeAdventure.overview}
                  </p>
                </div>

                {/* Packages List */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg sm:text-xl font-serif font-black text-stone-900 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-orange-600" />
                      Select Expeditions & Book
                    </h3>
                    <Link
                      href={`/adventure/${activeAdventure.id}`}
                      className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1"
                    >
                      <span>Full Activity Page</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {activeAdventure.packages?.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6"
                    >
                      {/* Thumbnail */}
                      <div className="relative w-full md:w-48 aspect-[4/3] md:aspect-auto shrink-0 bg-stone-900 rounded-xl overflow-hidden">
                        <Image
                          src={pkg.image || activeAdventure.heroImage}
                          alt={pkg.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="flex items-center gap-1 text-[11px] font-extrabold text-stone-600 bg-stone-100 px-2.5 py-0.5 rounded-md">
                              <Clock className="w-3.5 h-3.5 text-orange-500" />
                              {pkg.duration}
                            </span>
                            <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              {pkg.rating} ({pkg.reviews})
                            </span>
                          </div>

                          <h4 className="text-lg font-serif font-black text-stone-900 mb-2">
                            {pkg.title}
                          </h4>

                          <p className="text-xs text-stone-600 leading-relaxed mb-4">
                            {pkg.description}
                          </p>

                          {/* Key Inclusions */}
                          <div className="mb-4 pt-3 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {pkg.inclusions?.slice(0, 4).map((inc, i) => (
                              <div key={i} className="flex items-center gap-2 text-[11px] text-stone-700">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                                <span>{inc}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Price & Book Button */}
                        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                          <div>
                            <span className="text-xs text-stone-400 line-through mr-1 font-medium">{pkg.priceOriginal}</span>
                            <span className="text-xl font-black text-stone-900">{pkg.price}</span>
                            <span className="text-[10px] text-stone-500 font-medium"> / person</span>
                          </div>

                          <button
                            onClick={() => handleBookNow(pkg)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange-500/20 transition active:scale-95"
                          >
                            <Ticket className="w-4 h-4" />
                            <span>Book Now</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Instant Booking Form Popup inside Modal */}
                {bookingPackage && (
                  <div className="bg-orange-50 border-2 border-orange-300 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl scroll-mt-6">
                    {!successBooking ? (
                      <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-orange-200">
                          <div>
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-600 block">Instant Reservation</span>
                            <h4 className="text-xl font-serif font-black text-stone-900">
                              Book {bookingPackage.title}
                            </h4>
                          </div>
                          <button
                            type="button"
                            onClick={() => setBookingPackage(null)}
                            className="p-1.5 rounded-full bg-orange-200 text-orange-800 hover:bg-orange-300 transition"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-bold text-stone-700 mb-1 block">Full Name *</label>
                            <div className="flex items-center gap-2 bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs">
                              <User className="w-4 h-4 text-stone-400" />
                              <input
                                type="text"
                                required
                                placeholder="Your Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-transparent outline-none font-semibold text-stone-900"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-xs font-bold text-stone-700 mb-1 block">Phone Number *</label>
                            <div className="flex items-center gap-2 bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs">
                              <Phone className="w-4 h-4 text-stone-400" />
                              <input
                                type="tel"
                                required
                                placeholder="+91 9876543210"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full bg-transparent outline-none font-semibold text-stone-900"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-xs font-bold text-stone-700 mb-1 block">Email Address</label>
                            <div className="flex items-center gap-2 bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs">
                              <Mail className="w-4 h-4 text-stone-400" />
                              <input
                                type="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-transparent outline-none font-semibold text-stone-900"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-xs font-bold text-stone-700 mb-1 block">Preferred Travel Date</label>
                            <div className="flex items-center gap-2 bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs">
                              <Calendar className="w-4 h-4 text-stone-400" />
                              <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full bg-transparent outline-none font-semibold text-stone-900"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 flex items-center justify-between">
                          <div>
                            <span className="text-xs text-stone-500 block font-medium">Total Payable:</span>
                            <span className="text-2xl font-black text-stone-900">{bookingPackage.price}</span>
                          </div>

                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs uppercase tracking-wider shadow-xl shadow-orange-500/30 transition active:scale-95 disabled:opacity-50"
                          >
                            {isSubmitting ? (
                              <span>Processing...</span>
                            ) : (
                              <>
                                <Ticket className="w-4 h-4" />
                                <span>Confirm & Reserve Now</span>
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="text-center py-6 space-y-4">
                        <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                          <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <div>
                          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 block">Booking Confirmed!</span>
                          <h4 className="text-2xl font-serif font-black text-stone-900">
                            {successBooking.packageName}
                          </h4>
                          <p className="text-xs text-stone-600 font-medium mt-1">
                            Booking Reference ID: <strong className="text-stone-900">{successBooking.id}</strong>
                          </p>
                        </div>

                        <div className="bg-white p-4 rounded-2xl border border-emerald-200 max-w-md mx-auto text-left space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-stone-500">Lead Passenger:</span>
                            <strong className="text-stone-900">{successBooking.name}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-stone-500">Travel Date:</span>
                            <strong className="text-stone-900">{successBooking.date}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-stone-500">Package Rate:</span>
                            <strong className="text-emerald-700">{successBooking.price}</strong>
                          </div>
                          <div className="pt-2 border-t border-stone-100 flex items-center gap-1.5 text-[11px] text-emerald-700 font-bold">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            <span>Digital Yatri Travel Pass Verified</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setBookingPackage(null)}
                          className="px-6 py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-stone-800 transition"
                        >
                          Close Reservation Window
                        </button>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
