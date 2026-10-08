import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

import pceaLogo from "@/images/pcealogo.png";

const NAV_LINKS = [
  { label: "About", href: "/about" },
  { label: "Connect", href: "/connect" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-[#faf8f5]/95 backdrop-blur-md border-b border-[#e8e4dc] shadow-[0_1px_12px_rgba(0,0,0,0.03)]"
          : "bg-[#faf8f5] border-b border-[#e8e4dc]/70"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo (Image only, no text) */}
          <Link to="/" className="flex items-center group py-2">
            <img
              src={pceaLogo}
              alt="PCEA Logo"
              className="h-14 md:h-16 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10">
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-xs font-mono uppercase tracking-[0.18em] transition-colors relative py-1 ${
                    isActive
                      ? "text-[#1c1b18] font-medium"
                      : "text-[#69665e] hover:text-[#1c1b18]"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#1c1b18]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Primary Action Button */}
          <div className="hidden md:flex items-center">
            <Link
              to="/contact"
              className="inline-flex items-center px-5 py-2.5 bg-[#1c1b18] text-[#faf8f5] text-xs font-mono uppercase tracking-[0.16em] hover:bg-[#383631] transition-colors"
              style={{ borderRadius: "2px" }}
            >
              Plan a Visit
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-[#1c1b18] focus:outline-none"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#e8e4dc] bg-[#faf8f5] px-6 py-6 space-y-4">
          <nav className="flex flex-col space-y-3">
            <Link
              to="/"
              className={`text-xs font-mono uppercase tracking-wider py-2 border-b border-[#e8e4dc] ${
                location.pathname === "/" ? "font-bold text-[#1c1b18]" : "text-[#69665e]"
              }`}
            >
              Home
            </Link>
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-xs font-mono uppercase tracking-wider py-2 border-b border-[#e8e4dc] flex items-center justify-between ${
                    isActive ? "font-bold text-[#1c1b18]" : "text-[#69665e]"
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#781d19]" />}
                </Link>
              );
            })}
          </nav>

          <div className="pt-2">
            <Link
              to="/contact"
              className="block w-full text-center py-3 bg-[#1c1b18] text-[#faf8f5] text-xs font-mono uppercase tracking-widest"
              style={{ borderRadius: "2px" }}
            >
              Plan a Visit
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
