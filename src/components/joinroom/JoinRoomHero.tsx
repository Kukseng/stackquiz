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
    <div>
      {/* LEFT wavy — bottom-left, tucked under left ring */}
      <img
        src="/wavy.svg"
        alt=""
        aria-hidden
        draggable={false}
        className="
          pointer-events-none select-none absolute z-0
        left-[-220px] bottom-[-340px] w-[540px] opacity-80 rotate-z-180"
      />

      {/* RIGHT wavy — just above the right ring (mirrored) */}
      <img
        src="/wavy.svg"
        alt=""
        aria-hidden
        draggable={false}
        className="
          pointer-events-none select-none absolute z-0
          right-[-110px] bottom-[420px] w-[340px] opacity-80 scale-z-[-1]
        "
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
              <span className="text-white">STACK</span>
              <span className="ml-1 text-yellow">QUIZZ</span>
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
