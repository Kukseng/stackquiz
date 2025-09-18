"use client";

import React from "react";
import Pill from "./Pill";
import Stage from "./Stage";

export default function QuestionList() {
  return (
    <Stage>
      <div className="mx-auto grid max-w-[820px] gap-4">
        <div className="ml-auto mb-40">
          <Pill>1 of 10</Pill>
        </div>
        <div className="mx-auto w-full mb-40 rounded-2xl border border-[#f5c46b] bg-black/25 px-8 py-6 text-center text-2xl font-extrabold text-white">
          HTML Stands for
        </div>
      </div>
    </Stage>
  );
}
