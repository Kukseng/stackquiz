"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Banner() {
  return (
    <section className="relative w-full h-[300px] md:h-[400px] mt-16 flex items-center justify-center rounded-1xl overflow-hidden">
      {/* Background image */}
      <Image
        src="explore/hero.png" 
        alt="explore Banner"
        fill
        className="object-contain p-[40px] "
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
          className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-400 text-red-800 font-semibold shadow-md"
        >
          Play Now
        </motion.button>
      </div>
    </section>
  );
}
