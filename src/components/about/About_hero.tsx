"use client";

import { Button } from "@/components/ui/button";
import { motion, useAnimation, useInView } from "framer-motion";
import Image from "next/image";
import { useRef, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import en from "@/locales/en.json";
import kh from "@/locales/km.json";

export function AboutHero() {
  const { language } = useLanguage();
  const t = language === "en" ? en : kh;
  const fontClass = language === "en" ? "en-font" : "kh-font";

  const textRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  const textControls = useAnimation();
  const imgControls = useAnimation();

  const textInView = useInView(textRef, { once: false, margin: "-100px" });
  const imgInView = useInView(imgRef, { once: false, margin: "-100px" });

  useEffect(() => {
    if (textInView)
      textControls.start({
        opacity: 1,
        x: 0,
        transition: { duration: 0.8, ease: "easeOut" },
      });
    else textControls.start({ opacity: 0, x: -50 });

    if (imgInView)
      imgControls.start({
        opacity: 1,
        x: 0,
        scale: 1,
        transition: { duration: 0.8, ease: "easeOut" },
      });
    else imgControls.start({ opacity: 0, x: 50, scale: 0.95 });
  }, [textInView, imgInView, textControls, imgControls]);

  return (
    <section className="px-4 sm:px-6 md:px-7 lg:px-9 xl:px-10 pt-20 sm:pt-24 lg:pt-28">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            ref={textRef}
            initial={{ opacity: 0, x: -50 }}
            animate={textControls}
            className={`${fontClass} text-center lg:text-left`}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl py-7 font-bold text-[var(--cosmic-text)] mb-6 leading-tight">
              {t.heroAbout.welcome}
              <br />
              <span className="text-yellow">STACKQUIZ</span>
              <br />
              {t.heroAbout.aboutUs}
            </h1>

            <p className="text-lg sm:text-2xl md:text-2xl  text-[var(--cosmic-muted)] mb-8 max-w-lg mx-auto lg:mx-0">
              {t.heroAbout.weAre}
              <br className="hidden sm:block" />
              {t.heroAbout.quiz}
              <br className="hidden sm:block" />
              {t.heroAbout.knowlage}
            </p>

            <div className="flex justify-center lg:justify-start">
              <Link href="/signup">
                <Button
                  className={`btn-secondary btn-text px-6 py-3 sm:py-4 md:py-5 box-radius font-semibold text-base sm:text-lg ${
                    language === "en" ? "en-font" : "kh-font"
                  }`}
                >
                  {t.heroAbout.getStarted}
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Image Content */}
          <motion.div
            ref={imgRef}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={imgControls}
            className="order-2 lg:order-1 relative w-full h-64 sm:h-80 md:h-96 flex items-center justify-center mt-8 lg:mt-20"
          >
            <Image
              src="/about_svg/aboutus.svg"
              alt="About Us Illustration"
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
