import React, { useState } from "react";
import { Link } from "react-router-dom";
import { submitNewsletter } from "@/lib/supabase";
import { Check, MapPin, Mail, Phone } from "lucide-react";
import pceaLogo from "@/images/pcealogo.png";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    const res = await submitNewsletter({ email });
    setSubmitting(false);
    if (res.success) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="w-full bg-[#1a1918] text-white mt-auto">
      {/* Main footer content */}
      <div className="max-w-6xl mx-auto px-6 lg:px-12 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">

          {/* Column 1 — Identity */}
          <div className="space-y-5">
            <Link to="/" className="inline-block">
              <img
                src={pceaLogo}
                alt="PCEA Kileleshwa"
                className="h-16 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-[#b5b2ac] text-base leading-relaxed">
              A Presbyterian church family in Nairobi, rooted in biblical
              truth, Reformed worship, and community life.
            </p>
            <div className="space-y-2 text-[#b5b2ac] text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-[#c2902b]" />
                <span>Mandera Road, Kileleshwa, Nairobi</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0 text-[#c2902b]" />
                <span>secretary@pceakileleshwa.or.ke</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0 text-[#c2902b]" />
                <span>+254 700 000 000</span>
              </div>
            </div>
          </div>

          {/* Column 2 — Service Times */}
          <div className="space-y-5">
            <h3 className="text-white font-semibold text-base uppercase tracking-wide">
              Sunday Services
            </h3>
            <ul className="space-y-4">
              {[
                { name: "First Service", time: "8:30 AM" },
                { name: "Second Service", time: "10:45 AM" },
                { name: "Church School & Teens", time: "Concurrent" },
                { name: "Tuesday Prayer", time: "Tue 6:00 PM" },
                { name: "Wednesday Bible Study", time: "Wed 6:00 PM" },
              ].map((item) => (
                <li
                  key={item.name}
                  className="flex justify-between items-center border-b border-white/10 pb-3"
                >
                  <span className="text-[#b5b2ac] text-sm">{item.name}</span>
                  <span className="text-white font-medium text-sm">{item.time}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Links & Newsletter */}
          <div className="space-y-5">
            <h3 className="text-white font-semibold text-base uppercase tracking-wide">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { label: "Home", href: "/" },
                { label: "About & History", href: "/about" },
                { label: "Connect", href: "/connect" },
                { label: "Prayer Requests", href: "/connect?tab=prayer" },
                { label: "Giving", href: "/connect?tab=giving" },
                { label: "Gallery", href: "/gallery" },
                { label: "Contact Us", href: "/contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-[#b5b2ac] text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Newsletter */}
            <div className="pt-4 border-t border-white/10">
              <p className="text-white text-sm font-medium mb-3">
                Get our weekly bulletin
              </p>
              {subscribed ? (
                <div className="flex items-center gap-2 text-sm text-[#2b4c38] bg-[#d4f0e0] rounded-lg px-4 py-3">
                  <Check className="w-4 h-4" />
                  <span>You're subscribed!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 text-sm rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/60 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full px-4 py-3 bg-[#781d19] text-white text-sm font-medium rounded-lg hover:bg-[#9a2520] transition-colors disabled:opacity-50"
                  >
                    {submitting ? "Subscribing…" : "Subscribe"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 lg:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[#6b6864] text-sm">
          <span>© {new Date().getFullYear()} PCEA Kileleshwa. All rights reserved.</span>
          <span>Presbyterian Church of East Africa · Nairobi Presbytery</span>
        </div>
      </div>
    </footer>
  );
}
