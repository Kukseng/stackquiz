"use client";

import { useEffect, useRef } from "react";

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3; // lower volume
      audioRef.current.loop = true;
      audioRef.current.play().catch((err) => {
        console.log("Autoplay blocked:", err);
      });
    }
  }, []);

  return <audio ref={audioRef} src="/audio/background.mp3" preload="auto" />;
}
