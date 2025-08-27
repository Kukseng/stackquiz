"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import InputArea from "@/components/joinroom/InputArea";

export default function JoinRoomHero() {
  const [code, setCode] = React.useState("");
  const router = useRouter();

  const onSubmit = () => {
    const clean = code.trim();
    if (!clean) return;
    router.push(`/room/${encodeURIComponent(clean)}`);
  };

  return (
    <div
      className="relative min-h-dvh overflow-clip cosmic-bg"
      style={{
        marginLeft: "calc(var(--padding-x) * -1)",
        marginRight: "calc(var(--padding-x) * -1)",
      }}
    >
      {/* LEFT wavy — bottom-left, tucked under left ring */}
      <img
        src="/wavy.svg"
        alt=""
        aria-hidden
        draggable={false}
        className="
    pointer-events-none select-none absolute z-0
    left-[-220px] bottom-[-640px] w-[840px] opacity-80 rotate-z-180
  "
      />

      {/* RIGHT wavy — just above the right ring (mirrored) */}
      <img
        src="/wavy.svg"
        alt=""
        aria-hidden
        draggable={false}
        className="
          pointer-events-none select-none absolute z-0
          right-[-100px] bottom-[420px] w-[540px] opacity-80 scale-z-[-1]
        "
      />

      {/* --- Star field --- */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(1px 1px at 12% 18%, rgba(255,255,255,.95) 98%, transparent) repeat,
            radial-gradient(1px 1px at 38% 62%, rgba(255,255,255,.85) 98%, transparent) repeat,
            radial-gradient(2px 2px at 72% 28%, rgba(70, 230, 255, .9) 98%, transparent) repeat,
            radial-gradient(2px 2px at 30% 78%, rgba(110, 190, 255, .85) 98%, transparent) repeat,
            radial-gradient(2px 2px at 22% 88%, rgba(255, 180, 95, .9) 98%, transparent) repeat,
            radial-gradient(2px 2px at 84% 64%, rgba(238, 146, 78, .9) 98%, transparent) repeat
          `,
          backgroundSize:
            "260px 260px, 320px 320px, 520px 520px, 580px 580px, 540px 540px, 600px 600px",
          opacity: 0.7,
          maskImage:
            "radial-gradient(80% 80% at 50% 45%, rgba(0,0,0,1) 65%, rgba(0,0,0,.3) 85%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage:
            "radial-gradient(80% 80% at 50% 45%, rgba(0,0,0,1) 65%, rgba(0,0,0,.3) 85%, rgba(0,0,0,0) 100%)",
        }}
      />

      {/* --- Big circles --- */}
      <img
        src="/circle3d.svg"
        alt=""
        aria-hidden
        loading="eager"
        draggable={false}
        className="pointer-events-none absolute z-0 left-[-340px] top-[-100px] h-[620px] w-[620px] opacity-80"
      />
      <img
        src="/circle3d.svg"
        alt=""
        aria-hidden
        loading="eager"
        draggable={false}
        className="pointer-events-none absolute z-0 right-[-240px] bottom-[-220px] h-[620px] w-[620px] opacity-80"
      />

      {/* Content */}
      <main className="relative z-10 mx-auto grid min-h-dvh max-w-[1200px] place-items-center px-4 pt-[96px]">
        <section className="w-full max-w-[720px]">
          {/* Logo + StackQuiz on one line */}
          <div className="mb-7 flex items-center justify-center gap-4">
            <img
              src="/logo_Stack_Quiz-v2.png"
              alt="StackQuizz Logo"
              className="h-[64px] w-[64px] drop-shadow-[0_8px_16px_rgba(0,0,0,0.25)]"
              draggable={false}
            />
            <h1 className="text-[32px] md:text-[40px] font-extrabold tracking-[0.3px]">
              <span className="text-white/95">STACK</span>
              <span className="ml-1 text-[#FFC821]">QUIZZ</span>
            </h1>
          </div>

          {/* Input area */}
          <InputArea
            value={code}
            onChange={setCode}
            onSubmit={onSubmit}
            placeholder="Enter Code..."
            iconSrc="/gameButton.svg"
            iconAlt="Room code"
            buttonLabel="Start"
            buttonDisabled={!code.trim()}
          />
        </section>
      </main>
    </div>
  );
}
