"use client";

import React, { useRef, useEffect } from "react";
import { Play } from "lucide-react";
import { motion, useAnimation, useInView } from "framer-motion";
import en from "@/locales/en.json";
import kh from "@/locales/km.json";
import { useLanguage } from "@/context/LanguageContext";

// Reusable Step Component
const Step = ({
  number,
  title,
  desc,
  color,
}: {
  number: string;
  title: string;
  desc: string;
  color: string;
}) => (
  <div className="flex gap-4">
    <div className="flex-shrink-0">
      <div className={`w-8 h-8 bg-${color} rounded-full flex items-center justify-center`}>
        <span className="text-white font-semibold text-sm">{number}</span>
      </div>
    </div>
    <div className="flex-1">
      <h3 className="font-semibold text-gray-900 text-lg mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
    </div>
  </div>
);

const QuizInstructions = () => {
  // Refs & controls for each card
  const hostRef = useRef<HTMLDivElement>(null);
  const hostControls = useAnimation();
  const hostInView = useInView(hostRef, { once: false, margin: "-100px" });

  const playRef = useRef<HTMLDivElement>(null);
  const playControls = useAnimation();
  const playInView = useInView(playRef, { once: false, margin: "-100px" });

  // Language context
  const { language } = useLanguage();
  const t = language === "en" ? en : kh;
  const fontClass = language === "en" ? "en-font" : "kh-font";

  // Animate on scroll
  useEffect(() => {
    if (hostInView)
      hostControls.start({ opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 20, delay: 0 } });
    else hostControls.start({ opacity: 0, y: 50 });

    if (playInView)
      playControls.start({ opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 20, delay: 0.2 } });
    else playControls.start({ opacity: 0, y: 50 });
  }, [hostInView, playInView, hostControls, playControls]);

  return (
    <div className={`p-4 md:p-8 ${fontClass}`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">

          {/* How to Host a Template */}
          <motion.div
            ref={hostRef}
            initial={{ opacity: 0, y: 50 }}
            animate={hostControls}
            whileHover={{ scale: 1.05, boxShadow: "0px 15px 25px rgba(0,0,0,0.2)" }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="bg-white rounded-2xl overflow-hidden cursor-pointer"
          >
            {/* Orange Header */}
            <div className="bg-gradient-to-r from-orange-400 to-orange-500 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Play className="w-4 h-4 text-white fill-gray-800" />
                </div>
                <h2 className="text-xl font-semibold text-white">{t["quiz-instructions"].hostTemplate}</h2>
              </div>
              <p className="text-orange-50 mt-2 text-sm">{t["quiz-instructions"].hostDesc}</p>
            </div>

            {/* Steps Content */}
            <div className="p-6 space-y-6">
              <Step
                number="1"
                title={t["quiz-instructions"].step1Title}
                desc={t["quiz-instructions"].step1Desc}
                color="blue-500"
              />
              <Step
                number="2"
                title={t["quiz-instructions"].step2Title}
                desc={t["quiz-instructions"].step2Desc}
                color="yellow-500"
              />
            </div>
          </motion.div>

          {/* How to Play */}
          <motion.div
            ref={playRef}
            initial={{ opacity: 0, y: 50 }}
            animate={playControls}
            whileHover={{ scale: 1.05, boxShadow: "0px 15px 25px rgba(0,0,0,0.2)" }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="bg-white rounded-2xl overflow-hidden cursor-pointer"
          >
            {/* Orange Header */}
            <div className="bg-gradient-to-r from-orange-400 to-orange-500 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Play className="w-4 h-4 text-white fill-gray-800" />
                </div>
                <h2 className="text-xl font-semibold text-white">{t["quiz-instructions"].playQuiz}</h2>
              </div>
              <p className="text-orange-50 mt-2 text-sm">{t["quiz-instructions"].playDesc}</p>
            </div>

            {/* Steps Content */}
            <div className="p-6 space-y-6">
              <Step
                number="1"
                title={t["quiz-instructions"].playStep1Title}
                desc={t["quiz-instructions"].playStep1Desc}
                color="blue-500"
              />
              <Step
                number="2"
                title={t["quiz-instructions"].playStep2Title}
                desc={t["quiz-instructions"].playStep2Desc}
                color="yellow-500"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default QuizInstructions;
