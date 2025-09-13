"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useAnimation, useInView } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import en from "@/locales/en.json";
import kh from "@/locales/km.json";

interface QuizType {
  id: number;
  title: string;
  description: string;
  color: string;
  image: string;
}

export function QuizTypeComponent() {
  const { language } = useLanguage();
  const t = language === "en" ? en : kh;
  const fontClass = language === "en" ? "en-font" : "kh-font";

  const items: QuizType[] = t.quizTypes;

  const [active, setActive] = useState(0);

  const prev = () =>
    setActive((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  const next = () =>
    setActive((prevIndex) => (prevIndex + 1) % items.length);

  const ref1 = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);
  const ref3 = useRef<HTMLDivElement>(null);

  const control1 = useAnimation();
  const control2 = useAnimation();
  const control3 = useAnimation();

  const inView1 = useInView(ref1, { once: false, margin: "-100px" });
  const inView2 = useInView(ref2, { once: false, margin: "-100px" });
  const inView3 = useInView(ref3, { once: false, margin: "-100px" });

  useEffect(() => {
    if (inView1) {
      control1.start({
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 80, damping: 20 },
      });
    } else {
      control1.start({ opacity: 0, y: 40 });
    }

    if (inView2) {
      control2.start({
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 80, damping: 20, delay: 0.2 },
      });
    } else {
      control2.start({ opacity: 0, y: 40 });
    }

    if (inView3) {
      control3.start({
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 80, damping: 20, delay: 0.4 },
      });
    } else {
      control3.start({ opacity: 0, y: 40 });
    }
  }, [inView1, inView2, inView3, control1, control2, control3]);

  return (
    <section className={`px-4 py-12 ${fontClass}`}>
      {/* Section Title */}
      <div className="text-center mb-20">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white">
          <span className="text-yellow text-underline">
            {language === "en" ? "Quiz Types" : "ប្រភេទកម្រងសំណួរ"}
          </span>
        </h2>
      </div>

      {/* Carousel */}
      <div className="relative w-full max-w-5xl mx-auto flex items-center justify-center">
        <div className="relative w-full flex items-center justify-center h-[360px] sm:h-[420px] md:h-[460px]">
          {items.map((item, index) => {
            const isCenter = index === active;
            const isRight = index === (active + 1) % items.length;
            const isLeft = index === (active - 1 + items.length) % items.length;

            const ref = index === 0 ? ref1 : index === 1 ? ref2 : ref3;
            const control =
              index === 0 ? control1 : index === 1 ? control2 : control3;

            return (
              <motion.div
                key={item.id}
                ref={ref}
                initial={{ opacity: 0, y: 40 }}
                animate={control}
                whileHover={{ scale: 1.05 }}
                className={`absolute w-56 sm:w-64 md:w-72 lg:w-80 h-72 sm:h-80 md:h-96 rounded-3xl text-white flex flex-col shadow-xl overflow-hidden transition-transform duration-500
                  ${isCenter ? "z-20 scale-105 shadow-2xl" : ""}
                  ${isRight ? "translate-x-28 sm:translate-x-36 md:translate-x-40 scale-90 opacity-60 z-10" : ""}
                  ${isLeft ? "-translate-x-28 sm:-translate-x-36 md:-translate-x-40 scale-90 opacity-60 z-10" : ""}
                  ${!isCenter && !isRight && !isLeft ? "scale-75 opacity-0 z-0" : ""}
                  ${item.color}`}
              >
                {/* Image */}
                <div className="flex items-center justify-center flex-shrink-0 h-32 sm:h-36 md:h-40">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                {/* Text Content */}
                <div className="flex flex-col items-center justify-center flex-1 px-4 py-6 text-center">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm sm:text-base text-white/80">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prev}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 text-yellow bg-blue-500/30 p-3 rounded-full hover:bg-blue-600/30 transition z-30"
        >
          <ChevronLeft size={30} />
        </button>
        <button
          onClick={next}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 text-yellow bg-blue-500/30 p-3 rounded-full hover:bg-blue-600/30 transition z-30"
        >
          <ChevronRight size={30} />
        </button>
      </div>
    </section>
  );
}
