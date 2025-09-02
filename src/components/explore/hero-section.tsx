"use client";

import Image from "next/image";
import { motion, useAnimation, useInView } from "framer-motion";
import { useRef, useEffect } from "react";

export default function Banner() {
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const inView = useInView(ref, { once: false, margin: "-100px" }); // <-- animate every scroll

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 80, damping: 20, delay: 0.1 },
      });
    } else {
      controls.start({
        opacity: 0,
        y: 50,
      });
    }
  }, [inView, controls]);

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
      className="relative w-full h-[300px] md:h-[400px] mt-16 flex items-center justify-center rounded-2xl overflow-hidden"
    >
      {/* Background image */}
      <Image
        src="explore/hero.png"
        alt="explore Banner"
        fill
        className="object-contain p-[40px]"
        priority
      />

      {/* Overlay for text box */}
      <div className="relative z-10 bg-gradient-to-b from-blue-900/60 to-blue-700/60 p-6 md:p-10 rounded-2xl shadow-xl text-center max-w-md">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg">
          Stack Quiz!
        </h1>
        <p className="mt-3 text-lg text-gray-200">
          Play game and Challenge with Friends 👑
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-6  rounded-xl btn-secondary btn-text px-6 py-1 sm:py-1 md:py-2 box-radius text-base sm:text-lg font-semibold shadow-md"
        >
          Play Now
        </motion.button>
      </div>
    </motion.section>
  );
}