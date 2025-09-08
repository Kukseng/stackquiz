"use client";

import React from "react";
import { samplePlayers } from "./data";
import Stage from "./Stage";

export default function Scoreboard() {
  return (
    <Stage>
      <div className="mx-auto grid max-w-[820px] gap-5">
        <div className="mx-auto w-[680px] max-w-full rounded-2xl border border-[#f5c46b] bg-black/25 px-8 py-4 text-center text-3xl font-extrabold text-white">
          Scoreboard
        </div>
        <div className="grid gap-4">
          {samplePlayers.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-2xl bg-white/90 px-5 py-4 text-[#2b2b2b]"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-content-center rounded-full bg-white text-xl">
                  {p.emoji}
                </div>
                <div className="font-semibold">{p.name}</div>
              </div>
              <div className="font-bold">{p.score}</div>
            </div>
          ))}
        </div>
      </div>
    </Stage>
  );
}
