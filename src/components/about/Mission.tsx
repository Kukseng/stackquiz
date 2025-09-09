"use client";

import { useLanguage } from "@/context/LanguageContext";
import { ContentSection } from "./ContentSection";
import en from "@/locales/en.json";
import kh from "@/locales/km.json";

export function MissionSection() {
  const { language } = useLanguage();
  const t = language === "en" ? en : kh;

  return (
    <ContentSection
      title={t.mission.title}
      description={t.mission.description}
      imageSrc="/about_svg/aboutus(mission).svg"
      imageAlt="Our Mission Illustration"
      reversed={true}
    />
  );
}