"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
// import { useRouter } from "next/navigation";
import { motion} from "framer-motion";
import InputArea from "@/components/joinroom/InputArea";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import en from "@/locales/en.json";
import kh from "@/locales/km.json";

export default function JoinRoomHero() {
  const [code, setCode] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
   const { language} = useLanguage();
  const t = language === "en" ? en.inputArea : kh.inputArea;
  const fontClass = language === "en" ? "en-font" : "kh-font";

  const onSubmit = async () => {
    const clean = code.trim();
    if (!clean) return;

    setIsLoading(true);

    // Simulate API validation (replace with actual validation)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    router.push(`/room/${encodeURIComponent(clean)}`);
  };

  // Background decoration components
  const BackgroundDecorations = () => (
    <>
      {/* Animated wavy elements */}
      <motion.div
        className="absolute left-[-220px] bottom-[-340px] w-[540px] h-[540px] opacity-60 pointer-events-none select-none -z-10"
        initial={{ rotate: 0, scale: 0.8 }}
        animate={{
          rotate: 360,
          scale: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
          scale: { duration: 10, repeat: Infinity, repeatType: "reverse" },
        }}
      >
        <Image
          src="/wavy.svg"
          alt=""
          aria-hidden="true"
          draggable={false}
          fill
          style={{ objectFit: "contain" }}
        />
      </motion.div>

      <motion.div
        className="absolute right-[-110px] bottom-[420px] w-[340px] h-[340px] opacity-60 -scale-x-100 pointer-events-none select-none -z-10"
        initial={{ rotate: 0 }}
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        <Image
          src="/wavy.svg"
          alt=""
          aria-hidden="true"
          draggable={false}
          fill
          style={{ objectFit: "contain" }}
        />
      </motion.div>

      {/* Pulsing circles */}
      <motion.div
        className="absolute left-[-340px] top-[-100px] w-[620px] h-[620px] opacity-40 pointer-events-none select-none -z-10"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Image
          src="/circle3d.svg"
          alt=""
          aria-hidden="true"
          draggable={false}
          fill
          style={{ objectFit: "contain" }}
        />
      </motion.div>

      <motion.div
        className="absolute right-[-240px] bottom-[-220px] w-[620px] h-[620px] opacity-40 pointer-events-none select-none -z-10"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      >
        <Image
          src="/circle3d.svg"
          alt=""
          aria-hidden="true"
          draggable={false}
          fill
          style={{ objectFit: "contain" }}
        />
      </motion.div>

      {/* floating particles */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-yellow-400/30 rounded-full pointer-events-none"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [-10, -30, -10],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );

  return (
    <div className={`relative min-h-screen overflow-hidden ${fontClass}`}>
      <BackgroundDecorations />

      {/* Main Content */}
      <main className="relative z-10 flex min-h-screen items-center justify-center px-4 pt-24">
        <motion.section
          className="w-full max-w-4xl text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Logo and Title */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Image
                  src="/logo-sq.png"
                  alt="StackQuiz Logo"
                  width={80}
                  height={80}
                  className="drop-shadow-2xl"
                  draggable={false}
                />
              </motion.div>

              <motion.h1
                className="text-4xl md:text-6xl font-extrabold tracking-wider"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <span className="text-white">STACK</span>
                <motion.span
                  className="ml-2 text-yellow-400"
                  animate={{
                    textShadow: [
                      "0 0 5px rgba(250, 204, 21, 0.5)",
                      "0 0 20px rgba(250, 204, 21, 0.8)",
                      "0 0 5px rgba(250, 204, 21, 0.5)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  QUIZ
                </motion.span>
              </motion.h1>
            </div>

            <motion.p
              className="text-lg md:text-xl text-white/80 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {t.join}
            </motion.p>
          </motion.div>

          {/* Input Area */}
          <InputArea
            value={code}
            onChange={setCode}
            onSubmit={onSubmit}
            placeholder={t.placeholder}
            iconSrc="/gameButton.svg"
            iconAlt="Room code"
            buttonLabel={t.label}
            buttonDisabled={!code.trim()}
            isLoading={isLoading}
          />

          {/* Additional Info */}
          <motion.div
            className="mt-16 space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-8 text-white/60">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm">Live Quizzes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
                <span className="text-sm">Real-time Results</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" />
                <span className="text-sm">Multiplayer Fun</span>
              </div>
            </div>
          </motion.div>
        </motion.section>
      </main>

      {/* Custom styles for shake animation */}
      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
