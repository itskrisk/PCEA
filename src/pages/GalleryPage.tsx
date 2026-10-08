import React, { useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { MotionSection } from "@/components/MotionSection";

/* ─── Photo Data ─────────────────────────────────────────────── */
interface Photo {
  id: string;
  src: string;
  alt: string;
  caption: string;
  category: GalleryCategory;
  span?: "wide" | "tall" | "normal";
}

type GalleryCategory = "All" | "Worship" | "Community" | "Events" | "Grounds";

const PHOTOS: Photo[] = [
  {
    id: "p1",
    src: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1200&q=85",
    alt: "Morning sunlight streaming through sanctuary windows",
    caption: "A Sunday morning before the congregation arrives. The light arrives first.",
    category: "Worship",
    span: "wide",
  },
  {
    id: "p2",
    src: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=900&q=85",
    alt: "Congregation in fellowship after service",
    caption: "The hour after service is its own kind of liturgy.",
    category: "Community",
    span: "normal",
  },
  {
    id: "p3",
    src: "https://images.unsplash.com/photo-1473177104440-ffee2f376098?auto=format&fit=crop&w=900&q=85",
    alt: "Cathedral arches in afternoon light",
    caption: "Architecture as a language of reverence.",
    category: "Grounds",
    span: "tall",
  },
  {
    id: "p4",
    src: "https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=900&q=85",
    alt: "Open Bible on a wooden pew",
    caption: "The sermon begins the night before, in someone's quiet room.",
    category: "Worship",
    span: "normal",
  },
  {
    id: "p5",
    src: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=85",
    alt: "Youth fellowship in discussion",
    caption: "A generation asking hard questions. We believe that is exactly right.",
    category: "Community",
    span: "wide",
  },
  {
    id: "p6",
    src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=85",
    alt: "Full congregation at worship",
    caption: "Two hundred voices. One confession.",
    category: "Worship",
    span: "normal",
  },
  {
    id: "p7",
    src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=85",
    alt: "Church exterior and grounds",
    caption: "The building on Kileleshwa Road. Modest from the outside. Full inside.",
    category: "Grounds",
    span: "normal",
  },
  {
    id: "p8",
    src: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=1200&q=85",
    alt: "Choir during Sunday service",
    caption: "The choir does not perform. They lead the congregation into praise.",
    category: "Worship",
    span: "wide",
  },
  {
    id: "p9",
    src: "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=900&q=85",
    alt: "Pews in warm light",
    caption: "This is where the ordinary becomes sacred.",
    category: "Grounds",
    span: "normal",
  },
  {
    id: "p10",
    src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=85",
    alt: "Pastoral portrait",
    caption: "The minister at study. Forty hours in for a twenty-minute sermon.",
    category: "Community",
    span: "normal",
  },
  {
    id: "p11",
    src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=900&q=85",
    alt: "Community outreach event",
    caption: "The benevolence committee at work. Every week, not just Christmas.",
    category: "Events",
    span: "normal",
  },
  {
    id: "p12",
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=85",
    alt: "Woman's Guild gathering",
    caption: "The Woman's Guild has met without a break in nine years. That is no small thing.",
    category: "Events",
    span: "normal",
  },
];

const CATEGORIES: GalleryCategory[] = ["All", "Worship", "Community", "Events", "Grounds"];

/* ─── Page Component ─────────────────────────────────────────── */
export function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>("All");
  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null);

  const filtered = activeCategory === "All"
    ? PHOTOS
    : PHOTOS.filter((p) => p.category === activeCategory);

  const openLightbox = (photo: Photo) => setLightboxPhoto(photo);
  const closeLightbox = () => setLightboxPhoto(null);

  return (
    <div className="w-full">

      {/* ── PAGE HEADER BANNER ────────────────────────────────────── */}
      <MotionSection className="w-full">
        <div className="relative overflow-hidden min-h-[420px] flex flex-col justify-end">
          <img
            src="https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=1800&q=85"
            alt="Choir leading worship"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141311]/90 via-[#141311]/45 to-transparent" />
          <div className="relative z-10 max-w-7xl mx-auto w-full px-6 lg:px-12 pb-16 lg:pb-20">
            <div className="max-w-2xl space-y-4">
              <p className="text-xs font-mono uppercase tracking-[0.25em] text-[#e0b868]">Gallery</p>
              <h1 className="font-serif text-5xl lg:text-6xl text-white font-normal leading-[1.03]">
                The life of a congregation,<br className="hidden sm:block" /> in frames.
              </h1>
              <p className="text-[#ddd9d1] text-base leading-relaxed font-serif">
                These photographs are not marketing. They are a record of real Sundays,
                real people, and a faith practiced in the ordinary. Browse freely.
              </p>
            </div>
          </div>
        </div>
      </MotionSection>

      {/* ── CATEGORY FILTER ───────────────────────────────────────── */}
      <MotionSection className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="flex flex-wrap items-center gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 text-xs font-mono uppercase tracking-widest border transition-colors ${
                activeCategory === cat
                  ? "bg-[#1c1b18] text-white border-[#1c1b18]"
                  : "border-[#e8e4dc] text-[#57554f] hover:border-[#1c1b18] hover:text-[#1c1b18]"
              }`}
              style={{ borderRadius: "2px" }}
            >
              {cat}
            </button>
          ))}
          <span className="ml-auto text-xs font-mono text-[#8a877e] hidden sm:block">
            {filtered.length} photograph{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      </MotionSection>

      {/* ── ASYMMETRIC PHOTO GRID ─────────────────────────────────── */}
      <MotionSection className="max-w-7xl mx-auto px-6 lg:px-12 pb-24">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
          {filtered.map((photo) => (
            <div
              key={photo.id}
              className="break-inside-avoid editorial-card overflow-hidden cursor-pointer group"
              onClick={() => openLightbox(photo)}
            >
              <div
                className="overflow-hidden"
                style={{
                  height: photo.span === "wide" ? "320px" : photo.span === "tall" ? "460px" : "260px",
                }}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <p className="text-[10px] font-mono uppercase tracking-widest text-[#8a877e] mb-1.5">{photo.category}</p>
                <p className="text-sm text-[#57554f] leading-relaxed italic font-serif">{photo.caption}</p>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-24 text-center text-[#8a877e] font-mono text-xs uppercase tracking-widest">
            No photographs in this category yet.
          </div>
        )}
      </MotionSection>

      {/* ── EDITORIAL FOOTER CALLOUT ──────────────────────────────── */}
      <MotionSection className="w-full bg-[#f3efe6]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div className="max-w-xl">
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#8a877e] mb-3">Contributing</p>
              <h2 className="font-serif text-3xl lg:text-4xl text-[#1c1b18] leading-[1.1]">
                Were you there? Submit a photograph.
              </h2>
              <p className="text-sm text-[#57554f] leading-relaxed mt-4">
                Members who attend services and events are invited to share photographs
                with the Communications Committee. The best submissions are archived
                here and in the parish records.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="mailto:photos@pceakileleshwa.or.ke"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#1c1b18] text-white text-xs font-mono uppercase tracking-widest hover:bg-[#333] transition-colors"
                style={{ borderRadius: "2px" }}
              >
                Send a Photo
              </a>
              <Link
                to="/connect?tab=testimony"
                className="inline-flex items-center gap-2 px-7 py-3.5 border border-[#1c1b18] text-[#1c1b18] text-xs font-mono uppercase tracking-widest hover:bg-[#1c1b18] hover:text-white transition-colors"
                style={{ borderRadius: "2px" }}
              >
                Share a Testimony
              </Link>
            </div>
          </div>
        </div>
      </MotionSection>

      {/* ── LIGHTBOX ──────────────────────────────────────────────── */}
      {lightboxPhoto && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#faf8f5]/95 backdrop-blur-sm p-4 sm:p-10"
          onClick={closeLightbox}
        >
          <div
            className="relative max-w-5xl w-full bg-white border border-[#e8e4dc] shadow-2xl"
            style={{ borderRadius: "1.25rem", overflow: "hidden" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 p-2 bg-white border border-[#e8e4dc] text-[#1c1b18] hover:bg-[#f3efe6] transition-colors"
              style={{ borderRadius: "2px" }}
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
            <img
              src={lightboxPhoto.src.replace("w=900", "w=1400")}
              alt={lightboxPhoto.alt}
              className="w-full max-h-[75vh] object-contain bg-[#f3efe6]"
            />
            <div className="p-6 sm:p-8 border-t border-[#e8e4dc]">
              <p className="text-[10px] font-mono uppercase tracking-widest text-[#8a877e] mb-2">{lightboxPhoto.category}</p>
              <p className="font-serif text-lg text-[#1c1b18] italic leading-relaxed">{lightboxPhoto.caption}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
