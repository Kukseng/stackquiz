"use client";
import { motion, useAnimation, useInView } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { useRef, useEffect } from "react";
import { ContentSection } from "./ContentSection";

import en from "@/locales/en.json";
import kh from "@/locales/km.json";
export function VisionSection() {
  const { language } = useLanguage();
  const t = language === "en" ? en : kh;

  return (
    <ContentSection
      title={t.vision.title}
      description={t.vision.description}
      imageSrc="/about_svg/aboutus(vision).svg"
      imageAlt="Our Vision Illustration"
      reversed={false}
    />
  );
}
