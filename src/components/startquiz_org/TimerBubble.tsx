"use client";

import React from "react";

export default function TimerBubble({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="grid h-16 w-16 place-content-center rounded-full bg-gradient-to-b from-[#6a5af9] to-[#4735d4] text-white text-2xl font-bold shadow-lg"
      >
        {value}
      </div>
    </div>
  );
}
