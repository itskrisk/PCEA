"use client";

import React, { useState } from "react";

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  date: string;
  aspect: "landscape" | "portrait" | "wide";
  description: string;
  svgGraphic: React.ReactNode;
}

const CATEGORIES = [
  "All",
  "Sanctuary & Liturgy",
  "Fellowship & Community",
  "Youth & Children",
  "Parish Milestones",
];

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "photo-1",
    title: "Morning Light on the Pulpit and Chancel",
    category: "Sanctuary & Liturgy",
    date: "September 2026",
    aspect: "wide",
    description:
      "Sunday morning light streaming across the timber pulpit, open communion table, and sanctuary chancel before the first service.",
    svgGraphic: (
      <svg className="w-full h-full bg-neutral-100" viewBox="0 0 800 450" fill="none">
        <rect width="800" height="450" fill="#f5f5f3" />
        <line x1="100" y1="50" x2="100" y2="400" stroke="#d4d4d0" strokeWidth="1" />
        <line x1="700" y1="50" x2="700" y2="400" stroke="#d4d4d0" strokeWidth="1" />
        <line x1="400" y1="80" x2="400" y2="370" stroke="#111111" strokeWidth="1.5" />
        <line x1="360" y1="160" x2="440" y2="160" stroke="#111111" strokeWidth="1.5" />
        <rect x="330" y="240" width="140" height="110" stroke="#111111" strokeWidth="1" fill="#ffffff" />
        <rect x="240" y="320" width="320" height="40" stroke="#111111" strokeWidth="1" fill="#e5e5e0" />
        <text x="400" y="420" textAnchor="middle" fontFamily="monospace" fontSize="11" fill="#737373" letterSpacing="2">
          SANCTUARY CHANCEL / NAIROBI
        </text>
      </svg>
    ),
  },
  {
    id: "photo-2",
    title: "The Congregation Assembled for Holy Communion",
    category: "Sanctuary & Liturgy",
    date: "August 2026",
    aspect: "portrait",
    description:
      "A quiet view down the central nave during the distribution of the elements during the Sacrament of the Lord's Supper.",
    svgGraphic: (
      <svg className="w-full h-full bg-neutral-100" viewBox="0 0 500 650" fill="none">
        <rect width="500" height="650" fill="#f0f0ee" />
        <line x1="250" y1="40" x2="250" y2="600" stroke="#d4d4d0" strokeWidth="1" strokeDasharray="4 4" />
        <rect x="80" y="140" width="140" height="28" stroke="#111111" strokeWidth="1" fill="#ffffff" />
        <rect x="280" y="140" width="140" height="28" stroke="#111111" strokeWidth="1" fill="#ffffff" />
        <rect x="80" y="200" width="140" height="28" stroke="#111111" strokeWidth="1" fill="#ffffff" />
        <rect x="280" y="200" width="140" height="28" stroke="#111111" strokeWidth="1" fill="#ffffff" />
        <rect x="80" y="260" width="140" height="28" stroke="#111111" strokeWidth="1" fill="#ffffff" />
        <rect x="280" y="260" width="140" height="28" stroke="#111111" strokeWidth="1" fill="#ffffff" />
        <rect x="80" y="320" width="140" height="28" stroke="#111111" strokeWidth="1" fill="#ffffff" />
        <rect x="280" y="320" width="140" height="28" stroke="#111111" strokeWidth="1" fill="#ffffff" />
        <text x="250" y="620" textAnchor="middle" fontFamily="monospace" fontSize="10" fill="#737373" letterSpacing="2">
          NAVE SEATING &amp; CENTRAL AISLE
        </text>
      </svg>
    ),
  },
  {
    id: "photo-3",
    title: "Choral Practice for the Reformation Day Hymnody",
    category: "Sanctuary & Liturgy",
    date: "July 2026",
    aspect: "landscape",
    description:
      "The parish choir rehearsing classical polyphonic anthems and four-part harmony hymns in the west gallery.",
    svgGraphic: (
      <svg className="w-full h-full bg-neutral-100" viewBox="0 0 600 420" fill="none">
        <rect width="600" height="420" fill="#ececea" />
        <line x1="60" y1="120" x2="540" y2="120" stroke="#111111" strokeWidth="1" />
        <line x1="60" y1="135" x2="540" y2="135" stroke="#111111" strokeWidth="1" />
        <line x1="60" y1="150" x2="540" y2="150" stroke="#111111" strokeWidth="1" />
        <line x1="60" y1="165" x2="540" y2="165" stroke="#111111" strokeWidth="1" />
        <line x1="60" y1="180" x2="540" y2="180" stroke="#111111" strokeWidth="1" />
        <circle cx="200" cy="150" r="8" fill="#782620" />
        <line x1="208" y1="150" x2="208" y2="105" stroke="#111111" strokeWidth="1.5" />
        <circle cx="340" cy="135" r="8" fill="#111111" />
        <line x1="348" y1="135" x2="348" y2="90" stroke="#111111" strokeWidth="1.5" />
        <text x="300" y="380" textAnchor="middle" fontFamily="monospace" fontSize="10" fill="#737373" letterSpacing="2">
          PARISH CHOIR SCORE STUDY
        </text>
      </svg>
    ),
  },
  {
    id: "photo-4",
    title: "Post-Service Tea and Congregational Fellowship",
    category: "Fellowship & Community",
    date: "June 2026",
    aspect: "landscape",
    description:
      "Parishioners and guests gathering on the cloister lawn for Kenyan tea and pastoral conversation between Sunday services.",
    svgGraphic: (
      <svg className="w-full h-full bg-neutral-100" viewBox="0 0 600 420" fill="none">
        <rect width="600" height="420" fill="#f4f4f1" />
        <line x1="40" y1="360" x2="560" y2="360" stroke="#111111" strokeWidth="1" />
        <circle cx="160" cy="240" r="30" stroke="#111111" strokeWidth="1" fill="#ffffff" />
        <circle cx="300" cy="220" r="35" stroke="#111111" strokeWidth="1" fill="#ffffff" />
        <circle cx="440" cy="250" r="28" stroke="#111111" strokeWidth="1" fill="#ffffff" />
        <text x="300" y="395" textAnchor="middle" fontFamily="monospace" fontSize="10" fill="#737373" letterSpacing="2">
          CLOISTER GROUNDS / SUNDAY FELLOWSHIP
        </text>
      </svg>
    ),
  },
  {
    id: "photo-5",
    title: "Church School Annual Bible Recitation Morning",
    category: "Youth & Children",
    date: "May 2026",
    aspect: "portrait",
    description:
      "Younger children reciting the Shorter Catechism questions and memory verses before their teachers and parents.",
    svgGraphic: (
      <svg className="w-full h-full bg-neutral-100" viewBox="0 0 500 650" fill="none">
        <rect width="500" height="650" fill="#f1f1ee" />
        <rect x="90" y="180" width="320" height="240" stroke="#111111" strokeWidth="1" fill="#ffffff" />
        <line x1="90" y1="230" x2="410" y2="230" stroke="#d4d4d0" strokeWidth="1" />
        <line x1="130" y1="280" x2="370" y2="280" stroke="#111111" strokeWidth="1" />
        <line x1="130" y1="310" x2="340" y2="310" stroke="#111111" strokeWidth="1" />
        <line x1="130" y1="340" x2="300" y2="340" stroke="#111111" strokeWidth="1" />
        <text x="250" y="620" textAnchor="middle" fontFamily="monospace" fontSize="10" fill="#737373" letterSpacing="2">
          CHURCH SCHOOL CHAPEL
        </text>
      </svg>
    ),
  },
  {
    id: "photo-6",
    title: "Groundbreaking and Dedication of the Annex Hall",
    category: "Parish Milestones",
    date: "April 2026",
    aspect: "wide",
    description:
      "Kirk Session elders and Presbytery officers laying the commemorative foundation stone for the administrative parish annex.",
    svgGraphic: (
      <svg className="w-full h-full bg-neutral-100" viewBox="0 0 800 450" fill="none">
        <rect width="800" height="450" fill="#eaeae6" />
        <rect x="220" y="140" width="360" height="180" stroke="#111111" strokeWidth="1.5" fill="#ffffff" />
        <line x1="220" y1="190" x2="580" y2="190" stroke="#111111" strokeWidth="1" />
        <text x="400" y="240" textAnchor="middle" fontFamily="serif" fontSize="18" fill="#111111">
          SOLI DEO GLORIA
        </text>
        <text x="400" y="270" textAnchor="middle" fontFamily="monospace" fontSize="11" fill="#782620" letterSpacing="2">
          CORNERSTONE LAID IN FAITH
        </text>
        <text x="400" y="415" textAnchor="middle" fontFamily="monospace" fontSize="10" fill="#737373" letterSpacing="2">
          PARISH ANNEX SITE DEDICATION
        </text>
      </svg>
    ),
  },
  {
    id: "photo-7",
    title: "Woman's Guild Annual Medical and Food Outreach",
    category: "Fellowship & Community",
    date: "March 2026",
    aspect: "landscape",
    description:
      "Volunteer nurses, doctors, and guild members packing pharmaceutical and nutritional aid packages for partner settlements.",
    svgGraphic: (
      <svg className="w-full h-full bg-neutral-100" viewBox="0 0 600 420" fill="none">
        <rect width="600" height="420" fill="#f5f5f3" />
        <rect x="80" y="120" width="120" height="140" stroke="#111111" strokeWidth="1" fill="#ffffff" />
        <rect x="240" y="120" width="120" height="140" stroke="#111111" strokeWidth="1" fill="#ffffff" />
        <rect x="400" y="120" width="120" height="140" stroke="#111111" strokeWidth="1" fill="#ffffff" />
        <line x1="300" y1="160" x2="300" y2="220" stroke="#782620" strokeWidth="2" />
        <line x1="270" y1="190" x2="330" y2="190" stroke="#782620" strokeWidth="2" />
        <text x="300" y="380" textAnchor="middle" fontFamily="monospace" fontSize="10" fill="#737373" letterSpacing="2">
          COMMUNITY RELIEF LOGISTICS
        </text>
      </svg>
    ),
  },
  {
    id: "photo-8",
    title: "Presbyterian Boys' and Girls' Brigade Inspection",
    category: "Youth & Children",
    date: "February 2026",
    aspect: "portrait",
    description:
      "Annual dress parade and ceremonial drill inspection conducted by Presbytery Brigade officers.",
    svgGraphic: (
      <svg className="w-full h-full bg-neutral-100" viewBox="0 0 500 650" fill="none">
        <rect width="500" height="650" fill="#ecece9" />
        <line x1="120" y1="100" x2="120" y2="520" stroke="#111111" strokeWidth="1" />
        <line x1="250" y1="100" x2="250" y2="520" stroke="#111111" strokeWidth="1" />
        <line x1="380" y1="100" x2="380" y2="520" stroke="#111111" strokeWidth="1" />
        <rect x="220" y="240" width="60" height="60" stroke="#782620" strokeWidth="1" fill="#ffffff" />
        <text x="250" y="620" textAnchor="middle" fontFamily="monospace" fontSize="10" fill="#737373" letterSpacing="2">
          BRIGADE PARADE GROUND
        </text>
      </svg>
    ),
  },
];

