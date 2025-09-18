"use client";

import React from "react";
import { IconTriangle } from "./Shapes";
import Stage from "./Stage";

export default function AnswerReveal() {
  return (
    <Stage>
      <div className="mx-auto grid max-w-[960px] gap-8 ">
        {/* Question Box */}
        <div className="mx-auto w-full max-w-2xl rounded-lg mb-50 border border-yellow-400 bg-[#1a2a5a] px-8 py-5 text-center text-3xl font-extrabold text-white shadow-md">
          HTML Stands for
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Red */}
          <button className="flex w-full items-center gap-3 rounded-lg px-6 py-5 text-left text-lg font-bold text-white bg-red-600 shadow-md hover:opacity-90 transition">
            <span className="grid h-7 w-7 place-content-center rounded-full bg-white text-red-600 font-bold">
              ◯
            </span>
            HyperText Make Language
          </button>

          {/* Orange */}
          <button className="flex w-full items-center gap-3 rounded-lg px-6 py-5 text-left text-lg font-bold text-white bg-orange-500 shadow-md hover:opacity-90 transition">
            <span className="grid h-7 w-7 place-content-center rounded-full bg-white text-orange-600 font-bold">
              <IconTriangle />
            </span>
            HyperText Markup Language
          </button>

          {/* Blue */}
          <button className="flex w-full items-center gap-3 rounded-lg px-6 py-5 text-left text-lg font-bold text-white bg-blue-700 shadow-md hover:opacity-90 transition">
            <span className="grid h-7 w-7 place-content-center rounded-full bg-white text-blue-600 font-bold">
              ◼︎
            </span>
            HybridText Market Language
          </button>

          {/* Green */}
          <button className="flex w-full items-center gap-3 rounded-lg px-6 py-5 text-left text-lg font-bold text-white bg-green-600 shadow-md hover:opacity-90 transition">
            <span className="grid h-7 w-7 place-content-center rounded-full bg-white text-green-700 font-bold">
              ◆
            </span>
            Hyperlink Type Make Language
          </button>
        </div>
      </div>
    </Stage>
  );
}
