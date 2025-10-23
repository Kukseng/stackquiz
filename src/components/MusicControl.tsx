"use client";

import { useAudio } from "@/providers/AudioProvider";
import { useState } from "react";

export default function MusicControl() {
  const { music } = useAudio();
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => music.toggle()}
        onContextMenu={(e) => {
          e.preventDefault();
          setShow((s) => !s);
        }}
        className="h-9 px-3 rounded-full bg-gray-900 text-white text-sm"
        title="Left-click: Play/Pause, Right-click: Options"
      >
        {music.playing ? "Music: On" : "Music: Off"}
      </button>

      {show && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border bg-white p-3 shadow-lg">
          <label className="flex items-center justify-between text-sm mb-2">
            <span>Mute</span>
            <input
              type="checkbox"
              checked={music.muted}
              onChange={(e) => music.setMuted(e.target.checked)}
            />
          </label>
          <div>
            <div className="text-sm mb-1">
              Volume: {(music.volume * 100) | 0}%
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={music.volume}
              onChange={(e) => music.setVolume(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}
