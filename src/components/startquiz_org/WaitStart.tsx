"use client";

import React from "react";
import Stage from "./Stage";

export default function WaitStart() {
  return (
    <Stage>
      <div className="grid min-h-[520px] place-content-center">
        <div className="relative grid place-items-center gap-8">
          {/* Logo positioned to overlap the box */}
          <img
            src="/logo-sq.png"
            alt="Quiz Logo"
            width={110}
            height={110}
            className="drop-shadow-lg absolute -top-14"
          />

          {/* The quiz box with yellow border */}
          <div className="w-[680px] h-[50px] max-w-full rounded-2xl border border-amber-300 bg-black/35 px-8 py-12 text-center text-3xl font-extrabold text-white ring-1 ring-white/10">
            Quiz
          </div>
        </div>
      </div>
    </Stage>
  );
}
