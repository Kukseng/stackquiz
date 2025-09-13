"use client";

import { useLanguage } from "@/context/LanguageContext";
import { ContentSection } from "./ContentSection";
import en from "@/locales/en.json";
import kh from "@/locales/km.json";

export function EstablishmentSection() {
  const { language } = useLanguage();
  const t = language === "en" ? en : kh;

  const fontClass = language === "en" ? "en-font" : "kh-font";

  return (
    <ContentSection
      title={t.establishment.title}
      description={t.establishment.description}
      imageSrc="/about_svg/aboutus(goal).svg"
      imageAlt="Our Establishment Illustration"
      reversed={false}
      className={fontClass} 
    />
  );
}

