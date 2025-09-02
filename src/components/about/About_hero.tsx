"use client";

import { Button } from "@/components/ui/button";
import { motion, useAnimation, useInView } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { useRef, useEffect } from "react";

import en from "@/locales/en.json";
import kh from "@/locales/km.json";

export function AboutHero() {
  const { language } = useLanguage();
  const t = language === "en" ? en : kh;

  const textRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  const textControls = useAnimation();
  const imgControls = useAnimation();

  const textInView = useInView(textRef, { once: false, margin: "-100px" });
  const imgInView = useInView(imgRef, { once: false, margin: "-100px" });

  useEffect(() => {
    if (textInView) {
      textControls.start({ opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } });
    } else {
      textControls.start({ opacity: 0, x: -50 });
    }

    if (imgInView) {
      imgControls.start({ opacity: 1, x: 0, scale: 1, transition: { duration: 0.8, ease: "easeOut" } });
    } else {
      imgControls.start({ opacity: 0, x: 50, scale: 0.95 });
    }
  }, [textInView, imgInView, textControls, imgControls]);

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-9 py-20 lg:py-20 text-center">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
        {/* Text Section */}
        <motion.div
          ref={textRef}
          initial={{ opacity: 0, x: -50 }}
          animate={textControls}
          className="flex-1 text-center lg:text-left"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {t.heroAbout.welcome}
            <br />
            <span className="text-yellow">STACKQUIZ</span>
            <br />
            {t.heroAbout.aboutUs}
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-8 leading-relaxed">
            {t.heroAbout.weAre}
            <br className="hidden sm:block" />
            {t.heroAbout.quiz}
            <br className="hidden sm:block" />
            {t.heroAbout.knowlage}
          </p>

          <Button className="btn-secondary btn-text px-6 py-3 sm:py-4 md:py-5 box-radius font-semibold text-base sm:text-lg">
            Get Started
          </Button>
        </motion.div>

        {/* Image Section */}
        <motion.div
          ref={imgRef}
          initial={{ opacity: 0, x: 50, scale: 0.95 }}
          animate={imgControls}
          className="flex-1 relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto"
        >
          <Image
            src="/about_svg/aboutus.svg"
            alt="About Us Illustration"
            width={600}
            height={400}
            className="w-full h-auto"
          />
        </motion.div>
      </div>
    </section>
  );
}
