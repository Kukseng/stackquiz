"use client";

import { Button } from "@/components/ui/button";
import TextType from "../TextType";
import { useLanguage } from "@/context/LanguageContext";
import { motion, useAnimation, useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import en from "@/locales/en.json";
import kh from "@/locales/km.json";

export function HeroSection() {
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
      textControls.start({ opacity: 1, x: 0, transition: { duration: 0.8 } });
    else textControls.start({ opacity: 0, x: -50 });

    if (imgInView)
      imgControls.start({
        opacity: 1,
        x: 0,
        scale: 1,
        transition: { duration: 0.8 },
      });
    else imgControls.start({ opacity: 0, x: 50, scale: 0.95 });
  }, [textInView, imgInView, textControls, imgControls]);

  return (
    <section className="px-4 sm:px-6 md:px-7 lg:px-9 xl:px-10 pt-12 sm:pt-16 lg:pt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            ref={textRef}
            initial={{ opacity: 0, x: -50 }}
            animate={textControls}
            className={`text-center lg:text-left flex flex-col items-center lg:items-start 
              ${ language === "kh" ? "kh-font" : ""}`}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--cosmic-text)] mb-6 leading-tight">
              {t.hero.engageWith}
              <br />
              {t.hero.organizer}
              <br />
              <span>{t.hero.realTime}</span>
              <br />
              <span className="text-yellow text-underline decoration-gray-200">
                <TextType
                  text={["STACKQUIZ", ""]}
                  typingSpeed={300}
                  pauseDuration={1200}
                  showCursor={true}
                  cursorCharacter="|"
                />
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-[var(--cosmic-muted)] mb-8 max-w-lg">
              {t.hero.description}
            </p>

            {/* Button */}
            <div className="w-full flex justify-center lg:justify-start">
              <Link href="/signup">
                <Button className="btn-secondary btn-text px-6 py-3 sm:py-4 md:py-5 box-radius font-semibold text-base sm:text-lg">
                  {t.hero.getStarted}
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            ref={imgRef}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={imgControls}
            className="order-2 lg:order-1 relative w-full h-64 sm:h-80 md:h-96 flex items-center justify-center mt-8 lg:mt-0"
          >
            <Image
              src="/hero.svg"
              alt="People engaging with quiz platform"
              width={500}
              height={500}
              className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-full h-auto object-contain"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
