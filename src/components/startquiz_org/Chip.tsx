// src/components/Chip.tsx
"use client";
import { ReactNode } from "react";

type ChipProps = {
  children: ReactNode;
  color?: "default" | "green" | "red" | "yellow";
};

/** small pill tag for labels like difficulty, time, questions */
export function Chip({ children, color = "default" }: ChipProps) {
  const m = {
    default: "bg-white/15 text-white",
    green: "bg-emerald-500/90 text-white",
    red: "bg-rose-500/90 text-white",
    yellow: "bg-amber-400/90 text-black",
  }[color];

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${m}`}
    >
      {children}
    </span>
  );
}
