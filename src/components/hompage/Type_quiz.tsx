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
    title: "Fill the blank",
    description: "Choose the correct answer from several options.",
    color: "bg-purple-500",
    image: "type_quiz/fill.svg",
  },
  {
    id: 2,
    title: "Multiple Choice",
    description: "Choose the correct answer from several options.",
    color: "bg-lime-400",
    image: "type_quiz/multi.svg",
  },
  {
    id: 3,
    title: "True/False",
    description: "Choose the correct answer from true or false.",
    color: "bg-purple-500",
    image: "type_quiz/truefalse.svg",
  },
];

export function QuizTypeComponent() {
  const [active, setActive] = useState(1);

  const prev = () =>
    setActive((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  const next = () => setActive((prevIndex) => (prevIndex + 1) % items.length);

  // Animation refs and controls
  const refs = items.map(() => useRef<HTMLDivElement>(null));
  const controls = items.map(() => useAnimation());
  const inViews = refs.map((ref) => useInView(ref, { once: false, margin: "-100px" }));

  useEffect(() => {
    inViews.forEach((inView, idx) => {
      if (inView) {
        controls[idx].start({ opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 20, delay: idx * 0.2 } });
      } else {
        controls[idx].start({ opacity: 0, y: 50 });
      }
    });
  }, [inViews, controls]);

  return (
    <div className="py-12">
      <h2 className="text-3xl py-8 text-center sm:text-4xl font-extrabold text-white mb-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]">
        Question Types
      </h2>

      <div className="relative w-full  max-w-4xl mx-auto  flex  items-center justify-center">
        {/* Cards */}
        <div className="perspective relative w-full  flex items-center justify-center h-80">
          {items.map((item, index) => {
            const isCenter = index === active;
            const isRight = index === (active + 1) % items.length;
            const isLeft = index === (active - 1 + items.length) % items.length;

            let className =
              "absolute w-64 h-80 rounded-xl card-glow text-white p-4 transition-all duration-500 transform flex flex-col items-center justify-between";

            if (isCenter) className += " z-20 scale-110"; // center
            else if (isRight)
              className +=
                " translate-x-40 scale-90 rotate-y-[-20deg] opacity-50 z-10"; // right smaller
            else if (isLeft)
              className +=
                " -translate-x-40 scale-90 rotate-y-[20deg] opacity-50 z-10"; // left smaller
            else className += " scale-80 opacity-0 z-0"; // hidden

            return (
              <motion.div
                key={item.id}
                ref={refs[index]}
                initial={{ opacity: 0, y: 50 }}
                animate={controls[index]}
                className={`${className} ${item.color}`}
              >
                {/* Image */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-24 h-24 object-cover rounded-full mx-auto mb-2"
                />

                {/* Text */}
                <div className="text-center">
                  <div className="text-lg font-bold mb-2">{item.title}</div>
                  <div className="text-sm">{item.description}</div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Navigation */}
        <button
          onClick={prev}
          className="absolute left-0 top-1/2 -translate-y-1/2 text-white bg-black/40 p-3 rounded-full hover:bg-black/60"
        >
          <FaArrowLeft size={20} />
        </button>
        <button
          onClick={next}
          className="absolute right-0 top-1/2 -translate-y-1/2 text-white bg-black/40 p-3 rounded-full hover:bg-black/60"
        >
          <FaArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
