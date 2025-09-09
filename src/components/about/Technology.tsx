"use client";
import React from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

import en from "@/locales/en.json";
import kh from "@/locales/km.json";
import {
  SlidingLogoMarquee,
  SlidingLogoMarqueeItem,
} from "../ui/SlidingLogoMarquee";

const SECTION_SPACING = {
  sectionGap: "py-16 sm:py-20 lg:py-24 xl:py-28",
  
  containerPadding: "px-4 sm:px-6 lg:px-8 xl:px-10",
  contentGap: "space-y-8 sm:space-y-12 lg:space-y-16",
  titleMargin: "mb-12 sm:mb-16 lg:mb-20",
  gridGap: "gap-8 sm:gap-12 lg:gap-16 xl:gap-20",
  cardGap: "gap-6 sm:gap-8 lg:gap-12",
};
export function TechnologySection() {
  const { language } = useLanguage();
  const t = language === "en" ? en : kh;

  const technologies = [
    { name: "Redis", image: "/technology/redis.png" },
    { name: "PostgreSQL", image: "/technology/postgres.webp" },
    { name: "Spring Boot", image: "/technology/spring.png" },
    { name: "docker", image: "/technology/docker.webp" },
    { name: "Next.js", image: "/technology/next.png" },
    { name: "Blender", image: "/technology/blender.png" },
  ];

  const marqueeItems: SlidingLogoMarqueeItem[] = technologies.map(
    (tech, index) => ({
      id: index.toString(),
      content: (
        <div
          className="w-50 h-25 mx-3 p-3 
                     backdrop-blur-xl rounded-xl 
                     flex items-center justify-center 
                     transition-all duration-300 cursor-pointer 
                     hover:scale-105"
          title={tech.name}
        >
          <Image
            src={tech.image}
            alt={tech.name}
            width={240}
            height={180}
            className="object-contain drop-shadow-lg"
          />
        </div>
      ),
    })
  );

  return (
    <section className={`${SECTION_SPACING.containerPadding} ${SECTION_SPACING.sectionGap}`}>
      {/* Header */}
      <div className={`text-center ${SECTION_SPACING.titleMargin}`}>
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
          <span className="relative">
            <span className="text-yellow text-underline">{t.heroAbout.technology}</span>
          </span>
        </h2>
      </div>

      {/* Glass Background Wrapper */}
      <div className="relative max-w-7xl mx-auto">
        <div className="rounded-2xl bg-gradient-to-br from-purple-100/40 to-blue-400/50 shadow-2xl shadow-black/10">
          <SlidingLogoMarquee
            items={marqueeItems}
            speed={25}
            pauseOnHover={true}
            enableBlur={true}
            blurIntensity={0.5}
            height="120px"
            gap="1.5rem"
            scale={1}
            autoPlay={true}
            backgroundColor="transparent"
            showControls={false}
            className="w-full"
          />
        </div>
      </div>
    </section>
  );
}

