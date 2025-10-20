"use client";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { motion, useAnimation, useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import en from "@/locales/en.json";
import kh from "@/locales/km.json";

export function PlatformSection() {
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
      textControls.start({ opacity: 1, x: 0, transition: { duration: 0.8 } });
    else textControls.start({ opacity: 0, x: 50 });

    if (imgInView)
      imgControls.start({
        opacity: 1,
        x: 0,
        scale: 1,
        transition: { duration: 0.8 },
      });
    else imgControls.start({ opacity: 0, x: -50, scale: 0.95 });
  }, [textInView, imgInView, textControls, imgControls]);

  return (
    <section
      className={`px-4 sm:px-6 md:px-7 lg:px-9 xl:px-10 sm:py-6 md:py-9 lg:py-10 xl:py-11 ${fontClass}`}
    >
      <div className="max-w-7xl mx-auto py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text on Top (mobile), Right (desktop) */}
          <motion.div
            ref={textRef}
            initial={{ opacity: 0, x: 50 }}
            animate={textControls}
            className="order-1 lg:order-2 text-center lg:text-left"
          >
            <div className="mb-12">
              {/* Section Title */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                <span className="text-yellow text-underline">
                  {t.platform.title}
                </span>
              </h2>
            </div>
            {/* Section Description */}
            <p className="text-lg sm:text-2xl md:text-2xl text-[var(--cosmic-muted)] mb-8">
              {t.platform.description}
            </p>

            {/* Get Started Button */}
            <div className="flex justify-center lg:justify-start">
              <Link href="/signup" className="flex items-center gap-2">
                <Button className="btn-secondary btn-text px-6 py-3 sm:py-4 md:py-5 box-radius font-semibold text-base sm:text-lg">
                  {t.platform.getStarted}
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Image on Bottom (mobile), Left (desktop) */}
          <motion.div
            ref={imgRef}
            initial={{ opacity: 0, x: -50, scale: 0.95 }}
            animate={imgControls}
            className="order-2 lg:order-1 relative w-full h-64 sm:h-80 md:h-96 flex items-center justify-center"
          >
            <Image
              src="/second.svg"
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
