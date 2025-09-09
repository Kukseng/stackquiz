"use client";

import React from "react";
import Stage from "./Stage";

export default function Countdown() {
  return (
    <Stage>
      <div className="grid min-h-[520px] place-content-center">
        <div className="mx-auto grid h-56 w-56 place-content-center rounded-full bg-gradient-to-b from-[#6a5af9] to-[#4735d4] text-6xl font-extrabold text-white shadow-2xl">
          3
        </div>
      </div>
    </Stage>
  );
}
