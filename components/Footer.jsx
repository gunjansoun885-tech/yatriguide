"use client";

import React, { useState } from "react";
import { 
  Compass, 
  Phone, 
  Mail, 
  MapPin, 
  Send
} from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail("");
      setSubscribed(false);
      alert("Subscription successful! Welcome to the Yatriguide Inner Circle.");
    }, 1500);
  };

  const handleScrollTo = (e, id) => {
    e.preventDefault();
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer id="footer" className="bg-stone-50 text-stone-600 font-sans border-t border-orange-100 relative z-10 pt-20 pb-8">
      {/* Footer Top Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-white/5 text-left">
        
        {/* Column 1: Branding */}
        <div className="space-y-6">
          <a
            href="#home"
            onClick={(e) => handleScrollTo(e, "#home")}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <div className="p-2 bg-gradient-to-tr from-gold-500 to-emerald-400 rounded-xl">
              <Compass className="w-5 h-5 text-forest-950" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-black tracking-wider text-stone-800">
                Yatri guide
              </span>
              <span className="text-[10px] uppercase tracking-widest text-orange-600 font-bold -mt-1">
                Devbhoomi Guide
              </span>
            </div>
          </a>
          <p className="text-sm font-light text-stone-600 leading-relaxed">
            Yatri guide is Uttarakhand's premier boutique destination guide. We craft custom itineraries, arrange high-altitude logistics, and manage certified stays in the land of sacred waters and mountain gods.
          </p>
          {/* Social Icons */}
          <div className="flex space-x-4 pt-2">
            <a href="#" className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:text-gold-400 hover:border-gold-500/50 hover:bg-gold-500/5 transition-all duration-300">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
              </svg>
            </a>
            <a href="#" className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:text-gold-400 hover:border-gold-500/50 hover:bg-gold-500/5 transition-all duration-300">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="#" className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:text-gold-400 hover:border-gold-500/50 hover:bg-gold-500/5 transition-all duration-300">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.01 3.71.054 1 .046 1.63.21 2.08.388a4.805 4.805 0 011.66 1.08 4.798 4.798 0 011.08 1.66c.178.45.342 1.08.388 2.08.044.93.054 1.28.054 3.71s-.01 2.784-.054 3.71c-.046 1-.21 1.63-.388 2.08a4.808 4.808 0 01-1.08 1.66 4.8 4.8 0 01-1.66 1.08c-.45.178-1.08.342-2.08.388-.93.044-1.28.054-3.71.054s-2.784-.01-3.71-.054c-1-.046-1.63-.21-2.08-.388a4.807 4.807 0 01-1.66-1.08 4.796 4.796 0 01-1.08-1.66c-.178-.45-.342-1.08-.388-2.08C2.01 14.784 2 14.43 2 12c0-2.43.01-2.784.054-3.71.046-1 .21-1.63.388-2.08a4.808 4.808 0 011.08-1.66 4.8 4.8 0 011.66-1.08c.45-.178 1.08-.342 2.08-.388.93-.044 1.28-.054 3.71-.054zM12 6.865A5.135 5.135 0 1017.135 12 5.135 5.135 0 0012 6.865zm0 8.468A3.333 3.333 0 1115.333 12 3.333 3.333 0 0112 15.333zm5.996-8.302a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:text-gold-400 hover:border-gold-500/50 hover:bg-gold-500/5 transition-all duration-300">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.87.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className="font-serif text-lg font-bold text-stone-800 mb-6">Quick Links</h3>
          <ul className="space-y-3 text-sm font-light">
            {[
              { label: "Home Base", id: "#home" },
              { label: "Sacred Destinations", id: "#destinations" },
              { label: "Adventure Thrills", id: "#adventure" },
              { label: "Postcard Gallery", id: "#gallery" },
              { label: "Testimonials", id: "#testimonials" }
            ].map((link) => (
              <li key={link.label}>
                <a
                  href={link.id}
                  onClick={(e) => handleScrollTo(e, link.id)}
                  className="hover:text-gold-400 hover:translate-x-1 inline-block transition-all duration-300"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Travel Categories */}
        <div>
          <h3 className="font-serif text-lg font-bold text-stone-800 mb-6">Travel Categories</h3>
          <ul className="space-y-3 text-sm font-light">
            <li>
              <a href="#adventure" onClick={(e) => handleScrollTo(e, "#adventure")} className="hover:text-gold-400 hover:translate-x-1 inline-block transition-all duration-300">
                White-Water Rafting Rishikesh
              </a>
            </li>
            <li>
              <a href="#adventure" onClick={(e) => handleScrollTo(e, "#adventure")} className="hover:text-gold-400 hover:translate-x-1 inline-block transition-all duration-300">
                Himalayan Ski Trips in Auli
              </a>
            </li>
            <li>
              <a href="#adventure" onClick={(e) => handleScrollTo(e, "#adventure")} className="hover:text-gold-400 hover:translate-x-1 inline-block transition-all duration-300">
                Wildlife Tiger Safaris
              </a>
            </li>
            <li>
              <a href="#destinations" onClick={(e) => handleScrollTo(e, "#destinations")} className="hover:text-gold-400 hover:translate-x-1 inline-block transition-all duration-300">
                Serene Hill Station Escapes
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: Contact & Support */}
        <div className="space-y-4 text-sm font-light">
          <h3 className="font-serif text-lg font-bold text-stone-800 mb-2">Devbhoomi HQ</h3>
          
          <div className="flex items-start space-x-3">
            <MapPin className="w-4 h-4 text-emerald-400 mt-1 shrink-0" />
            <span>
              siddheshwar vihar,niliyam calony <br />
             Haldwani Uttarakhand - 263139, India
            </span>
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
            <a href="tel:+9719XXXXXXXX" className="hover:text-gold-400 transition-colors">
              +91-9719813241
            </a>
          </div>

          <div className="flex items-center space-x-3">
            <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
            <a href="mailto:guide@yatriguide.com" className="hover:text-gold-400 transition-colors">
              guide@yatriguide.com
            </a>
          </div>

          {/* Newsletter Input Area */}
          <div className="pt-4 border-t border-white/5">
            <h4 className="text-xs font-bold text-black uppercase tracking-wider mb-3">Newsletter</h4>
            <form onSubmit={handleSubscribe} className="flex max-w-full">
              <input
                type="email"
                required
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 min-w-0 px-3 py-2 bg-stone-900 border border-white/10 rounded-l-lg text-xs text-black placeholder-black/40 focus:outline-none focus:border-gold-500 font-sans"
              />
              <button
                type="submit"
                disabled={subscribed}
                className="px-4 bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-600 hover:to-amber-600 text-forest-950 font-bold rounded-r-lg flex items-center justify-center transition-all cursor-pointer"
                aria-label="Subscribe"
              >
                {subscribed ? (
                  <div className="w-4 h-4 border-2 border-forest-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
              </button>
            </form>
          </div>
        </div>

      </div>

      {/* Footer Bottom copyright Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 space-y-4 sm:space-y-0">
        <span>
          © {new Date().getFullYear()} Yatriguide Guide. All rights reserved. Made in Uttarakhand.
        </span>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-gold-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-gold-400 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-gold-400 transition-colors">Sitemap</a>
        </div>
      </div>
    </footer>
  );
}
