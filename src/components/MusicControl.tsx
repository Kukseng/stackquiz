"use client";

import { useAudio } from "@/providers/AudioProvider";
import { useState, useEffect } from "react";

export default function MusicControl() {
  const { toggleMute, muted, pauseMusic, resumeMusic } = useAudio();
  const [show, setShow] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  // 🧭 Sync UI with mute state
  useEffect(() => {
    if (muted && isPlaying) {
      setIsPlaying(false);
    }
  }, [muted, isPlaying]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      pauseMusic();
    } else {
      resumeMusic();
    }
    setIsPlaying((prev) => !prev);
  };

  const handleToggleMute = () => {
    toggleMute();
    if (!muted && !isPlaying) {
      // 🪄 auto resume if user unmutes while music is paused
      resumeMusic();
      setIsPlaying(true);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleTogglePlay}
        onContextMenu={(e) => {
          e.preventDefault();
          setShow((s) => !s);
        }}
        className="h-9 px-3 rounded-full bg-gray-900 text-white text-sm"
        title="Left-click: Play/Pause, Right-click: Options"
      >
        {muted || !isPlaying ? "Music: Off" : "Music: On"}
      </button>

      {show && (
        <div className="absolute right-0 mt-2 w-44 rounded-xl border bg-white p-3 shadow-lg">
          <label className="flex items-center justify-between text-sm mb-2">
            <span>Mute</span>
            <input
              type="checkbox"
              checked={muted}
              onChange={handleToggleMute}
            />
          </label>
          <p className="text-xs text-gray-500 text-center">
            Right-click to toggle options
          </p>
        </div>
      )}
    </div>
  );
}
