"use client";
import { motion, useAnimation, useInView } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { useRef, useEffect } from "react";
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