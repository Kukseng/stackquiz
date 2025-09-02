"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
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
    image: "/type_quiz/fill.svg",
  },
  {
    id: 2,
    title: "Multiple Choice",
    description: "Choose the correct answer from several options.",
    color: "bg-green-600",
    image: "/type_quiz/multi.svg",
  },
  {
    id: 3,
    title: "True/False",
    description: "Decide if the statement is correct or not.",
    color: "bg-purple-600",
    image: "/type_quiz/truefalse.svg",
  },
];

export function QuizTypeComponent() {
  const [active, setActive] = useState(0);

  const prev = () =>
    setActive((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  const next = () => setActive((prevIndex) => (prevIndex + 1) % items.length);

  // --- Create refs and animation controls separately ---
  const ref1 = useRef<HTMLDivElement>(null);
  const control1 = useAnimation();
  const inView1 = useInView(ref1, { once: false, margin: "-100px" });

  const ref2 = useRef<HTMLDivElement>(null);
  const control2 = useAnimation();
  const inView2 = useInView(ref2, { once: false, margin: "-100px" });

  const ref3 = useRef<HTMLDivElement>(null);
  const control3 = useAnimation();
  const inView3 = useInView(ref3, { once: false, margin: "-100px" });

  useEffect(() => {
    if (inView1) control1.start({ opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 20 } });
    else control1.start({ opacity: 0, y: 40 });

    if (inView2) control2.start({ opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 20, delay: 0.2 } });
    else control2.start({ opacity: 0, y: 40 });

    if (inView3) control3.start({ opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 20, delay: 0.4 } });
    else control3.start({ opacity: 0, y: 40 });
  }, [inView1, inView2, inView3, control1, control2, control3]);

  return (
    <section className="px-4">
      <div className="text-center mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
          <span className="relative">
            Type <span className="text-yellow-400">Quiz</span>
            <span className="absolute left-0 -bottom-1 w-full h-[4px] bg-yellow-400"></span>
          </span>
        </h2>
      </div>

      <div className="relative w-full max-w-5xl mx-auto flex items-center justify-center">
        <div className="relative w-full flex items-center justify-center h-[420px] sm:h-[460px] perspective">
          {[0, 1, 2].map((index) => {
            const item = items[index];
            const isCenter = index === active;
            const isRight = index === (active + 1) % items.length;
            const isLeft = index === (active - 1 + items.length) % items.length;

            // Assign proper refs and controls
            const ref = index === 0 ? ref1 : index === 1 ? ref2 : ref3;
            const control = index === 0 ? control1 : index === 1 ? control2 : control3;

            return (
              <motion.div
                key={item.id}
                ref={ref}
                initial={{ opacity: 0, y: 40 }}
                animate={control}
                whileHover={{ scale: 1.05 }}
                className={`absolute w-52 sm:w-56 md:w-60 lg:w-64 h-72 sm:h-80 md:h-96 rounded-xl text-gray-200 p-5 flex flex-col items-center justify-between shadow-lg transition-transform duration-500
                  ${isCenter ? "z-20 scale-110" : ""}
                  ${isRight ? "translate-x-32 sm:translate-x-40 scale-90 rotate-y-[-20deg] opacity-50 z-10" : ""}
                  ${isLeft ? "-translate-x-32 sm:-translate-x-40 scale-90 rotate-y-[20deg] opacity-50 z-10" : ""}
                  ${!isCenter && !isRight && !isLeft ? "scale-75 opacity-0 z-0" : ""}
                  ${item.color}`}
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 relative">
                  <Image src={item.image} alt={item.title} fill className="object-contain" />
                </div>
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