export function GalleryView() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);

  const filteredItems =
    selectedCategory === "All"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === selectedCategory);

  return (
    <div>
      {/* Category Filter Index */}
      <div className="border-b border-black mb-12">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 pb-4">
          <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
            Index:
          </span>
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`font-mono text-xs uppercase tracking-widest transition-colors py-1 cursor-pointer ${
                  isSelected
                    ? "text-black border-b border-black font-semibold"
                    : "text-neutral-500 hover:text-black"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Asymmetric Editorial Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
        {filteredItems.map((item, index) => {
          // Asymmetric column widths based on aspect and index
          const colSpan =
            item.aspect === "wide"
              ? "md:col-span-12"
              : item.aspect === "portrait"
              ? "md:col-span-5"
              : index % 2 === 0
              ? "md:col-span-7"
              : "md:col-span-7";

          return (
            <div
              key={item.id}
              className={`${colSpan} group cursor-pointer border border-neutral-300 hover:border-black transition-colors`}
              onClick={() => setActivePhoto(item)}
            >
              <div className="relative overflow-hidden bg-neutral-100 aspect-[16/10] flex items-center justify-center">
                {item.svgGraphic}
                <div className="absolute top-3 left-3 bg-white border border-black px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-black">
                  Plate {item.id.replace("photo-", "")}
                </div>
              </div>

              <div className="p-4 sm:p-5 border-t border-neutral-300 space-y-2 bg-white">
                <div className="flex items-center justify-between font-mono text-[11px] text-neutral-500">
                  <span className="uppercase tracking-widest text-[#782620]">
                    {item.category}
                  </span>
                  <span>{item.date}</span>
                </div>
                <h3 className="font-serif text-lg sm:text-xl text-black group-hover:underline">
                  {item.title}
                </h3>
                <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Plain, No-Frills Lightbox Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 sm:p-8"
          onClick={() => setActivePhoto(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white max-w-4xl w-full border border-black max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="border-b border-black p-4 flex items-center justify-between">
              <div className="font-mono text-xs uppercase tracking-widest text-neutral-500">
                Plate Detail / {activePhoto.category}
              </div>
              <button
                onClick={() => setActivePhoto(null)}
                className="font-mono text-xs uppercase tracking-wider border border-black px-3 py-1 text-black hover:bg-black hover:text-white transition-colors"
                aria-label="Close plate view"
              >
                Close &times;
              </button>
            </div>

            {/* Modal Image Frame */}
            <div className="bg-neutral-100 max-h-[55vh] flex items-center justify-center overflow-hidden">
              <div className="w-full aspect-[16/10] max-h-[55vh]">
                {activePhoto.svgGraphic}
              </div>
            </div>

            {/* Modal Metadata */}
            <div className="p-6 md:p-8 border-t border-black space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
                <h2 className="font-serif text-2xl md:text-3xl text-black">
                  {activePhoto.title}
                </h2>
                <span className="font-mono text-xs text-neutral-500 shrink-0">
                  {activePhoto.date}
                </span>
              </div>
              <p className="text-sm text-neutral-700 leading-relaxed max-w-2xl">
                {activePhoto.description}
              </p>
              <div className="pt-4 border-t border-neutral-200 flex justify-between items-center font-mono text-[11px] text-neutral-500">
                <span>PCEA Kileleshwa Archive</span>
                <span>Plate ID: {activePhoto.id}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
