"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import InputArea from "@/components/joinroom/InputArea";
import Image from "next/image";

export default function JoinRoomHero() {
  const [code, setCode] = React.useState("");
  const router = useRouter();

  const onSubmit = () => {
    const clean = code.trim();
    if (!clean) return;
    router.push(`/room/${encodeURIComponent(clean)}`);
  };

  return (
    <div className="relative">
      {/* LEFT wavy — bottom-left */}
      <div className="absolute left-[-220px] bottom-[-340px] w-[540px] h-[540px] opacity-80 rotate-180 pointer-events-none select-none -z-10">
        <Image
          src="/wavy.svg"
          alt=""
          aria-hidden="true"
          draggable={false}
          fill
          style={{ objectFit: "contain" }}
        />
      </div>

      {/* RIGHT wavy — mirrored */}
      <div className="absolute right-[-110px] bottom-[420px] w-[340px] h-[340px] opacity-80 -scale-x-100 pointer-events-none select-none -z-10">
        <Image
          src="/wavy.svg"
          alt=""
          aria-hidden="true"
          draggable={false}
          fill
          style={{ objectFit: "contain" }}
        />
      </div>

      {/* Big circle top-left */}
      <div className="absolute left-[-340px] top-[-100px] w-[620px] h-[620px] opacity-80 pointer-events-none select-none -z-10">
        <Image
          src="/circle3d.svg"
          alt=""
          aria-hidden="true"
          draggable={false}
          fill
          style={{ objectFit: "contain" }}
        />
      </div>

      {/* Big circle bottom-right */}
      <div className="absolute right-[-240px] bottom-[-220px] w-[620px] h-[620px] opacity-80 pointer-events-none select-none -z-10">
        <Image
          src="/circle3d.svg"
          alt=""
          aria-hidden="true"
          draggable={false}
          fill
          style={{ objectFit: "contain" }}
        />
      </div>

      {/* Content */}
      <main className="relative z-10 mx-auto grid min-h-screen max-w-[1200px] place-items-center px-4 pt-[96px]">
        <section className="w-full max-w-[720px]">
          {/* Logo + StackQuiz */}
          <div className="mb-7 flex items-center justify-center gap-4">
            <Image
              src="/logo_Stack_Quiz-v2.png"
              alt="StackQuizz Logo"
              className="h-[64px] w-[64px] drop-shadow-[0_8px_16px_rgba(0,0,0,0.25)]"
              draggable={false}
              width={64}
              height={64}
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
