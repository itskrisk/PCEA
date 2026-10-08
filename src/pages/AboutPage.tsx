import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { MotionSection } from "@/components/MotionSection";

/* ─── Committee Data ─────────────────────────────────────────── */
interface Committee {
  number: string;
  name: string;
  category: "Fellowship" | "Mission" | "Worship" | "Governance";
  purpose: string;
}

const COMMITTEES: Committee[] = [
  { number: "01", name: "Woman's Guild", category: "Fellowship", purpose: "Spiritual fellowship, discipleship, and practical community service for women across the parish." },
  { number: "02", name: "Presbyterian Men's Fellowship", category: "Fellowship", purpose: "Equipping Christian men through scripture study, family leadership, and vocational mentorship." },
  { number: "03", name: "Youth Fellowship", category: "Fellowship", purpose: "Mentorship, spiritual formation, and purposeful community engagement for young adults." },
  { number: "04", name: "Boys' & Girls' Brigade", category: "Fellowship", purpose: "Christian discipline, drill, biblical character development, and life skills for youth." },
  { number: "05", name: "Church School", category: "Fellowship", purpose: "Foundational biblical education, catechism instruction, and worship formation for children." },
  { number: "06", name: "Evangelism & Mission", category: "Mission", purpose: "Coordinating neighbourhood gospel outreach, regional mission teams, and church planting efforts." },
  { number: "07", name: "Christian Education", category: "Mission", purpose: "Overseeing systematic Bible studies, doctrine classes, and theological library resources." },
  { number: "08", name: "Justice, Peace & Reconciliation", category: "Mission", purpose: "Promoting civic integrity, constitutional awareness, and ethical leadership in society." },
  { number: "09", name: "Health & Healing Ministry", category: "Mission", purpose: "Coordinating free medical camps, health literacy, and hospital visitation alongside prayer." },
  { number: "10", name: "Social Responsibility & Benevolence", category: "Mission", purpose: "Providing food baskets, emergency relief, and compassionate support to vulnerable families." },
  { number: "11", name: "Finance & Audit Committee", category: "Governance", purpose: "Ensuring transparent fiscal stewardship, budgeting, and statutory compliance across the parish." },
  { number: "12", name: "Property & Facilities Committee", category: "Governance", purpose: "Overseeing maintenance, infrastructure development, and environmental stewardship of church premises." },
  { number: "13", name: "Liturgy & Worship Committee", category: "Worship", purpose: "Planning services, selecting hymnody, maintaining the integrity of Reformed worship practice." },
  { number: "14", name: "Music Ministry", category: "Worship", purpose: "Leading corporate praise through the choir, instruments, and rehearsal of sacred music." },
  { number: "15", name: "Hospitality & Ushering", category: "Fellowship", purpose: "Creating welcoming, orderly, and dignified experiences for every person who enters the sanctuary." },
  { number: "16", name: "Prayer & Intercession Ministry", category: "Worship", purpose: "Sustaining corporate and private prayer, holding up the congregation and broader community before God." },
  { number: "17", name: "Pastoral Care & Counselling", category: "Fellowship", purpose: "Walking alongside members through grief, crisis, marriage, illness, and every season of life." },
  { number: "18", name: "Communications & Media", category: "Governance", purpose: "Managing the church's digital presence, bulletin design, photography, and event coverage." },
  { number: "19", name: "Stewardship & Fundraising", category: "Governance", purpose: "Cultivating a culture of generosity, overseeing campaigns, and building a long-term endowment." },
  { number: "20", name: "Library & Archives", category: "Governance", purpose: "Curating theological resources, preserving parish records, and supporting lifelong learning." },
  { number: "21", name: "Welfare & Bursary Fund", category: "Mission", purpose: "Identifying and supporting students, widows, and families in educational or financial need." },
  { number: "22", name: "Climate & Environment Ministry", category: "Mission", purpose: "Responding to creation care through tree planting, waste reduction, and environmental education." },
];

