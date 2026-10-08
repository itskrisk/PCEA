import React, { useState } from "react";
import { Link } from "react-router-dom";
import { submitNewsletter } from "@/lib/supabase";
import { Check } from "lucide-react";
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
    <footer className="w-full bg-[#fbfbf9] text-[#121212] mt-auto border-t border-[#eae8e2]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 md:py-24">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">
          {/* Col 1: Identity & Newsletter */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/" className="inline-block mb-1">
              <img
                src={pceaLogo}
                alt="PCEA Logo"
                className="h-16 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-[#575754] max-w-sm leading-relaxed font-serif">
              A parish of the Presbyterian Church of East Africa situated in
              Nairobi, Kenya. Established on Reformed biblical heritage, Christ-centered
              discipleship, and compassionate community service.
            </p>

            {/* Newsletter Signup (Form 7) */}
            <div className="pt-2 max-w-sm">
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#781d19] font-medium mb-1.5">
                Parish Announcements
              </p>
              {subscribed ? (
                <div className="flex items-center gap-2 text-xs font-mono text-[#2b4c38] py-2">
                  <Check className="w-4 h-4" />
                  <span>Subscribed to weekly bulletin</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs border border-[#e8e4dc] bg-white text-[#1c1b18] placeholder-[#8a877e] focus:outline-none focus:border-[#1c1b18]"
                    style={{ borderRadius: "2px" }}
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-[#1c1b18] text-white text-[10px] font-mono uppercase tracking-widest hover:bg-[#333] transition-colors disabled:opacity-50"
                    style={{ borderRadius: "2px" }}
                  >
                    {submitting ? "..." : "Join"}
                  </button>
                </form>
              )}
            </div>

            <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#8c8b85] pt-2">
              Nairobi Presbytery &bull; Chartered Parish
            </div>
          </div>

          {/* Col 2: Gathering Times */}
          <div className="md:col-span-4 space-y-3">
            <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#8c8b85]">
              Gatherings
            </div>
            <ul className="space-y-2.5 text-xs font-mono text-[#575754]">
              <li className="flex justify-between border-b border-[#eae8e2] pb-1.5">
                <span>First Service (English)</span>
                <span className="text-[#121212] font-semibold">08:30 EAT</span>
              </li>
              <li className="flex justify-between border-b border-[#eae8e2] pb-1.5">
                <span>Second Service (English)</span>
                <span className="text-[#121212] font-semibold">10:45 EAT</span>
              </li>
              <li className="flex justify-between border-b border-[#eae8e2] pb-1.5">
                <span>Church School &amp; Teens</span>
                <span className="text-[#121212] font-semibold">Concurrent</span>
              </li>
              <li className="flex justify-between border-b border-[#eae8e2] pb-1.5">
                <span>Tuesday Prayer Cell</span>
                <span className="text-[#121212] font-semibold">Tue 18:00</span>
              </li>
              <li className="flex justify-between pb-1.5">
                <span>Midweek Bible Study</span>
                <span className="text-[#121212] font-semibold">Wed 18:00</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Directory & Action Hub */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#8c8b85]">
              Directory &amp; Connect
            </div>
            <ul className="space-y-2 text-xs font-mono uppercase tracking-wider">
              <li>
                <Link to="/" className="text-[#575754] hover:text-[#121212] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-[#575754] hover:text-[#121212] transition-colors">
                  About &amp; History
                </Link>
              </li>
              <li>
                <Link to="/connect" className="text-[#575754] hover:text-[#121212] transition-colors">
                  Connect &amp; Participate
                </Link>
              </li>
              <li>
                <Link to="/connect?tab=prayer" className="text-[#781d19] font-medium hover:underline transition-colors">
                  Prayer Requests
                </Link>
              </li>
              <li>
                <Link to="/connect?tab=giving" className="text-[#575754] hover:text-[#121212] transition-colors">
                  Stewardship &amp; Giving
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-[#575754] hover:text-[#121212] transition-colors">
                  Photographic Archive
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-[#575754] hover:text-[#121212] transition-colors">
                  Location &amp; Inquiries
                </Link>
              </li>
            </ul>

            <div className="pt-4 space-y-1 text-xs font-mono text-[#8c8b85]">
              <div>Mandera Road, Kileleshwa, Nairobi</div>
              <div>secretary@pceakileleshwa.or.ke</div>
              <div>+254 700 000 000</div>
            </div>
          </div>
        </div>

        {/* Bottom Colophon */}
        <div className="mt-16 pt-8 border-t border-[#eae8e2] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-widest text-[#8c8b85]">
          <div>
            &copy; {new Date().getFullYear()} PCEA Kileleshwa. All rights reserved.
          </div>
          <div className="flex items-center space-x-4">
            <span>Presbyterian Church of East Africa</span>
            <span>&bull;</span>
            <span>Nairobi Presbytery</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
