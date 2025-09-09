"use client";

import React from "react";
import Stage from "./Stage";
import { Users, Copy } from "lucide-react";
import QRCodeBox from "./QRCode";

export default function WaitParticipant() {
  const joinUrl = "Join my stackquiz.com";
  const joinCode = "989 249";

  const participants = [
    { name: "Dada", emoji: "😄" },
    { name: "Bobo", emoji: "👩🏻‍🦳" },
    { name: "Jira", emoji: "👧🏽" },
    { name: "Titi", emoji: "🧒🏼" },
  ];

  return (
    <Stage>
      <div className="mx-auto max-w-[980px]">
        {/* Tray */}
        <div className="relative flex items-stretch gap-6 rounded-[16px] bg-[#5b6fb6]/35 p-6 ring-1 ring-white/10">
          {/* Left: black instruction card */}
          <div className="flex-[3] rounded-[16px] bg-[#0f0f0f] px-6 py-6 shadow flex flex-col justify-center">
            {/* row 1 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="grid h-10 w-10 place-content-center rounded-full bg-[#6b4a4a] text-white text-base font-semibold">
                  1
                </span>
                <span className="text-white/90 text-lg leading-tight">
                  Join using
                  <br className="hidden md:block" /> any device
                </span>
              </div>
              <button
                title="Copy URL"
                className="inline-flex items-center gap-2 text-white"
              >
                <span className="hidden sm:inline font-semibold">
                  {joinUrl}
                </span>
                <Copy size={18} className="opacity-75 hover:opacity-100" />
              </button>
            </div>

            {/* divider */}
            <hr className="my-5 border-white/30" />

            {/* row 2 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="grid h-10 w-10 place-content-center rounded-full bg-[#6b4a4a] text-white text-base font-semibold">
                  2
                </span>
                <span className="text-white/90 text-lg leading-tight">
                  Enter the
                  <br className="hidden md:block" /> join code
                </span>
              </div>
              <button
                title="Copy join code"
                className="inline-flex items-center gap-3"
              >
                <span className="rounded-md bg-black/40 px-4 py-1.5 text-2xl font-extrabold tracking-widest text-white">
                  {joinCode}
                </span>
                <Copy size={18} className="text-white/75 hover:text-white" />
              </button>
            </div>
          </div>

          {/* Right: QR block */}
          <div className="flex-[1.2] rounded-[16px]  flex flex-col items-center justify-center">
            <div className="rounded-2xl bg-white p-3">
              <QRCodeBox className="h-40 w-40" />
            </div>
            <div className="mt-3 text-sm text-white/90">Scan to join</div>
          </div>
        </div>

        {/* Footer: Start + counter */}
        <div className="mt-6 flex items-center">
          <button className="rounded-full px-6 py-2 text-sm font-bold text-white shadow btn-text btn-secondary hover:opacity-90 transition">
            START
          </button>

          <div className="ml-auto inline-flex items-center gap-2 rounded-full bg-black/45 px-3 py-1.5 text-white/90 text-sm">
            <Users size={16} />
            <span>{participants.length}</span>
          </div>
        </div>

        {/* Avatars grid */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-x-10 gap-y-8">
          {participants.map((p, i) => (
            <div key={i} className="grid place-items-center">
              <div className="mb-3 font-semibold text-white">{p.name}</div>
              <div className="h-28 w-28 rounded-2xl bg-black/25 shadow-inner grid place-items-center">
                <div className="h-16 w-16 rounded-xl bg-white grid place-items-center text-3xl">
                  {p.emoji}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Stage>
  );
}
