"use client";

import React from "react";
import Stage from "./Stage";
import { IconCircle, IconTriangle, IconDiamond, IconSquare } from "./Shapes";

const colors = {
  red: "bg-[#e63946] hover:bg-[#d62839]",
  orange: "bg-[#ff9f1c] hover:bg-[#fb8b24]",
  blue: "bg-[#118ab2] hover:bg-[#0f7a9f]",
  green: "bg-[#06d6a0] hover:bg-[#05c191]",
};

const Button = ({
  children,
  color,
}: {
  children: React.ReactNode;
  color: keyof typeof colors;
}) => (
  <button
    className={`flex w-full items-center gap-3 rounded-2xl px-6 py-4 text-left text-base font-semibold text-white shadow-lg transition ${colors[color]}`}
  >
    {children}
  </button>
);

export default function Choice() {
  return (
    <Stage>
      <div className="mx-auto grid max-w-[960px] gap-6">
        <div className="flex items-center justify-between">
          <div className="rounded-full bg-white/10 px-3 py-1 text-white/80">
            End
          </div>
          <div className="rounded-full bg-white/10 px-3 py-1 text-white/80">
            Skip
          </div>
        </div>
        <div className="rounded-2xl border border-[#f5c46b] bg-black/25 px-8 py-4 text-center text-2xl font-extrabold text-white">
          HTML Stands for
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Button color="red">
            <span className="grid h-5 w-5 place-content-center rounded-full bg-white/90 text-red-600">
              <IconCircle />
            </span>
            HyperText Make Language
          </Button>
          <Button color="orange">
            <span className="grid h-5 w-5 place-content-center rounded-full bg-white/90 text-orange-600">
              <IconTriangle />
            </span>
            HyperText Markup Language
          </Button>
          <Button color="blue">
            <span className="grid h-5 w-5 place-content-center rounded-full bg-white/90 text-blue-600">
              <IconDiamond />
            </span>
            HybridText Market Language
          </Button>
          <Button color="green">
            <span className="grid h-5 w-5 place-content-center rounded-full bg-white/90 text-green-700">
              <IconSquare />
            </span>
            Hyperlink Type Make Language
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="grid place-content-center rounded-full bg-gradient-to-b from-[#6a5af9] to-[#4735d4] h-16 w-16 text-white text-2xl font-bold">
            5
          </div>
          <div className="rounded-full bg-white/10 px-3 py-1 text-white/80">
            Answers 0
          </div>
        </div>
      </div>
    </Stage>
  );
}
