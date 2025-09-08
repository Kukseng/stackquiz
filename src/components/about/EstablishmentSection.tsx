"use client";
import { motion, useAnimation, useInView } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { useRef, useEffect } from "react";
import { ContentSection } from "./ContentSection";

import en from "@/locales/en.json";
import kh from "@/locales/km.json";

export function EstablishmentSection() {
  const { language } = useLanguage();
  const t = language === "en" ? en : kh;

  return (
    <ContentSection
      title={t.establishment.title}
      description={t.establishment.description}
      imageSrc="/about_svg/aboutus(goal).svg"
      imageAlt="Our Establishment Illustration"
      reversed={false}
    />
  );
}