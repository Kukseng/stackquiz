"use client";

import Image from "next/image";
import { motion, useAnimation, useInView } from "framer-motion";
import { useRef, useEffect } from "react";

export function TopPlayersSection() {
  const winnerRef = useRef<HTMLDivElement>(null);
  const secondRef = useRef<HTMLDivElement>(null);
  const thirdRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const winnerControls = useAnimation();
  const secondControls = useAnimation();
  const thirdControls = useAnimation();
  const titleControls = useAnimation();

  const winnerInView = useInView(winnerRef, { once: false, margin: "-100px" });
  const secondInView = useInView(secondRef, { once: false, margin: "-100px" });
  const thirdInView = useInView(thirdRef, { once: false, margin: "-100px" });
  const titleInView = useInView(titleRef, { once: false, margin: "-100px" });

  useEffect(() => {
    // Title
    if (titleInView) titleControls.start({ opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 20 } });
    else titleControls.start({ opacity: 0, y: 30 });

    // Winner (1st)
    if (winnerInView) winnerControls.start({ opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 20 } });
    else winnerControls.start({ opacity: 0, y: 50 });

    // 2nd place
    if (secondInView) secondControls.start({ opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 20, delay: 0.2 } });
    else secondControls.start({ opacity: 0, y: 50 });

    // 3rd place
    if (thirdInView) thirdControls.start({ opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 20, delay: 0.4 } });
    else thirdControls.start({ opacity: 0, y: 50 });
  }, [titleInView, winnerInView, secondInView, thirdInView, titleControls, winnerControls, secondControls, thirdControls]);

  return (
    <section className="relative px-4 py-12 sm:py-20 overflow-hidden">
      <div className="relative max-w-5xl mx-auto text-center">

        {/* Title */}
        <motion.h2
          ref={titleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={titleControls}
          className="text-3xl py-24 sm:text-4xl text-underline font-extrabold text-yellow  text-yellow mb-10 ">
          Top Players
        </motion.h2>

        <div className="flex justify-center items-end gap-6 sm:gap-10 lg:gap-16">

          {/* 2nd Place */}
          <motion.div
            ref={secondRef}
            initial={{ opacity: 0, y: 50 }}
            animate={secondControls}
            className="text-center scale-90 sm:scale-100 hover:scale-110 transition-transform duration-300"
          >
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full border-4 border-cyan-400 bg-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.9)]">
              <Image
                src="avatar.svg"
                alt="Lina"
                width={96}
                height={96}
                className="rounded-full object-cover"
              />
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-7 h-7 sm:w-8 sm:h-8 bg-cyan-500 text-black text-xs sm:text-sm font-extrabold flex items-center justify-center rounded-full border-2 border-white shadow-[0_0_10px_rgba(34,211,238,0.8)]">
                2
              </div>
            </div>
            <div className="text-cyan-300 mt-2 sm:mt-3 font-semibold">Vatani</div>
            <div className="text-gray-400 text-xs sm:text-sm">level 3</div>
          </motion.div>

          {/* 1st Place (Winner) */}
          <motion.div
            ref={winnerRef}
            initial={{ opacity: 0, y: 50 }}
            animate={winnerControls}
            className="text-center relative scale-110 sm:scale-125 hover:scale-135 transition-transform duration-300"
          >
            {/* Crown */}
            <div className="absolute -top-10 z-20 sm:-top-14 left-1/2 -translate-x-1/2 text-5xl sm:text-7xl drop-shadow-[0_0_20px_rgba(255,215,0,1)]">
              <Image src="crown.svg" alt="crown" width={90} height={80} />
            </div>
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 mx-auto rounded-full border-4 border-yellow-400 bg-purple-900 flex items-center justify-center shadow-[0_0_35px_rgba(255,215,0,1)] animate-pulse">
              <Image src="avatar.svg" alt="crown" width={90} height={80} />
            
              <div className="absolute -bottom-3 sm:-bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-yellow-400 text-black text-xs sm:text-base font-extrabold flex items-center justify-center rounded-full border-2 border-white shadow-[0_0_15px_rgba(255,215,0,0.9)]">
                1
              </div>
            </div>
            <div className="text-yellow-300 mt-3 sm:mt-4 font-extrabold text-base sm:text-lg drop-shadow-[0_0_15px_rgba(255,215,0,0.9)]">
              Borey
            </div>
            <div className="text-gray-300 text-xs sm:text-sm">level 32</div>
          </motion.div>

          {/* 3rd Place */}
          <motion.div
            ref={thirdRef}
            initial={{ opacity: 0, y: 50 }}
            animate={thirdControls}
            className="text-center sm:scale-100 hover:scale-110 transition-transform duration-300"
          >
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full border-4 border-orange-400 bg-orange-600 flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.9)]">
              <Image
                src="avatar.svg"
                alt="Lina"
                width={96}
                height={96}
                className="rounded-full object-cover"
              />
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-7 h-7 sm:w-8 sm:h-8 bg-orange-500 text-black text-xs sm:text-sm font-extrabold flex items-center justify-center rounded-full border-2 border-white shadow-[0_0_10px_rgba(249,115,22,0.9)]">
                3
              </div>
            </div>
            <div className="text-orange-300 mt-2 sm:mt-3 font-semibold">Lina</div>
            <div className="text-gray-400 text-xs sm:text-sm">level 84</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
