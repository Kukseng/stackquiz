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
  playCorrect: () => void;
  playTimeUp: () => void;
  pauseMusic: () => void;
  resumeMusic: () => void;
  nextBackground: () => void;
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
  const backgroundRefs = useRef<HTMLAudioElement[]>([]);
  const clickRef = useRef<HTMLAudioElement | null>(null);
  const wrongRef = useRef<HTMLAudioElement | null>(null);
  const correctRef = useRef<HTMLAudioElement | null>(null);
  const timeupRef = useRef<HTMLAudioElement | null>(null);

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const [muted, setMuted] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized) return;

    backgroundRefs.current = [
      new Audio("/sound/background.mp3"),
      new Audio("/sound/background01.mp3"),
      new Audio("/sound/background02.mp3"),
    ];

    backgroundRefs.current.forEach((bg) => {
      bg.loop = true;
      bg.volume = 0.2;
      bg.muted = false;
    });

    clickRef.current = new Audio("/sound/click.wav");
    wrongRef.current = new Audio("/sound/wrong.wav");
    correctRef.current = new Audio("/sound/correct.wav");
    timeupRef.current = new Audio("/sound/timeup.wav");

    setInitialized(true);
  }, [initialized]);

  const getCurrentTrack = () => backgroundRefs.current[currentTrackIndex];

  const unlockAudio = () => {
    if (unlocked) return;
    const bg = getCurrentTrack();
    if (!bg) return;

    console.log("🎧 Trying to unlock audio...");

    // must be called inside a user gesture
    bg.play()
      .then(() => {
        console.log("✅ Background music playing");
      })
      .catch((err) => {
        console.error("🚨 Autoplay blocked:", err);
      });

    // preload other sounds silently
    [
      clickRef.current,
      wrongRef.current,
      correctRef.current,
      timeupRef.current,
    ].forEach((a) => {
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
  };

  const playClick = () => {
    if (!muted && clickRef.current) {
      clickRef.current.currentTime = 0;
      clickRef.current.play();
    }
  };

  const playWrong = () => {
    if (!muted && wrongRef.current) {
      // ✅ ensure no click overlaps
      clickRef.current?.pause();
      clickRef.current!.currentTime = 0;

      wrongRef.current.currentTime = 0;
      wrongRef.current.play();
    }
  };

  const playCorrect = () => {
    if (!muted && correctRef.current) {
      correctRef.current.currentTime = 0;
      correctRef.current.play();
    }
  };

  const playTimeUp = () => {
    if (!muted && timeupRef.current) {
      timeupRef.current.currentTime = 0;
      timeupRef.current.play();
    }
  };

  const pauseMusic = () => getCurrentTrack()?.pause();

  const resumeMusic = () => {
    const bg = getCurrentTrack();
    if (!muted && bg) {
      bg.play().catch((err) => console.warn("⚠️ resume failed:", err));
    }
  };

  const nextBackground = () => {
    const current = getCurrentTrack();
    current?.pause();
    const nextIndex = (currentTrackIndex + 1) % backgroundRefs.current.length;
    setCurrentTrackIndex(nextIndex);
    const next = backgroundRefs.current[nextIndex];
    if (next && !muted) next.play();
  };

  const toggleMute = () => {
    setMuted((prev) => {
      const newVal = !prev;
      backgroundRefs.current.forEach((bg) => (bg.muted = newVal));
      return newVal;
    });
  };

  return (
    <AudioContext.Provider
      value={{
        unlockAudio,
        playClick,
        playWrong,
        playCorrect,
        playTimeUp,
        pauseMusic,
        resumeMusic,
        nextBackground,
        toggleMute,
        muted,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}
