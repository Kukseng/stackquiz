"use client";

import { useAudio } from "@/providers/AudioProvider";
import { Volume2, VolumeX } from "lucide-react";

export function MuteButton() {
  const { toggleMute, muted } = useAudio();
  return (
    <button
      onClick={toggleMute}
      className="fixed top-4 right-4 bg-white/20 p-2 rounded-full backdrop-blur-md text-white hover:bg-white/30 transition"
      aria-label="Mute or unmute background music"
    >
      {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
    </button>
  );
}
