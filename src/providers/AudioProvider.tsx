"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  ReactNode,
} from "react";

type AudioCtx = {
  unlockAudio: () => void;
  playClick: () => void;
  playWrong: () => void;
  pauseMusic: () => void;
  resumeMusic: () => void;
  toggleMute: () => void;
  muted: boolean;
};

const AudioContext = createContext<AudioCtx | null>(null);

export const useAudio = () => {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error("useAudio must be used inside AudioProvider");
  return ctx;
};

export default function AudioProvider({ children }: { children: ReactNode }) {
  const backgroundRef = useRef<HTMLAudioElement | null>(null);
  const clickRef = useRef<HTMLAudioElement | null>(null);
  const wrongRef = useRef<HTMLAudioElement | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    backgroundRef.current = new Audio("/audio/background.mp3");
    backgroundRef.current.loop = true;
    backgroundRef.current.volume = 0.35;

    clickRef.current = new Audio("/audio/click.mp3");
    wrongRef.current = new Audio("/audio/wrong.mp3");
  }, []);

  const unlockAudio = () => {
    if (unlocked) return;
    const sounds = [backgroundRef.current, clickRef.current, wrongRef.current];
    sounds.forEach((a) => {
      if (a) {
        a.play()
          .then(() => {
            a.pause();
            a.currentTime = 0;
          })
          .catch(() => {});
      }
    });
    setUnlocked(true);
    backgroundRef.current?.play().catch(() => {});
  };

  const playClick = () => {
    if (clickRef.current && !muted) {
      clickRef.current.currentTime = 0;
      clickRef.current.play();
    }
  };

  const playWrong = () => {
    if (wrongRef.current && !muted) {
      wrongRef.current.currentTime = 0;
      wrongRef.current.play();
    }
  };

  const pauseMusic = () => backgroundRef.current?.pause();
  const resumeMusic = () => {
    if (!muted) backgroundRef.current?.play();
  };
  const toggleMute = () => {
    setMuted((prev) => {
      const newVal = !prev;
      if (backgroundRef.current) {
        backgroundRef.current.muted = newVal;
      }
      return newVal;
    });
  };

  return (
    <AudioContext.Provider
      value={{
        unlockAudio,
        playClick,
        playWrong,
        pauseMusic,
        resumeMusic,
        toggleMute,
        muted,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}
