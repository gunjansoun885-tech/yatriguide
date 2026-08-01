"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, Menu, X, Search, Phone, Calendar } from "lucide-react";

const MENU_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Destinations", href: "#destinations" },
  { label: "Adventure", href: "#adventure" },
  { label: "Char Dham", href: "#packages" }, // links to packages
  { label: "Travel Guide", href: "#about" }, 
  { label: "Gallery", href: "#gallery" },
  { label: "Hotels", href: "#footer" },
  { label: "Contact", href: "/contact" }
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollTo = (e, href) => {
    if (!href.startsWith("#")) {
      return;
    }
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleOpenRegistrationModal = (e) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    window.location.href = "/contact";
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md py-3 shadow-lg border-b border-orange-200/80"
            : "bg-gradient-to-b from-stone-100/80 to-transparent py-4 sm:py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8">
          <div className="flex items-center justify-between gap-2">
            {/* Logo */}
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = "/";
              }}
              className="flex items-center space-x-2 group focus:outline-none min-w-0"
            >
              <motion.div
                whileHover={{ rotate: 15 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="p-2 bg-gradient-to-tr from-gold-500 to-emerald-400 rounded-xl shrink-0"
              >
                <Compass className="w-5 h-5 sm:w-6 sm:h-6 text-forest-950" />
              </motion.div>
              <div className="flex flex-col min-w-0">
                <span className="font-serif text-lg sm:text-xl lg:text-2xl font-black tracking-wider text-stone-800 group-hover:text-orange-500 transition-colors whitespace-nowrap">
                  Yatri guide
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-orange-600 font-bold -mt-1 font-sans whitespace-nowrap">
                  Devbhoomi Guide
                </span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
              {MENU_ITEMS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    if (item.label === "Home") {
                      e.preventDefault();
                      window.location.href = "/";
                    } else {
                      handleScrollTo(e, item.href);
                    }
                  }}
                  className="font-sans text-sm font-semibold text-stone-700 hover:text-orange-500 transition-colors duration-300 relative py-2 group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold-400 transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </nav>

            {/* CTA & Actions */}
            <div className="hidden lg:flex items-center space-x-3">
              {/* Search Toggle */}
              <div className="relative">
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-2 text-stone-700 hover:text-orange-500 transition-colors focus:outline-none"
                  aria-label="Toggle Search"
                >
                  <Search className="w-5 h-5" />
                </button>
                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 mt-2 w-64 bg-white/95 border border-orange-200 rounded-lg p-2 shadow-xl backdrop-blur-md"
                    >
                      <input
                        type="text"
                        placeholder="Search sacred destinations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-3 py-1.5 bg-stone-50 text-stone-800 placeholder-stone-400 text-sm border border-orange-200 rounded focus:outline-none focus:border-orange-500 font-sans"
                        autoFocus
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Plan Your Trip CTA */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => handleScrollTo(e, "#packages")}
                className="flex items-center space-x-2 px-5 py-2.5 bg-white/90 border border-orange-200 text-orange-700 font-sans font-bold text-sm rounded-full shadow-sm hover:bg-orange-50 transition-all duration-300"
              >
                <Calendar className="w-4 h-4" />
                <span>Plan Your Trip</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOpenRegistrationModal}
                className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-sans font-bold text-sm rounded-full shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all duration-300"
              >
                <Calendar className="w-4 h-4" />
                <span>Registration</span>
              </motion.button>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex md:hidden items-center space-x-2">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-stone-700 hover:text-orange-500 transition-colors focus:outline-none sm:hidden"
                aria-label="Toggle Search"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-stone-700 hover:text-orange-500 focus:outline-none"
                aria-label="Toggle Mobile Menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Full Screen Search overlay */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden w-full bg-forest-950 border-t border-white/10 px-4 py-3 sm:hidden"
            >
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-forest-900 text-white border border-emerald-800 rounded font-sans text-sm focus:outline-none"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/75 z-40 backdrop-blur-sm lg:hidden"
            />

            {/* Menu Container */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
              className="fixed right-0 top-0 bottom-0 w-80 max-w-full bg-stone-950/95 text-stone-100 z-50 p-6 flex flex-col justify-between border-l border-orange-200/30 shadow-2xl backdrop-blur-xl md:hidden"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-white/10">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-gradient-to-tr from-gold-500 to-emerald-400 rounded-xl shrink-0">
                      <Compass className="w-5 h-5 text-forest-950" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-serif text-xl font-black tracking-wider text-white">
                        Yatri guide
                      </span>
                      <span className="text-[10px] uppercase tracking-[0.25em] text-orange-300 font-bold -mt-1 font-sans">
                        Devbhoomi Guide
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1 rounded-full border border-white/10 text-white hover:text-orange-400 focus:outline-none"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="flex flex-col space-y-4 mt-8">
                  {MENU_ITEMS.map((item, idx) => (
                    <motion.a
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      key={item.label}
                      href={item.href}
                      onClick={(e) => handleScrollTo(e, item.href)}
                      className="font-sans text-lg font-medium py-2 text-orange-400 hover:text-amber-300 transition-colors border-b border-white/5"
                    >
                      {item.label}
                    </motion.a>
                  ))}
                </nav>
              </div>

              <div className="pt-6 border-t border-white/10 space-y-4">
                <a
                  href="tel:+91800XXXXXXX"
                  className="flex items-center space-x-2 text-sm text-emerald-300 font-semibold"
                >
                  <Phone className="w-4 h-4" />
                  <span>Helpline: +91-800-UTTARA</span>
                </a>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => handleScrollTo(e, "#packages")}
                  className="w-full text-center py-3 bg-gradient-to-r from-gold-500 to-amber-500 text-forest-950 font-sans font-bold rounded-lg shadow-lg hover:brightness-110"
                >
                  Plan Your Trip
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
