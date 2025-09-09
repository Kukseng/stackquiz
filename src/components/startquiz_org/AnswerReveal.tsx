"use client";

import React from "react";
import { IconTriangle } from "./Shapes";
import Stage from "./Stage";

export default function AnswerReveal() {
  return (
    <Stage>
      <div className="mx-auto grid max-w-[960px] gap-6">
        <div className="rounded-2xl border border-[#f5c46b] bg-black/25 px-8 py-4 text-center text-2xl font-extrabold text-white">
          HTML Stands for
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <button className="flex w-full items-center gap-3 rounded-2xl px-6 py-4 text-left text-base font-semibold text-white bg-[#e63946]/50 ring-2 ring-[#e63946]">
            <span className="grid h-5 w-5 place-content-center rounded-full bg-white/90 text-red-600">
              ◯
            </span>
            HyperText Make Language
          </button>
          <button className="flex w-full items-center gap-3 rounded-2xl px-6 py-4 text-left text-base font-semibold text-white bg-[#06d6a0] ring-2 ring-white">
            <span className="grid h-5 w-5 place-content-center rounded-full bg-white/90 text-emerald-700">
              <IconTriangle />
            </span>
            HyperText Markup Language
          </button>
          <button className="flex w-full items-center gap-3 rounded-2xl px-6 py-4 text-left text-base font-semibold text-white bg-[#118ab2]/40 ring-2 ring-[#118ab2]">
            <span className="grid h-5 w-5 place-content-center rounded-full bg-white/90 text-blue-600">
              ◆
            </span>
            HybridText Market Language
          </button>
          <button className="flex w-full items-center gap-3 rounded-2xl px-6 py-4 text-left text-base font-semibold text-white bg-[#06d6a0]/40 ring-2 ring-[#06d6a0]">
            <span className="grid h-5 w-5 place-content-center rounded-full bg-white/90 text-green-700">
              ◼︎
            </span>
            Hyperlink Type Make Language
          </button>
        </div>
      </div>
    </Stage>
  );
}
