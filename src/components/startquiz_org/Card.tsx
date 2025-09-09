import React from "react";

export default function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl bg-[#0f112b]/20 ring-1 ring-white/10 backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  );
}
