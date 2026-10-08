import React from "react";

interface RuleProps {
  className?: string;
  variant?: "dark" | "light";
}

export function Rule({ className = "", variant = "dark" }: RuleProps) {
  const borderClass = variant === "dark" ? "border-black" : "border-neutral-300";
  return <hr className={`w-full border-t ${borderClass} my-0 ${className}`} />;
}

export function VerticalRule({ className = "", variant = "dark" }: RuleProps) {
  const borderClass = variant === "dark" ? "border-black" : "border-neutral-300";
  return <div className={`h-full w-px border-l ${borderClass} ${className}`} />;
}