const CATEGORY_COLORS: Record<Committee["category"], string> = {
  Fellowship: "text-[#2b4c38] bg-[#2b4c38]/8",
  Mission:    "text-[#781d19] bg-[#781d19]/8",
  Worship:    "text-[#c2902b] bg-[#c2902b]/10",
  Governance: "text-[#3a3570] bg-[#3a3570]/8",
};

/* ─── Leadership Data ────────────────────────────────────────── */
const KIRK_SESSION = [
  { name: "Rev. Samuel Kamau", role: "Parish Minister" },
  { name: "Elder James Mwangi", role: "Session Clerk" },
  { name: "Elder Grace Wanjiku", role: "Treasurer" },
  { name: "Elder Peter Njoroge", role: "Elder" },
  { name: "Elder Faith Otieno", role: "Elder" },
  { name: "Elder David Kariuki", role: "Elder" },
  { name: "Elder Susan Achieng", role: "Elder" },
];

const LCC = [
  { name: "Margaret Ndungu", role: "LCC Chairperson" },
  { name: "Michael Odhiambo", role: "Vice Chairperson" },
  { name: "Beatrice Waweru", role: "Secretary" },
  { name: "Robert Githinji", role: "Treasurer" },
  { name: "Caroline Muthoni", role: "Women's Representative" },
  { name: "Patrick Aloo", role: "Youth Representative" },
];

