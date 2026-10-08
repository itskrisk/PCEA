import React, { useState } from "react";
import { MotionSection } from "@/components/MotionSection";

/* ─── Form State ─────────────────────────────────────────────── */
interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

type SubmitState = "idle" | "sending" | "success" | "error";

/* ─── Page Component ─────────────────────────────────────────── */
import { submitContactMessage } from "@/lib/supabase";

export function ContactPage() {
  const [form, setForm] = useState<FormData>({ name: "", email: "", subject: "visiting", message: "" });
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmitState("sending");
    const res = await submitContactMessage(form);
    if (res.success) {
      setSubmitState("success");
    } else {
      setSubmitState("idle");
    }
  };

  const inputBase =
    "w-full px-4 py-3.5 text-sm border border-[#e8e4dc] bg-white text-[#1c1b18] placeholder-[#8a877e] focus:outline-none focus:border-[#1c1b18] transition-colors";
  const labelBase = "block text-[10px] font-mono uppercase tracking-widest text-[#8a877e] mb-2";

  return (
    <div className="w-full">

      {/* ── PAGE HEADER BANNER ────────────────────────────────────── */}
      <MotionSection className="w-full">
        <div className="relative overflow-hidden min-h-[420px] flex flex-col justify-end">
          <img
            src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1800&q=85"
            alt="Church community gathering"
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141311]/88 via-[#141311]/40 to-transparent" />
          <div className="relative z-10 max-w-7xl mx-auto w-full px-6 lg:px-12 pb-16 lg:pb-20">
            <div className="max-w-2xl space-y-4">
              <p className="text-xs font-mono uppercase tracking-[0.25em] text-[#e0b868]">Contact</p>
              <h1 className="font-serif text-5xl lg:text-6xl text-white font-normal leading-[1.03]">
                We are real people.<br className="hidden sm:block" /> Not a voicemail.
              </h1>
              <p className="text-[#ddd9d1] text-base leading-relaxed font-serif">
                Whether you have a question, a need, or simply want to find out what
                Sunday morning looks like here, someone will read your message and
                write back. We promise.
              </p>
            </div>
          </div>
        </div>
      </MotionSection>

      {/* ── MAIN CONTENT GRID ─────────────────────────────────────── */}
      <MotionSection className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

          {/* ─ LEFT: Contact Info ─ */}
          <div className="lg:col-span-4 space-y-12">

            {/* Parish Address */}
            <div className="space-y-4">
              <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#8a877e]">Find Us</p>
              <div className="space-y-1">
                <p className="font-serif text-xl text-[#1c1b18]">PCEA Kileleshwa</p>
                <p className="text-sm text-[#57554f] leading-relaxed">
                  Kileleshwa Road<br />
                  Kileleshwa, Nairobi<br />
                  Kenya
                </p>
              </div>
              <div className="h-px bg-[#e8e4dc]" />
            </div>

            {/* Service Times */}
            <div className="space-y-4">
              <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#8a877e]">Sunday Services</p>
              <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <p className="font-serif text-[#1c1b18]">First Service</p>
                  <p className="text-xs font-mono text-[#57554f]">08:30 AM EAT</p>
                </div>
                <div className="h-px bg-[#f0ece4]" />
                <div className="flex justify-between items-baseline">
                  <p className="font-serif text-[#1c1b18]">Second Service</p>
                  <p className="text-xs font-mono text-[#57554f]">10:45 AM EAT</p>
                </div>
                <div className="h-px bg-[#f0ece4]" />
                <div className="flex justify-between items-baseline">
                  <p className="font-serif text-[#1c1b18]">Church School</p>
                  <p className="text-xs font-mono text-[#57554f]">During 2nd Service</p>
                </div>
              </div>
              <div className="h-px bg-[#e8e4dc]" />
            </div>

            {/* Secretariat */}
            <div className="space-y-4">
              <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#8a877e]">Parish Secretariat</p>
              <div className="space-y-3 text-sm text-[#57554f]">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-[#b5b0a7] mb-0.5">Office Hours</p>
                  <p>Monday to Friday, 08:00 – 17:00 EAT</p>
                </div>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-[#b5b0a7] mb-0.5">Telephone</p>
                  <a href="tel:+254700000000" className="hover:text-[#1c1b18] transition-colors">+254 700 000 000</a>
                </div>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-[#b5b0a7] mb-0.5">Email</p>
                  <a href="mailto:secretary@pceakileleshwa.or.ke" className="hover:text-[#1c1b18] transition-colors break-all">
                    secretary@pceakileleshwa.or.ke
                  </a>
                </div>
              </div>
              <div className="h-px bg-[#e8e4dc]" />
            </div>

            {/* Pastoral Reception */}
            <div className="editorial-sand p-7 space-y-3">
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8a877e]">Pastoral Reception</p>
              <p className="font-serif text-lg text-[#1c1b18] leading-snug">
                For matters requiring a pastor's attention.
              </p>
              <p className="text-xs text-[#57554f] leading-[1.75]">
                The minister is available for pastoral appointments on Tuesdays and Thursdays
                by prior arrangement. For urgent matters, contact the secretariat and a member
                of the Kirk Session will respond within 24 hours.
              </p>
            </div>

            {/* Visitor Notes */}
            <div className="space-y-4">
              <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#8a877e]">First-Time Visitor Notes</p>
              <div className="space-y-5 text-sm text-[#57554f]">
                <div>
                  <p className="font-medium text-[#1c1b18] mb-0.5">Parking</p>
                  <p className="text-xs leading-relaxed">Available within the compound and along the service road. Ushers assist on busy Sundays.</p>
                </div>
                <div>
                  <p className="font-medium text-[#1c1b18] mb-0.5">Creche & Nursery</p>
                  <p className="text-xs leading-relaxed">Staffed and available during both services for children under 4.</p>
                </div>
                <div>
                  <p className="font-medium text-[#1c1b18] mb-0.5">What to Bring</p>
                  <p className="text-xs leading-relaxed">Only yourself. Bibles and service sheets are available at the door.</p>
                </div>
              </div>
            </div>
          </div>

          {/* ─ RIGHT: Contact Form ─ */}
          <div className="lg:col-span-8">
            <div className="editorial-card p-8 sm:p-12">

              {submitState === "success" ? (
                <div className="py-16 text-center space-y-5">
                  <div className="w-16 h-16 mx-auto bg-[#2b4c38]/10 flex items-center justify-center" style={{ borderRadius: "50%" }}>
                    <svg className="w-8 h-8 text-[#2b4c38]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <h3 className="font-serif text-3xl text-[#1c1b18]">Your message is on its way.</h3>
                  <p className="text-[#57554f] text-sm leading-relaxed max-w-md mx-auto">
                    Thank you for writing to us. A member of our team will respond within
                    one working day. If this is urgent, please call the secretariat directly.
                  </p>
                  <button
                    onClick={() => { setSubmitState("idle"); setForm({ name: "", email: "", subject: "", message: "" }); }}
                    className="mt-4 text-xs font-mono uppercase tracking-widest text-[#8a877e] underline underline-offset-4 hover:text-[#1c1b18] transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-7">
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8a877e] mb-1">Write to Us</p>
                    <h2 className="font-serif text-3xl sm:text-4xl text-[#1c1b18] leading-[1.1]">
                      Send a message.
                    </h2>
                    <p className="text-sm text-[#57554f] mt-3 leading-relaxed">
                      Questions about visiting, membership, pastoral support, event inquiries,
                      or simply wanting to say hello: all of it is welcome here.
                    </p>
                  </div>

                  <div className="h-px bg-[#e8e4dc]" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className={labelBase}>Full Name</label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        placeholder="Your name"
                        value={form.name}
                        onChange={handleChange}
                        className={inputBase}
                        style={{ borderRadius: "2px" }}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className={labelBase}>Email Address</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="your@email.com"
                        value={form.email}
                        onChange={handleChange}
                        className={inputBase}
                        style={{ borderRadius: "2px" }}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className={labelBase}>Subject</label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={form.subject}
                      onChange={handleChange}
                      className={inputBase}
                      style={{ borderRadius: "2px" }}
                    >
                      <option value="" disabled>Select a subject</option>
                      <option value="visiting">Planning to Visit</option>
                      <option value="membership">Membership Inquiry</option>
                      <option value="pastoral">Pastoral Support</option>
                      <option value="events">Events & Programmes</option>
                      <option value="giving">Giving & Stewardship</option>
                      <option value="other">General Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className={labelBase}>Your Message</label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={7}
                      placeholder="Write your message here. Be as detailed as you like."
                      value={form.message}
                      onChange={handleChange}
                      className={inputBase + " resize-none"}
                      style={{ borderRadius: "2px" }}
                    />
                  </div>

                  <div className="flex items-center gap-6 pt-2">
                    <button
                      type="submit"
                      disabled={submitState === "sending"}
                      className="px-8 py-4 bg-[#1c1b18] text-white text-xs font-mono uppercase tracking-widest hover:bg-[#333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ borderRadius: "2px" }}
                    >
                      {submitState === "sending" ? "Sending..." : "Send Message"}
                    </button>
                    <p className="text-[10px] font-mono text-[#b5b0a7] leading-relaxed">
                      We respond within one working day.
                    </p>
                  </div>
                </form>
              )}
            </div>

            {/* Map block */}
            <div className="mt-8 editorial-card overflow-hidden">
              <div className="relative bg-[#f3efe6] border-b border-[#e8e4dc]" style={{ height: "280px" }}>
                {/* Static architectural map stand-in */}
                <iframe
                  title="PCEA Kileleshwa location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.7838064939!2d36.7773!3d-1.2809!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f17e4a3e3e3e3%3A0x0!2sKileleshwa%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1700000000000"
                  className="w-full h-full"
                  style={{ border: 0, filter: "grayscale(100%) contrast(1.1)" }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="font-serif text-[#1c1b18]">Kileleshwa Road, Nairobi</p>
                  <p className="text-xs font-mono text-[#8a877e] mt-0.5">Off Argwings Kodhek Road</p>
                </div>
                <a
                  href="https://maps.google.com/?q=Kileleshwa,Nairobi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono uppercase tracking-widest text-[#1c1b18] underline underline-offset-4 hover:text-[#781d19] transition-colors shrink-0"
                >
                  Open in Maps
                </a>
              </div>
            </div>
          </div>

        </div>
      </MotionSection>

      {/* ── CLOSING STATEMENT ─────────────────────────────────────── */}
      <MotionSection className="w-full bg-[#1c1b18]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <p className="text-xs font-mono uppercase tracking-[0.25em] text-[#8a877e]">You Are Welcome Here</p>
              <h2 className="font-serif text-4xl lg:text-5xl text-[#faf8f5] leading-[1.08]">
                The doors open<br />every Sunday morning.
              </h2>
            </div>
            <div className="space-y-4 text-[#a09b90] text-sm leading-[1.85]">
              <p>
                You do not need to have it together. You do not need to know the liturgy
                or understand Reformed theology or have been raised in church. You need
                only to walk through the door. Everything else follows in its own time.
              </p>
              <p>
                First service begins at 08:30. Second at 10:45. Both are complete,
                substantive, and identical in content. Sit wherever you like.
              </p>
            </div>
          </div>
        </div>
      </MotionSection>

    </div>
  );
}
