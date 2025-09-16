"use client";

import React from "react";
import Stage from "./Stage";

export default function Podium() {
  return (
    <Stage>
      <div className="mx-auto grid max-w-[860px] gap-6">
        <div className="mx-auto w-[680px] max-w-full rounded-2xl border border-[#f5c46b] bg-black/25 px-8 py-4 text-center text-3xl font-extrabold text-white">
          Computer Science
        </div>

        <div className="grid place-items-center">
          <div className="flex items-end gap-6">
            {/* Second */}
            <div className="grid w-40 place-items-center gap-2">
              <div className="grid h-12 w-12 place-content-center rounded-full bg-white text-xl">
                👱🏼‍♀️
              </div>
              <div className="rounded-t-2xl bg-[#15406b] px-6 pb-4 pt-6 text-center text-white w-full">
                <div className="text-2xl font-bold">2</div>
                <div className="text-white/80">1969</div>
              </div>
            </div>
            {/* First */}
            <div className="grid w-44 place-items-center gap-2">
              <div className="relative grid h-12 w-12 place-content-center rounded-full bg-white text-xl">
                👩🏻‍🎓
                <div className="absolute -top-3 right-1 text-yellow-300">
                  👑
                </div>
              </div>
              <div className="rounded-t-2xl bg-[#ffb703] px-6 pb-6 pt-8 text-center text-white w-full">
                <div className="text-3xl font-extrabold">1</div>
                <div className="text-white/90">2840</div>
              </div>
            </div>
            {/* Third */}
            <div className="grid w-36 place-items-center gap-2">
              <div className="grid h-12 w-12 place-content-center rounded-full bg-white text-xl">
                🧒🏽
              </div>
              <div className="rounded-t-2xl bg-[#1c69b4] px-6 pb-3 pt-5 text-center text-white w-full">
                <div className="text-2xl font-bold">3</div>
                <div className="text-white/80">784</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Stage>
  );
}
