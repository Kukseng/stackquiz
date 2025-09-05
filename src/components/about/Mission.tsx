"use client";
import { motion, useAnimation, useInView } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { useRef, useEffect } from "react";

import en from "@/locales/en.json";
import kh from "@/locales/km.json";

export function MissionSection() {
  const { language } = useLanguage();
  const t = language === "en" ? en : kh;

  const textRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  const textControls = useAnimation();
  const imgControls = useAnimation();

  const textInView = useInView(textRef, { once: false, margin: "-100px" });
  const imgInView = useInView(imgRef, { once: false, margin: "-100px" });

  useEffect(() => {
    if (textInView)
      textControls.start({ opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } });
    else textControls.start({ opacity: 0, x: -50 });

    if (imgInView)
      imgControls.start({ opacity: 1, x: 0, scale: 1, transition: { duration: 0.8, ease: "easeOut" } });
    else imgControls.start({ opacity: 0, x: 50, scale: 0.95 });
  }, [textInView, imgInView, textControls, imgControls]);

  return (
    <section className="px-4 sm:px-6 md:px-7 lg:px-9 xl:px-10 sm:pt-16 lg:pt-20">
      <div className="max-w-7xl mx-auto">
        {/* flex-col-reverse for mobile, flex-row for desktop */}
        <div className="flex flex-col-reverse lg:flex-row items-center gap-16 lg:gap-28">

          {/* Text Section */}
          <motion.div
            ref={textRef}
            initial={{ opacity: 0, x: -50 }}
            animate={textControls}
            className="flex-1 text-center lg:text-left order-2 lg:order-1 lg:pr-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              <span className="text-yellow">{t.mission.title}</span>
            </h2>
            <p className="text-gray-300 text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed">
              {t.mission.description}
            </p>
          </motion.div>

          {/* Image Section */}
          <motion.div
            ref={imgRef}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={imgControls}
            className="flex-1 order-1 lg:order-2 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto mb-6 lg:mb-0"
          >
            <Image
              src="/about_svg/aboutus(mission).svg"
              alt="Our Mission Illustration"
              width={350}
              height={350}
              className="w-full h-auto object-contain"
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
