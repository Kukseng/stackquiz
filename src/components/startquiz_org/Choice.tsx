"use client";

import React from "react";
import Stage from "./Stage";
import { FaCircle, FaSquare, FaDiamond } from "react-icons/fa6";
import { IoTriangle } from "react-icons/io5";

// Render icon based on name
const renderIcon = (icon: string) => {
  switch (icon) {
    case "circle":
      return <FaCircle className="text-white" size={28} />;
    case "triangle":
      return <IoTriangle className="text-white" size={28} />;
    case "square":
      return <FaSquare className="text-white" size={28} />;
    case "diamond":
      return <FaDiamond className="text-white" size={28} />;
    default:
      return null;
  }
};

interface OptionButtonProps {
  text: string;
  color: string;
  icon: string;
  correct?: boolean;
}

const OptionButton: React.FC<OptionButtonProps> = ({ text, color, icon}) => (
  <button
  className={`flex w-full items-center justify-between rounded-2xl px-16 py-6 text-left text-base font-semibold text-white shadow-lg transition`}
  style={{ backgroundColor: color }}
>
  {/* Left side: Only Icon */}
  <div className="flex items-center">
    {renderIcon(icon)}
  </div>

  {/* Middle: Text */}
  <div className="flex-1 text-center">
    <span>{text}</span>
  </div>

  {/* Right side (optional something else) */}
  <div></div>
</button>
);

export default function Choice() {
  const options = [
    { text: "HyperText Make Language", color: "#e63946", icon: "circle" },
    { text: "HyperText Markup Language", color: "#ff9f1c", icon: "triangle", correct: true },
    { text: "HybridText Market Language", color: "#118ab2", icon: "square" },
    { text: "Hyperlink Type Make Language", color: "#06d6a0", icon: "diamond" },
  ];

  return (
    <Stage>
      <div className="mx-auto grid max-w-7xl gap-6">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <div className="rounded-full bg-white/10 px-3 py-1 text-white/80">End</div>
          <div className="rounded-full bg-white/10 px-3 py-1 text-white/80">Skip</div>
        </div>

        {/* Question */}
        <div className="rounded-2xl border border-[#f5c46b] bg-black/25 px-8 py-4 text-center text-2xl font-extrabold text-white">
          HTML Stands for
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {options.map((opt, idx) => (
            <OptionButton
              key={idx}
              text={opt.text}
              color={opt.color}
              icon={opt.icon}
              correct={opt.correct}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="grid place-content-center rounded-full bg-gradient-to-b from-[#6a5af9] to-[#4735d4] h-16 w-16 text-white text-2xl font-bold">
            5
          </div>
          <div className="rounded-full bg-white/10 px-3 py-1 text-white/80">Answers 0</div>
        </div>
      </div>
    </Stage>
  );
}
