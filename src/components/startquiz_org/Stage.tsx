"use client";

import React from "react";

export default function Stage({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex items-center justify-center p-6"
      style={{ backgroundImage: "url('/bg_startquiz.jpg')" }}
    >
      <div className="w-full max-w-[1100px] rounded-3xl bg-black/40 shadow-lg ring-1 ring-white/10 backdrop-blur-sm p-6 md:p-10">
        {children}
      </div>
    </div>
  );
}
