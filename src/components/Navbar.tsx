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
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        scrolled
          ? "bg-[#faf8f5]/95 backdrop-blur-md border-b border-[#e8e4dc] shadow-[0_2px_10px_rgba(0,0,0,0.04)]"
          : "bg-[#faf8f5] border-b border-[#e8e4dc]"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo (Image only, clean and crisp) */}
          <Link to="/" className="flex items-center py-2" aria-label="PCEA Kileleshwa Home">
            <img
              src={pceaLogo}
              alt="PCEA Kileleshwa Logo"
              className="h-14 md:h-16 w-auto object-contain transition-transform duration-150 hover:opacity-95"
            />
          </Link>

          {/* Desktop Navigation — Clear, friendly, Apple-like sans typography */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10">
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-base font-medium transition-colors relative py-1.5 ${
                    isActive
                      ? "text-[#1a1918]"
                      : "text-[#55524c] hover:text-[#1a1918]"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#781d19] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Primary Action Button — High contrast, rounded, readable */}
          <div className="hidden md:flex items-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-6 py-2.5 bg-[#1a1918] text-white text-sm font-semibold rounded-full hover:bg-[#33312e] transition-colors shadow-sm"
            >
              Plan a Visit
            </Link>
          </div>

          {/* Mobile Menu Button — Large, accessible tap target */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-3 text-[#1a1918] hover:bg-[#e8e4dc]/50 rounded-lg focus:outline-none"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer — Large friendly links for everyone including the elderly */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#e8e4dc] bg-[#faf8f5] px-6 py-6 space-y-4 shadow-lg">
          <nav className="flex flex-col space-y-2">
            <Link
              to="/"
              className={`text-lg font-medium py-3 border-b border-[#e8e4dc] ${
                location.pathname === "/" ? "font-bold text-[#1a1918]" : "text-[#55524c]"
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
                  className={`text-lg font-medium py-3 border-b border-[#e8e4dc] flex items-center justify-between ${
                    isActive ? "font-bold text-[#1a1918]" : "text-[#55524c]"
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-[#781d19]" />}
                </Link>
              );
            })}
          </nav>

          <div className="pt-3">
            <Link
              to="/contact"
              className="block w-full text-center py-3.5 bg-[#1a1918] text-white text-base font-semibold rounded-full shadow-sm"
            >
              Plan a Visit
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
