import React from "react";
import Link from "next/link";

interface ButtonBaseProps {
  variant?: "solid" | "outline";
  size?: "default" | "sm" | "lg";
  className?: string;
  children: React.ReactNode;
}

type ButtonAsButton = ButtonBaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsLink = ButtonBaseProps & {
  href: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({
  variant = "solid",
  size = "default",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-mono text-xs uppercase tracking-widest transition-colors duration-150 rounded-none cursor-pointer border border-black select-none disabled:opacity-50 disabled:pointer-events-none";

  const sizeStyles = {
    sm: "px-4 py-2 text-[11px]",
    default: "px-6 py-3.5 text-xs",
    lg: "px-8 py-4 text-xs tracking-[0.2em]",
  }[size];

  const variantStyles = {
    solid: "bg-black text-white hover:bg-neutral-800",
    outline: "bg-transparent text-black hover:bg-black hover:text-white",
  }[variant];

  const combinedStyles = `${baseStyles} ${sizeStyles} ${variantStyles} ${className}`;

  if ("href" in props && props.href) {
    const { href, ...linkProps } = props as ButtonAsLink;
    return (
      <Link href={href} className={combinedStyles} {...linkProps}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedStyles} {...(props as ButtonAsButton)}>
      {children}
    </button>
  );
}
