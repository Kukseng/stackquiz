"use client";

import { Button } from "@/components/ui/button";
import TextType from "../TextType";
import { useLanguage } from "@/context/LanguageContext";

import en from "@/locales/en.json";
import kh from "@/locales/km.json";

export function HeroSection() {
  const { language } = useLanguage();
  const t = language === "en" ? en : kh;

  return (
    <section className="py-20 sm:py-32 lg:py-40 px-4 sm:px-8 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Text Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--cosmic-text)] mb-6 leading-tight">
              {t.hero.engageWith}
              <br />
              {t.hero.organizer}
              <br />
              <span>{t.hero.realTime}</span>
              <br />
              <span className="text-yellow underline underline-offset-12 decoration-gray-200">
                <TextType
                  text={["STACKQUIZ",""]}
                  typingSpeed={300}
                  pauseDuration={1200}
                  showCursor={true}
                  cursorCharacter="|"
                />
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-[var(--cosmic-muted)] mb-8 max-w-lg mx-auto lg:mx-0">
              {t.hero.description}
            </p>
            <Button className="btn-secondary btn-text px-6 py-3 sm:py-4 md:py-5 box-radius font-semibold text-base sm:text-lg">
              {t.hero.getStarted}
            </Button>
          </div>

          {/* Image */}
          <div className="order-2 lg:order-1 relative w-full h-64 sm:h-80 md:h-96 flex items-center justify-center mt-8 lg:mt-0">
            <img
              src="hero.svg"
              alt="People engaging with quiz platform"
              className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-full h-auto"
            />
          </div>
          {/* <div className="order-2 lg:order-1 w-full h-80 sm:h-96 flex items-center justify-center">
            <img
              src="hero.svg"
              alt="Platform presentation"
              className="w-full max-w-sm sm:max-w-md lg:max-w-full h-auto"
            />
          </div> */}

        </div>
      </div>
    </section>
  );
}
