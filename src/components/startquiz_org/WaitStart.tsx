"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Stage from "./Stage";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function WaitStart() {
  const router = useRouter();
  const letters = ["Q", "u", "i", "z"];

  // Parent animation (controls stagger)
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3, // delay each letter
      },
    },
  };

  // Child animation (each letter)
  const item = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  // Redirect after 3s
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/startquiz_org/question-list");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <Stage>
      <div className="grid min-h-[520px] place-content-center">
        <div className="relative grid place-items-center gap-8">
          {/* Logo */}
          <div className="absolute -top-14">
            <Image
              src="/logo-sq.png"
              alt="Quiz Logo"
              width={110}
              height={110}
              className="drop-shadow-lg"
            />
          </div>

          {/* The quiz box */}
          <div className="w-[680px] h-[50px] max-w-full rounded-2xl border border-amber-300 bg-black/35 px-8 py-12 text-center text-3xl font-extrabold text-white ring-1 ring-white/10">
            <motion.div
              variants={container}
              initial="hidden"
              animate="visible"
              className="flex justify-center space-x-2"
            >
              {letters.map((letter, i) => (
                <motion.span key={i} variants={item}>
                  {letter}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </Stage>
  );
}
