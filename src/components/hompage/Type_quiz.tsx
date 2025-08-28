"use client";
import React, { useState, useRef, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { motion, useAnimation, useInView } from "framer-motion";

interface QuizType {
  id: number;
  title: string;
  description: string;
  color: string;
  image: string;
}

const items: QuizType[] = [
  {
    id: 1,
    title: "Fill the Blank",
    description: "Complete the sentence with the correct answer.",
    color: "bg-orange-700",
    image: "type_quiz/fill.svg",
  },
  {
    id: 2,
    title: "Multiple Choice",
    description: "Choose the correct answer from several options.",
    color: "bg-green-600",
    image: "type_quiz/multi.svg",
  },
  {
    id: 3,
    title: "True/False",
    description: "Decide if the statement is correct or not.",
    color: "bg-purple-600",
    image: "type_quiz/truefalse.svg",
  },
];

export function QuizTypeComponent() {
  const [active, setActive] = useState(0);

  const prev = () =>
    setActive((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  const next = () => setActive((prevIndex) => (prevIndex + 1) % items.length);

  // Animation refs
  const refs = items.map(() => useRef<HTMLDivElement>(null));
  const controls = items.map(() => useAnimation());
  const inViews = refs.map((ref) =>
    useInView(ref, { once: false, margin: "-100px" })
  );

  useEffect(() => {
    inViews.forEach((inView, idx) => {
      if (inView) {
        controls[idx].start({
          opacity: 1,
          y: 0,
          transition: { type: "spring", stiffness: 80, damping: 20, delay: idx * 0.2 },
        });
      } else {
        controls[idx].start({ opacity: 0, y: 40 });
      }
    });
  }, [inViews, controls]);

  return (
    <section className="px-4 sm:px-6 md:px-12 lg:px-20 xl:px-36 py-16 sm:py-24 md:py-32 lg:py-40">
      <h2 className="text-3xl  text-center sm:text-4xl text-underline font-extrabold text-yellow  text-yellow mb-10">
        Question Types
      </h2>

      <div className="relative w-full max-w-5xl mx-auto flex items-center justify-center">
        {/* Cards */}
        <div className="relative w-full glow-pink flex items-center justify-center h-[420px] sm:h-[460px] perspective">
          {items.map((item, index) => {
            const isCenter = index === active;
            const isRight = index === (active + 1) % items.length;
            const isLeft = index === (active - 1 + items.length) % items.length;

            return (
              <motion.div
                key={item.id}
                ref={refs[index]}
                initial={{ opacity: 0, y: 40 }}
                animate={controls[index]}
                whileHover={{ scale: 1.05 }}
                className={`absolute w-52 sm:w-56 md:w-60 lg:w-64 h-72 sm:h-80 md:h-96 rounded-xl text-gray-200 p-5 flex flex-col items-center justify-between shadow-lg transition-transform duration-500
                  ${isCenter ? "z-20 scale-110" : ""}
                  ${isRight ? "translate-x-32 sm:translate-x-40 scale-90 rotate-y-[-20deg] opacity-50 z-10" : ""}
                  ${isLeft ? "-translate-x-32 sm:-translate-x-40 scale-90 rotate-y-[20deg] opacity-50 z-10" : ""}
                  ${!isCenter && !isRight && !isLeft ? "scale-75 opacity-0 z-0" : ""}
                  ${item.color}`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-contain mx-auto mb-4"
                />
                <div className="text-center">
                  <h3 className="text-lg sm:text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-sm sm:text-base">{item.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Navigation */}
        <button
          onClick={prev}
          className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 text-white bg-black/40 p-3 rounded-full hover:bg-black/60 transition"
        >
          <FaArrowLeft size={20} />
        </button>
        <button
          onClick={next}
          className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 text-white bg-black/40 p-3 rounded-full hover:bg-black/60 transition"
        >
          <FaArrowRight size={20} />
        </button>
      </div>
    </section>
  );
}
