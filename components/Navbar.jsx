"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, Menu, X, Search, Phone, Calendar, User, LockKeyhole } from "lucide-react";
import LoginModal from "@/components/LoginModal";

const MENU_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Destinations", href: "#destinations" },
  { label: "Adventure", href: "#adventure" },
  { label: "Char Dham", href: "#packages" },
  { label: "Travel Guide", href: "#about" }, 
  { label: "Gallery", href: "#gallery" },
  { label: "Hotels", href: "#footer" },
  { label: "Contact", href: "/contact" }
];

export default function Navbar() {
  const pathname = usePathname();
  const isPassPage = pathname?.startsWith("/pass") || pathname?.startsWith("/qr-result");

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

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
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform shrink-0">
                <Compass className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-stone-900 leading-none truncate">
                  Yatri guide
                </span>
                <span className="text-[9px] sm:text-[10px] font-sans tracking-[0.15em] sm:tracking-[0.2em] text-orange-600 font-bold uppercase mt-0.5">
                  Devbhoomi Guide
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1 border border-stone-200/60 bg-white/70 backdrop-blur-md px-4 py-1.5 rounded-full shadow-xs">
              {MENU_ITEMS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleScrollTo(e, item.href)}
                  className="font-sans text-xs font-semibold px-3 py-1.5 rounded-full text-stone-700 hover:text-orange-600 hover:bg-orange-50/80 transition-all duration-200"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Action Buttons (Desktop) */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Search Toggle */}
              <div className="relative">
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-2.5 rounded-full bg-white/80 border border-stone-200 text-stone-700 hover:text-orange-600 hover:border-orange-300 transition-all duration-300 shadow-xs cursor-pointer"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4" />
                </button>

                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute right-0 mt-2 w-72 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-orange-200 p-2 z-50"
                    >
                      <input
                        type="text"
                        placeholder="Search destinations, treks, activities..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-sans text-xs text-stone-800 focus:outline-none focus:border-orange-500"
                        autoFocus
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Login ID Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsLoginModalOpen(true)}
                className="flex items-center space-x-1.5 px-4 py-2.5 bg-stone-900 hover:bg-black border border-stone-800 text-white font-sans font-bold text-xs sm:text-sm rounded-full shadow-sm transition-all duration-300 cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-orange-400" />
                <span>Login ID</span>
              </motion.button>

              {/* Plan Your Trip CTA */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => handleScrollTo(e, "#packages")}
                className="flex items-center space-x-2 px-4 py-2.5 bg-white/90 border border-orange-200 text-orange-700 font-sans font-bold text-xs sm:text-sm rounded-full shadow-sm hover:bg-orange-50 transition-all duration-300 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Plan Your Trip</span>
              </motion.button>

              {/* Blinking & Pulsing Desktop Registration Button */}
              {!isPassPage && (
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    scale: [1, 1.05, 1],
                    boxShadow: [
                      "0 0 0 0 rgba(249, 115, 22, 0.7)",
                      "0 0 0 10px rgba(249, 115, 22, 0)",
                      "0 0 0 0 rgba(249, 115, 22, 0)",
                    ],
                  }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                  onClick={handleOpenRegistrationModal}
                  className="relative flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-sans font-bold text-sm rounded-full shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300 cursor-pointer"
                >
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-90"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                  </span>
                  <Calendar className="w-4 h-4" />
                  <span>Registration</span>
                </motion.button>
              )}
            </div>

            {/* Mobile Header: Sticky Login ID + Blinking Registration Button & Menu */}
            <div className="flex md:hidden items-center space-x-1.5">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsLoginModalOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-stone-900 text-white font-sans font-bold text-xs rounded-full shadow-xs border border-stone-700 touch-manipulation cursor-pointer"
              >
                <User className="w-3 h-3 text-orange-400" />
                <span>Login ID</span>
              </motion.button>

              {!isPassPage && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    scale: [1, 1.06, 1],
                    boxShadow: [
                      "0 0 0 0 rgba(249, 115, 22, 0.7)",
                      "0 0 0 8px rgba(249, 115, 22, 0)",
                      "0 0 0 0 rgba(249, 115, 22, 0)",
                    ],
                  }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                  onClick={handleOpenRegistrationModal}
                  className="relative inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-sans font-extrabold text-xs rounded-full shadow-md shadow-orange-500/30 touch-manipulation cursor-pointer"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-90"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                  </span>
                  <span>Registration</span>
                </motion.button>
              )}

              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-1.5 text-stone-700 hover:text-orange-500 transition-colors focus:outline-none sm:hidden"
                aria-label="Toggle Search"
              >
                <Search className="w-4.5 h-4.5" />
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-1.5 text-stone-700 hover:text-orange-500 focus:outline-none"
                aria-label="Toggle Mobile Menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
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
              className="lg:hidden w-full bg-stone-900 border-t border-white/10 px-4 py-3 sm:hidden"
            >
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-stone-800 text-white border border-stone-700 rounded-xl font-sans text-xs focus:outline-none"
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
                    <div className="p-2 bg-gradient-to-tr from-orange-500 to-amber-400 rounded-xl shrink-0">
                      <Compass className="w-5 h-5 text-white" />
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

              <div className="pt-6 border-t border-white/10 space-y-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsLoginModalOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-stone-800 hover:bg-stone-700 text-white font-sans font-bold rounded-xl border border-stone-700 transition"
                >
                  <User className="w-4 h-4 text-orange-400" />
                  <span>Login ID</span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleOpenRegistrationModal}
                  className="w-full text-center py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-sans font-bold rounded-xl shadow-lg hover:brightness-110"
                >
                  Registration
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => handleScrollTo(e, "#packages")}
                  className="w-full text-center py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-sans font-bold rounded-xl shadow-lg hover:brightness-110"
                >
                  Plan Your Trip
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* User / Owner Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
}