/* ─── Page Component ─────────────────────────────────────────── */
export function AboutPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<Committee["category"] | "All">("All");
  const [leadershipTab, setLeadershipTab] = useState<"kirk" | "lcc">("kirk");

  const filtered = COMMITTEES.filter((c) => {
    const matchCat = activeCategory === "All" || c.category === activeCategory;
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.purpose.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const categories: (Committee["category"] | "All")[] = ["All", "Fellowship", "Mission", "Worship", "Governance"];

  return (
    <div className="w-full">

      {/* ── CINEMATIC BANNER ───────────────────────────────────── */}
      <MotionSection className="w-full">
        <div className="relative overflow-hidden min-h-[580px] lg:min-h-[680px] flex flex-col justify-end">
          <img
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1800&q=85"
            alt="PCEA Kileleshwa congregation gathered in worship"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141311]/90 via-[#141311]/50 to-[#141311]/15" />

          <div className="relative z-10 max-w-7xl mx-auto w-full px-6 lg:px-12 pb-16 lg:pb-24">
            <div className="max-w-3xl space-y-5">
              <p className="text-xs font-mono uppercase tracking-[0.25em] text-[#e0b868]">Our Story</p>
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-white font-normal leading-[1.02] tracking-tight">
                A congregation nine<br className="hidden sm:block" /> years in the making.
              </h1>
              <p className="text-lg text-[#e6e2d8] font-serif leading-relaxed max-w-2xl">
                We did not begin with a building or a budget. We began with a handful of
                families who believed the Reformed faith still had something urgent to say
                to a city moving at full speed. That belief has not dimmed.
              </p>
            </div>
          </div>
        </div>
      </MotionSection>

      {/* ── STORY BENTO GRID ─────────────────────────────────────── */}
      <MotionSection className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Large editorial text card */}
          <div className="lg:col-span-7 editorial-card p-10 lg:p-14 flex flex-col justify-between gap-12">
            <div className="space-y-6">
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#8a877e]">Who We Are</p>
              <h2 className="font-serif text-4xl lg:text-[2.6rem] leading-[1.1] text-[#1c1b18]">
                Reformed. Rooted. Relentlessly<br /> present in Nairobi.
              </h2>
              <div className="space-y-4 text-[#57554f] leading-[1.85] text-[0.96rem]">
                <p>
                  PCEA Kileleshwa is a congregation of the Presbyterian Church of East Africa,
                  the denomination founded in 1891 by Scottish missionaries who carried the
                  Westminster Standards into the heart of East Africa. That inheritance lives
                  in our liturgy, our preaching, and our ordered way of church life.
                </p>
                <p>
                  But inheritance is not nostalgia. Every Sunday we gather as a people who
                  believe that the ancient truths of grace, repentance, covenant, and
                  resurrection are precisely what a modern city needs. We take the sermon
                  seriously. We take the Lord's Supper seriously. And we take one another
                  seriously too.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 pt-2">
              <div>
                <p className="font-serif text-5xl text-[#781d19] leading-none">9</p>
                <p className="text-xs font-mono uppercase tracking-widest text-[#8a877e] mt-2">Years in Kileleshwa</p>
              </div>
              <div>
                <p className="font-serif text-5xl text-[#781d19] leading-none">22</p>
                <p className="text-xs font-mono uppercase tracking-widest text-[#8a877e] mt-2">Active Committees</p>
              </div>
            </div>
          </div>

          {/* Photo card + vision */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="relative overflow-hidden" style={{ borderRadius: "1.25rem", height: "280px" }}>
              <img
                src="https://images.unsplash.com/photo-1473177104440-ffee2f376098?auto=format&fit=crop&w=900&q=85"
                alt="Cathedral light through arches"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1c1b18]/70 to-transparent flex items-end p-7">
                <p className="font-serif text-white text-2xl leading-snug">
                  The sanctuary as<br />a place of formation.
                </p>
              </div>
            </div>
            <div className="editorial-sand p-8 flex-1 flex flex-col justify-center gap-3">
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#8a877e]">Our Vision</p>
              <p className="font-serif text-[1.6rem] leading-snug text-[#1c1b18]">
                A congregation where every person finds their place in the story of grace.
              </p>
              <p className="text-sm text-[#57554f] leading-relaxed mt-1">
                We measure success not in attendance numbers but in depth: deep roots,
                deep friendships, and deep love for a city that rarely slows down enough
                to listen.
              </p>
            </div>
          </div>
        </div>
      </MotionSection>

      {/* ── TIMELINE BAND ────────────────────────────────────────── */}
      <MotionSection className="w-full bg-[#1c1b18]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20">
          <p className="text-xs font-mono uppercase tracking-[0.25em] text-[#8a877e] mb-3 text-center">Our History</p>
          <h2 className="font-serif text-4xl lg:text-5xl text-[#faf8f5] text-center leading-[1.08] mb-12">
            Four chapters that shaped us.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-[#333]">
            {[
              { year: "2015", title: "The Founding", body: "A small fellowship plant begins in a rented hall. Eighteen families. Two elders. One shared conviction: the gospel is enough." },
              { year: "2018", title: "A Home of Our Own", body: "The congregation acquires its permanent premises on Kileleshwa Road. The first Sunday in the new sanctuary is unforgettable." },
              { year: "2020", title: "Through the Silence", body: "During the global health crisis, the church adapts swiftly, sustaining worship, pastoral care, and the benevolence fund without interruption." },
              { year: "2024", title: "Growing Deeper", body: "Membership crosses two hundred. The 22nd committee is formed. A building extension fund is opened for the future." },
            ].map((item) => (
              <div key={item.year} className="border-r border-[#333] last:border-r-0 px-8 py-10 first:pl-0">
                <p className="font-serif text-5xl text-[#c2902b] leading-none mb-4">{item.year}</p>
                <p className="font-medium text-[#faf8f5] text-sm mb-2">{item.title}</p>
                <p className="text-xs text-[#8a877e] leading-[1.7]">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </MotionSection>

      {/* ── WHAT WE BELIEVE ──────────────────────────────────────── */}
      <MotionSection className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-4">
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#8a877e] mb-4">What We Believe</p>
            <h2 className="font-serif text-4xl lg:text-5xl leading-[1.08] text-[#1c1b18]">
              The faith<br />once delivered.
            </h2>
            <div className="mt-8 h-px bg-[#e8e4dc]" />
            <p className="text-xs text-[#8a877e] font-mono uppercase tracking-widest mt-6 leading-relaxed">
              Westminster Confession of Faith<br />
              Westminster Shorter Catechism<br />
              Westminster Larger Catechism<br />
              PCEA Book of Order
            </p>
          </div>
          <div className="lg:col-span-8 space-y-7 text-[#57554f] leading-[1.9] text-[0.96rem]">
            <p>
              We are confessional Reformed Christians. Our beliefs are anchored in the
              Westminster Standards, held in common with Presbyterian and Reformed churches
              around the world, refined over centuries of careful biblical reflection.
            </p>
            <p>
              We confess the Trinity: one God in three persons. We believe in the full
              inspiration and authority of Scripture. We hold to the doctrines of grace
              known historically as TULIP, not as a system to defend, but as a portrait
              of who God is and how lavishly he loves his people.
            </p>
            <p>
              We observe two sacraments: Baptism, the covenant sign of entry into the
              community of faith; and the Lord's Supper, the covenant meal of remembrance,
              communion, and anticipation of the marriage supper of the Lamb. These are not
              mere symbols. They are means of grace, ordained by Christ, administered with
              care.
            </p>
            <p>
              Our polity is Presbyterian: ruled by elders, accountable to Presbytery, and
              ultimately submitted to the headship of Jesus Christ over his church.
            </p>
            <blockquote className="border-l-4 border-[#c2902b] pl-6 font-serif text-xl text-[#1c1b18] italic leading-relaxed">
              "The chief end of man is to glorify God and to enjoy him forever."
              <span className="block text-xs font-mono not-italic text-[#8a877e] mt-2 uppercase tracking-widest">Westminster Shorter Catechism, Q.1</span>
            </blockquote>
          </div>
        </div>
      </MotionSection>

      {/* ── LEADERSHIP ───────────────────────────────────────────── */}
      <MotionSection className="w-full bg-[#f3efe6]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#8a877e] mb-3">Leadership</p>
              <h2 className="font-serif text-4xl lg:text-5xl text-[#1c1b18] leading-[1.08]">
                Servants, not managers.
              </h2>
            </div>
            <div className="flex border border-[#d9d4ca] overflow-hidden" style={{ borderRadius: "2px" }}>
              <button
                onClick={() => setLeadershipTab("kirk")}
                className={`px-5 py-2.5 text-xs font-mono uppercase tracking-widest transition-colors ${
                  leadershipTab === "kirk" ? "bg-[#1c1b18] text-white" : "text-[#57554f] hover:bg-[#e8e4dc]"
                }`}
              >
                Kirk Session
              </button>
              <button
                onClick={() => setLeadershipTab("lcc")}
                className={`px-5 py-2.5 text-xs font-mono uppercase tracking-widest transition-colors ${
                  leadershipTab === "lcc" ? "bg-[#1c1b18] text-white" : "text-[#57554f] hover:bg-[#e8e4dc]"
                }`}
              >
                LCC
              </button>
            </div>
          </div>

          {leadershipTab === "kirk" && (
            <div className="space-y-0">
              <p className="text-sm text-[#57554f] leading-relaxed mb-8 max-w-2xl">
                The Kirk Session is the governing body of the congregation, composed of
                ordained teaching and ruling elders. They guard the doctrine, discipline,
                and spiritual welfare of the flock.
              </p>
              <div className="divide-y divide-[#d9d4ca]">
                {KIRK_SESSION.map((person) => (
                  <div key={person.name} className="flex items-center justify-between py-5">
                    <p className="font-serif text-xl text-[#1c1b18]">{person.name}</p>
                    <p className="text-xs font-mono uppercase tracking-widest text-[#8a877e]">{person.role}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {leadershipTab === "lcc" && (
            <div className="space-y-0">
              <p className="text-sm text-[#57554f] leading-relaxed mb-8 max-w-2xl">
                The Local Church Council supports the Session in the day-to-day administration
                of congregational life, programmes, and property stewardship.
              </p>
              <div className="divide-y divide-[#d9d4ca]">
                {LCC.map((person) => (
                  <div key={person.name} className="flex items-center justify-between py-5">
                    <p className="font-serif text-xl text-[#1c1b18]">{person.name}</p>
                    <p className="text-xs font-mono uppercase tracking-widest text-[#8a877e]">{person.role}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </MotionSection>

      {/* ── COMMITTEES ───────────────────────────────────────────── */}
      <MotionSection className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
        <div className="mb-12">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#8a877e] mb-3">Our Committees</p>
          <h2 className="font-serif text-4xl lg:text-5xl text-[#1c1b18] leading-[1.08] mb-4">
            Twenty-two teams.<br className="hidden sm:block" /> One body.
          </h2>
          <p className="text-[#57554f] max-w-2xl leading-relaxed text-sm">
            Every committee is staffed by volunteers who give their evenings, their skills,
            and their care to the life of this congregation. Browse by category or search
            for something specific.
          </p>
        </div>

        {/* Filter row */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a877e]" />
            <input
              type="text"
              placeholder="Search committees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-sm border border-[#e8e4dc] bg-white text-[#1c1b18] focus:outline-none focus:border-[#1c1b18] placeholder-[#8a877e] transition-colors"
              style={{ borderRadius: "2px" }}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-xs font-mono uppercase tracking-widest border transition-colors ${
                  activeCategory === cat
                    ? "bg-[#1c1b18] text-white border-[#1c1b18]"
                    : "border-[#e8e4dc] text-[#57554f] hover:border-[#1c1b18] hover:text-[#1c1b18]"
                }`}
                style={{ borderRadius: "2px" }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Committee grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((committee) => (
            <div key={committee.number} className="editorial-card p-7 flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <span className="font-mono text-xs text-[#8a877e]">{committee.number}</span>
                <span className={`text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 ${CATEGORY_COLORS[committee.category]}`} style={{ borderRadius: "2px" }}>
                  {committee.category}
                </span>
              </div>
              <p className="font-serif text-lg text-[#1c1b18] leading-snug">{committee.name}</p>
              <p className="text-xs text-[#57554f] leading-[1.75]">{committee.purpose}</p>
              <div className="pt-2 mt-auto">
                <Link
                  to={`/connect?tab=volunteer&committee=${encodeURIComponent(committee.name)}`}
                  className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-[#781d19] hover:text-[#1c1b18] hover:underline"
                >
                  Volunteer / Serve &rarr;
                </Link>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-16 text-center text-[#8a877e] font-mono text-xs uppercase tracking-widest">
              No committees match your search.
            </div>
          )}
        </div>
      </MotionSection>

      {/* ── CLOSING BANNER ───────────────────────────────────────── */}
      <MotionSection className="w-full">
        <div className="relative overflow-hidden min-h-[360px] flex items-center">
          <img
            src="https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1800&q=85"
            alt="Sunlight through church pews"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-[#1c1b18]/75" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full py-20">
            <div className="max-w-2xl space-y-5">
              <h2 className="font-serif text-4xl lg:text-5xl text-white leading-[1.1]">
                Ready to be part of the story?
              </h2>
              <p className="text-[#e6e2d8] text-[0.96rem] leading-relaxed">
                Whether you are returning after years away, carrying a question, or simply
                curious what we are about, there is a place for you here. Come as you are.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#faf8f5] text-[#1c1b18] text-xs font-mono uppercase tracking-widest hover:bg-white transition-colors"
                  style={{ borderRadius: "2px" }}
                >
                  Get in Touch
                </Link>
                <Link
                  to="/gallery"
                  className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/40 text-white text-xs font-mono uppercase tracking-widest hover:border-white transition-colors"
                  style={{ borderRadius: "2px" }}
                >
                  View Gallery
                </Link>
              </div>
            </div>
          </div>
        </div>
      </MotionSection>

    </div>
  );
}
