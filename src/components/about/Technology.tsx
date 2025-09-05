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

export function TechnologySection() {
  const { language } = useLanguage();
  const t = language === "en" ? en : kh;

  const technologies = [
    { name: "Redis", image: "/Redis.png" },
    { name: "PostgreSQL", image: "/postgres.webp" },
    { name: "Spring Boot", image: "/Springboot.png" },
    { name: "Docker", image: "/docker.webp" },
    { name: "Next.js", image: "/nextjs.png" },
    { name: "Blender", image: "/Blender.png" },
  ];

  const marqueeItems: SlidingLogoMarqueeItem[] = technologies.map(
    (tech, index) => ({
      id: index.toString(),
      content: (
        <div
          className="w-32 sm:w-36 md:w-40 lg:w-44 h-24 sm:h-28 md:h-32 lg:h-36 
                     mx-4 p-4  rounded-xl 
                     flex items-center justify-center transition-transform duration-300
                     hover:scale-105 cursor-pointer"
          title={tech.name}
        >
          <Image
            src={tech.image}
            alt={tech.name}
            width={160}
            height={120}
            className="object-contain "
          />
        </div>
      ),
    })
  );

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-10 py-16">
      {/* Section Header */}
        <div className="text-center mb-30">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
          <span className="relative">
            <span className="text-yellow text-underline">{t.heroAbout.technology}</span>
          </span>
        </h2>
      </div>

      {/* Marquee Wrapper */}
      <div className="relative max-w-7xl mx-auto">
        <div className="rounded-2xl md:bg-gradient-to-br from-white/10 to-white/5 
                        backdrop-blur-xl md:shadow-2xl shadow-black/20 py-6">
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

export default TechnologySection;
