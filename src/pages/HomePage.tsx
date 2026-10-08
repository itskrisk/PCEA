import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { MotionSection } from "@/components/MotionSection";

export function HomePage() {
  return (
    <div className="w-full space-y-20 md:space-y-32 py-8 md:py-12">
      {/* 1. CINEMATIC HERO BANNER — Centered */}
      <MotionSection className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="relative rounded-3xl overflow-hidden border border-[#e8e4dc] min-h-[640px] lg:min-h-[720px] flex flex-col items-center justify-center text-center p-8 sm:p-14 lg:p-24">
          {/* Background Photography */}
          <img
            src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1800&q=85"
            alt="Warm morning sunlight streaming across the church sanctuary"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#141311]/25 via-[#141311]/65 to-[#141311]/90" />

          {/* Hero Content — Centered */}
          <div className="relative z-10 max-w-3xl space-y-7 text-[#faf8f5]">
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-normal leading-[1.02] tracking-tight text-white">
              You are known here.<br className="hidden sm:block" /> You are loved here.
            </h1>

            <p className="text-lg sm:text-xl text-[#e6e2d8] leading-relaxed font-serif mx-auto" style={{ maxWidth: "34rem" }}>
              Life in Nairobi can be demanding, relentless, and loud. In the quiet
              haven of Kileleshwa, our sanctuary doors open each Sunday to give you
              rest. God&apos;s Word proclaimed, sacred songs of praise, and a
              warm church family ready to welcome you home.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#faf8f5] text-[#1c1b18] text-xs font-mono uppercase tracking-widest hover:bg-white transition-all"
                style={{ borderRadius: "2px" }}
              >
                <span>Join Us This Sunday</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                to="/connect?tab=prayer"
                className="inline-flex items-center gap-2.5 px-8 py-4 border border-white/40 text-[#faf8f5] text-xs font-mono uppercase tracking-widest hover:border-white hover:bg-white/10 transition-all"
                style={{ borderRadius: "2px" }}
              >
                <span>Request Prayer</span>
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#faf8f5] underline underline-offset-8 hover:text-[#e0b868] transition-colors"
              >
                <span>Read Our Story &rarr;</span>
              </Link>
            </div>

            <div className="pt-6 border-t border-white/20 flex flex-wrap items-center justify-center gap-5 text-xs font-mono text-[#c9c4bb]">
              <span>08:30 &amp; 10:45 AM EAT</span>
              <span className="opacity-40">|</span>
              <span>Off Mandera Road, Kileleshwa</span>
              <span className="opacity-40">|</span>
              <span>Free Gated Parking</span>
            </div>
          </div>
        </div>
      </MotionSection>

      {/* 2. THE SUNDAY EXPERIENCE BENTO GRID */}
      <MotionSection className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="space-y-8">
          <div className="border-b border-[#e8e4dc] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#781d19] mb-2 font-medium">
                The Lord&apos;s Day Experience
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl font-normal text-[#1c1b18]">
                What Happens on Sunday Morning
              </h2>
            </div>
            <p className="text-sm text-[#57554f] max-w-md leading-relaxed font-sans">
              From traditional metrical hymns to children&apos;s laughter and hot Kenyan
              tea on the lawn, here is what your morning looks like.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Bento Card 1: The Sanctuary Services (Span 7) */}
            <div className="md:col-span-7 editorial-card flex flex-col justify-between">
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1200&q=80"
                  alt="Sunlit church sanctuary pews"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-white/95 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider text-[#1c1b18] border border-[#e8e4dc]">
                  Two Morning Services
                </div>
              </div>

              <div className="p-8 sm:p-10 space-y-6">
                <div className="space-y-2">
                  <div className="text-xs font-mono text-[#781d19] uppercase tracking-wider font-semibold">
                    08:30 AM &amp; 10:45 AM
                  </div>
                  <h3 className="font-serif text-3xl text-[#1c1b18] font-normal">
                    Liturgy, Scripture &amp; Sacred Choral Praise
                  </h3>
                  <p className="text-sm text-[#57554f] leading-relaxed">
                    Our 08:30 AM service preserves the dignity of classical
                    Reformed liturgy, metrical psalms, and sacred choral anthems.
                    Our 10:45 AM service brings multi-generational families
                    together with vibrant congregational singing and in-depth
                    biblical exposition.
                  </p>
                </div>

                <div className="pt-4 border-t border-[#e8e4dc] grid grid-cols-2 gap-4 text-xs font-mono text-[#57554f]">
                  <div>
                    <div className="font-semibold text-[#1c1b18]">First Service: 08:30</div>
                    <div>Traditional Choral Liturgy</div>
                  </div>
                  <div>
                    <div className="font-semibold text-[#1c1b18]">Second Service: 10:45</div>
                    <div>Contemporary &amp; Family Praise</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bento Card 2: Tea on the Cloister Lawn (Span 5) */}
            <div className="md:col-span-5 editorial-card flex flex-col justify-between">
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1000&q=80"
                  alt="People smiling and drinking tea together"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-white/95 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider text-[#1c1b18] border border-[#e8e4dc]">
                  Post-Service Fellowship
                </div>
              </div>

              <div className="p-8 sm:p-10 space-y-4">
                <div className="text-xs font-mono text-[#c2902b] uppercase tracking-wider font-semibold">
                  Nobody Walks Out Alone
                </div>
                <h3 className="font-serif text-3xl text-[#1c1b18] font-normal">
                  Kenyan Tea on the Cloister Lawn
                </h3>
                <p className="text-sm text-[#57554f] leading-relaxed">
                  Between and after our morning services, the church lawn fills
                  with the warmth of conversation, hot tea, and fresh mandazi.
                  Whether you are new to Nairobi or have been here for years,
                  our elders and members are eager to introduce themselves.
                </p>
                <div className="pt-2 text-xs font-mono text-[#8a877e]">
                  Every Sunday &bull; 10:00 AM &amp; 12:30 PM
                </div>
              </div>
            </div>

            {/* Bento Card 3: Church School with Heart (Span 6) */}
            <div className="md:col-span-6 editorial-card flex flex-col justify-between">
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80"
                  alt="Children learning happily in class"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-white/95 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider text-[#1c1b18] border border-[#e8e4dc]">
                  Ages 2 to 18
                </div>
              </div>

              <div className="p-8 space-y-4">
                <div className="text-xs font-mono text-[#2b4c38] uppercase tracking-wider font-semibold">
                  A Safe, Loving Environment
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#1c1b18] font-normal">
                  Church School &amp; Teen Discipleship
                </h3>
                <p className="text-sm text-[#57554f] leading-relaxed">
                  Your children are not an afterthought; they are the heart of
                  our congregation. Dedicated, vetted teachers lead age-graded
                  classes where children sing, learn Scripture, and memorize the
                  Shorter Catechism in an atmosphere of warmth and joy.
                </p>
                <div className="pt-2 text-xs font-mono text-[#8a877e]">
                  Runs simultaneously with the 10:45 AM service
                </div>
              </div>
            </div>

            {/* Bento Card 4: Open Word & Pulpit Series (Span 6) */}
            <div className="md:col-span-6 editorial-card flex flex-col justify-between">
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1000&q=80"
                  alt="Open Bible on timber desk"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-white/95 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider text-[#1c1b18] border border-[#e8e4dc]">
                  Current Sunday Series
                </div>
              </div>

              <div className="p-8 space-y-4">
                <div className="text-xs font-mono text-[#781d19] uppercase tracking-wider font-semibold">
                  Expository Preaching
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#1c1b18] font-normal">
                  The Epistle to the Colossians
                </h3>
                <p className="text-sm text-[#57554f] leading-relaxed">
                  Rev. Dr. Samuel K. Mwangi leads us through the apostle Paul&apos;s
                  letter, unpacking how the supremacy of Christ anchors our
                  integrity, family life, workplace ethics, and emotional peace
                  in a competitive city.
                </p>
                <div className="pt-2 text-xs font-mono text-[#8a877e]">
                  Colossians 3:1-17 &bull; Main Sanctuary Pulpit
                </div>
              </div>
            </div>
          </div>
        </div>
      </MotionSection>

      {/* 3. BY THE NUMBERS — Full-bleed editorial dark section */}
      <MotionSection className="w-full" delay={80}>
        <div className="bg-[#1c1b18]">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-0 items-start">

              {/* Left label */}
              <div className="lg:col-span-4 lg:pt-3">
                <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#8a877e] mb-5">
                  Nine years later
                </p>
                <h2 className="font-serif text-4xl lg:text-5xl text-[#faf8f5] leading-[1.07]">
                  A congregation measured not in metrics, but in moments.
                </h2>
                <div className="mt-10 h-px bg-[#333]" />
                <blockquote className="mt-8 font-serif text-xl text-[#a09b90] italic leading-relaxed">
                  "I was glad when they said to me, let us go to the house of the Lord."
                  <span className="block text-[10px] font-mono not-italic text-[#5a5750] uppercase tracking-widest mt-3">
                    Psalm 122:1
                  </span>
                </blockquote>
              </div>

              {/* Right: stats grid */}
              <div className="lg:col-span-8 lg:pl-20">
                <div className="grid grid-cols-2 gap-0 border-l border-[#2e2d2a]">
                  {[
                    { number: "9", label: "Years of unbroken Sunday worship", sub: "Rain or pandemic, the doors have opened." },
                    { number: "22", label: "Active ministry committees", sub: "Every one staffed by volunteers." },
                    { number: "200+", label: "Baptised members", sub: "And growing, one family at a time." },
                    { number: "2", label: "Full morning services every Sunday", sub: "Traditional at 08:30. Contemporary at 10:45." },
                  ].map((stat, i) => (
                    <div
                      key={stat.number}
                      className={`pl-10 pr-6 py-10 border-b border-[#2e2d2a] ${
                        i % 2 === 1 ? "border-l border-[#2e2d2a]" : ""
                      }`}
                    >
                      <p className="font-serif text-[4.5rem] leading-none text-[#c2902b] mb-3">{stat.number}</p>
                      <p className="text-sm text-[#e0ddd6] font-medium leading-snug mb-1.5">{stat.label}</p>
                      <p className="text-xs text-[#5a5750] leading-relaxed">{stat.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </MotionSection>

      {/* 4. CINEMATIC BREAKOUT BANNER: COMMUNITY IMPACT */}
      <MotionSection className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="relative rounded-3xl overflow-hidden border border-[#e8e4dc] min-h-[460px] flex flex-col justify-end p-8 sm:p-14">
          <img
            src="https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=1600&q=80"
            alt="Parish choir and musical praise"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141311]/95 via-[#141311]/60 to-transparent" />

          <div className="relative z-10 max-w-3xl space-y-4 text-white">
            <div className="text-xs font-mono uppercase tracking-[0.25em] text-[#e0b868]">
              Faith Expressed Through Action
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal leading-tight">
              Twenty-Two Committees. One Beating Heart for Nairobi.
            </h2>
            <p className="text-sm sm:text-base text-[#e6e2d8] leading-relaxed font-serif max-w-2xl">
              True worship spills over into the streets. Through our active
              parish committees, we provide monthly food baskets to vulnerable
              families in Kangemi, mentor boys and girls through the Brigade,
              conduct quarterly free medical camps, and visit the elderly and
              bereaved.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-6">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#e0b868] underline underline-offset-8 hover:text-white transition-colors"
              >
                <span>Discover All 22 Ministry Arms &rarr;</span>
              </Link>
              <Link
                to="/connect?tab=volunteer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#1c1b18] text-xs font-mono uppercase tracking-widest hover:bg-[#faf8f5] transition-colors"
                style={{ borderRadius: "2px" }}
              >
                <span>Volunteer to Serve &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </MotionSection>

      {/* 5. VOICES FROM OUR PARISH FAMILY */}
      <MotionSection className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="space-y-8">
          <div className="border-b border-[#e8e4dc] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#781d19] mb-2 font-medium">
                Real Stories
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl font-normal text-[#1c1b18]">
                Voices of the Congregation
              </h2>
            </div>
            <div className="text-xs font-mono text-[#8a877e]">
              Life in Community
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="editorial-card p-8 flex flex-col justify-between space-y-6">
              <p className="font-serif text-lg text-[#1c1b18] leading-relaxed italic">
                &ldquo;Moving to Nairobi alone was intimidating. On my very first
                Sunday walking into Kileleshwa, an elder and his wife walked over,
                invited me for tea on the lawn, and nine months later, this church
                is my family.&rdquo;
              </p>
              <div className="pt-4 border-t border-[#e8e4dc]">
                <div className="font-medium text-sm text-[#1c1b18]">Sarah Wanjiku</div>
                <div className="text-xs text-[#8a877e] font-mono">Member &bull; Youth Fellowship</div>
              </div>
            </div>

            <div className="editorial-card p-8 flex flex-col justify-between space-y-6">
              <p className="font-serif text-lg text-[#1c1b18] leading-relaxed italic">
                &ldquo;In a city full of motivational speeches, the Sunday 08:30 AM
                liturgical service is the only hour my soul feels truly quiet. The
                preaching doesn&apos;t entertain; it feeds.&rdquo;
              </p>
              <div className="pt-4 border-t border-[#e8e4dc]">
                <div className="font-medium text-sm text-[#1c1b18]">Elder David Ochieng</div>
                <div className="text-xs text-[#8a877e] font-mono">Parishioner for 8 Years</div>
              </div>
            </div>

            <div className="editorial-card p-8 flex flex-col justify-between space-y-6">
              <p className="font-serif text-lg text-[#1c1b18] leading-relaxed italic">
                &ldquo;Through the Woman&apos;s Guild, I found sisters who pray
                with me when my children are sick and rejoice with me when my family
                celebrates. That kind of love cannot be manufactured.&rdquo;
              </p>
              <div className="pt-4 border-t border-[#e8e4dc]">
                <div className="font-medium text-sm text-[#1c1b18]">Beatrice Wanyama</div>
                <div className="text-xs text-[#8a877e] font-mono">Woman&apos;s Guild Leader</div>
              </div>
            </div>
          </div>
        </div>
      </MotionSection>

      {/* 6. FIRST-TIME VISITOR GUIDANCE */}
      <MotionSection className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="editorial-sand p-8 sm:p-14 space-y-8">
          <div className="border-b border-[#e4dfd4] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#781d19] mb-2 font-medium">
                Common Questions
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#1c1b18]">
                First Time Visiting? Everything You Need to Know
              </h2>
            </div>
            <Link
              to="/contact"
              className="text-xs font-mono uppercase tracking-widest text-[#1c1b18] underline underline-offset-4 hover:text-[#781d19]"
            >
              Ask a Specific Question &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <h3 className="font-serif text-xl text-[#1c1b18]">What should I wear?</h3>
              <p className="text-sm text-[#57554f] leading-relaxed">
                Come in whatever makes you comfortable. You will see people in
                traditional dress, Sunday suits, and smart casual jeans. You will
                be received warmly regardless.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-serif text-xl text-[#1c1b18]">Where do I park?</h3>
              <p className="text-sm text-[#57554f] leading-relaxed">
                We have generous, secure, gated parking on our sanctuary grounds
                off Mandera Road. Our protocol team will guide your car directly
                to a spot.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-serif text-xl text-[#1c1b18]">What if my baby cries?</h3>
              <p className="text-sm text-[#57554f] leading-relaxed">
                Children are a heritage from the Lord, not a disturbance. You may
                keep them with you in the pew, or use our dedicated mothers&apos; cry
                room with full audio relay.
              </p>
            </div>
          </div>
        </div>
      </MotionSection>
    </div>
  );
}
