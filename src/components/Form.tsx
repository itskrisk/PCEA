import React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export function Input({ className = "", error, ...props }: InputProps) {
  return (
    <input
      className={`w-full border border-black bg-white px-4 py-3 text-sm text-black placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-black rounded-none transition-colors ${
        error ? "border-red-700" : ""
      } ${className}`}
      {...props}
    />
  );
}

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export function Textarea({ className = "", error, rows = 5, ...props }: TextareaProps) {
  return (
    <textarea
      rows={rows}
      className={`w-full border border-black bg-white px-4 py-3 text-sm text-black placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-black rounded-none transition-colors resize-y ${
        error ? "border-red-700" : ""
      } ${className}`}
      {...props}
    />
  );
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  options?: { value: string; label: string }[];
}

export function Select({
  className = "",
  error,
  options,
  children,
  ...props
}: SelectProps) {
  return (
    <div className="relative w-full">
      <select
        className={`w-full appearance-none border border-black bg-white px-4 py-3 pr-10 text-sm text-black focus:outline-none focus:ring-1 focus:ring-black rounded-none transition-colors cursor-pointer ${
          error ? "border-red-700" : ""
        } ${className}`}
        {...props}
      >
        {options
          ? options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))
          : children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-black">
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="square"
            strokeLinejoin="miter"
            strokeWidth="1.5"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
}

export function Label({
  children,
  htmlFor,
  required,
  className = "",
}: {
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block font-mono text-xs uppercase tracking-wider text-neutral-800 mb-2 ${className}`}
    >
      {children}
      {required && <span className="ml-1 text-[#782620]">*</span>}
    </label>
  );
}

export function FormField({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`space-y-1 ${className}`}>{children}</div>;
}
