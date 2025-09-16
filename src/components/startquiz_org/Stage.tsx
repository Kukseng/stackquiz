"use client";

import React from "react";

export default function Stage({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex items-center justify-center p-6"
      style={{ backgroundImage: "url('/bg_startquiz.jpg')" }}
    >
      {children} 
    </div>
  );
}
