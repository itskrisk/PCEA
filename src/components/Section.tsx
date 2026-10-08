import React from "react";
import { Rule } from "./Rule";

interface SectionProps {
  id?: string;
  number?: string;
  label?: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
  topRule?: boolean;
  bottomRule?: boolean;
  layout?: "split" | "full" | "stacked";
}

export function Section({
  id,
  number,
  label,
  title,
  children,
  className = "",
  topRule = true,
  bottomRule = false,
  layout = "full",
}: SectionProps) {
  return (
    <section id={id} className={`w-full ${className}`}>
      {topRule && <Rule />}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 md:py-24">
        {layout === "split" && (number || label || title) ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-neutral-500">
                {number && <span className="text-[#782620]">{number}</span>}
                {number && label && <span>/</span>}
                {label && <span>{label}</span>}
              </div>
              {title && (
                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-normal leading-[1.08] tracking-tight text-black">
                  {title}
                </h2>
              )}
            </div>
            <div className="lg:col-span-8">{children}</div>
          </div>
        ) : (
          <div>
            {(number || label || title) && (
              <div className="mb-12 space-y-3">
                <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-neutral-500">
                  {number && <span className="text-[#782620]">{number}</span>}
                  {number && label && <span>/</span>}
                  {label && <span>{label}</span>}
                </div>
                {title && (
                  <h2 className="font-serif text-3xl md:text-5xl font-normal leading-[1.08] tracking-tight text-black">
                    {title}
                  </h2>
                )}
              </div>
            )}
            {children}
          </div>
        )}
      </div>
      {bottomRule && <Rule />}
    </section>
  );
}
