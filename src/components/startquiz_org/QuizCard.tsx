"use client";

import React from "react";
import Image from "next/image";
import Card from "./Card";

type Props = {
  title: string;
  level: "Easy" | "Medium" | "Hard";
  questions: number;
  duration: string;
  image?: string;
  onStart?: () => void;
};

const levelColor: Record<Props["level"], string> = {
  Easy: "bg-emerald-500",
  Medium: "bg-yellow-500",
  Hard: "bg-rose-500",
};

export default function QuizCard({
  title,
  level,
  questions,
  duration,
  image,
}: Props) {
  return (
    <Card className="overflow-hidden rounded-xl">
      {image && (
        <div className="relative h-40 w-full">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.02))]"></div>
        </div>
      )}

      <div className="space-y-2 p-4">
        <div className="text-white font-semibold">{title}</div>

        <div className="flex items-center justify-between text-xs text-white/70">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold text-black ${levelColor[level]}`}
            >
              {level}
            </span>
            <span>{questions} questions</span>
          </div>

          <div className="flex items-center gap-1">
            <span>⏱</span>
            <span>{duration}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
