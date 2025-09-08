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
    { name: "Redis", image: "/technology/redis.png" },
    { name: "PostgreSQL", image: "/technology/postgres.webp" },
    { name: "Spring Boot", image: "/technology/spring.png" },
    { name: "Docker", image: "/technology/docker.webp" },
    { name: "Next.js", image: "/technology/next.png" },
    { name: "Blender", image: "/technology/blender.png" },
  ];

  const marqueeItems: SlidingLogoMarqueeItem[] = technologies.map(
    (tech, index) => ({
      id: index.toString(),
      content: (
        <div
          className="flex items-center justify-center h-full 
                   w-40 sm:w-44 md:w-52 lg:w-60
                   transition-transform duration-300 
                   hover:scale-110 cursor-pointer"
          title={tech.name}
        >
          <Image
            src={tech.image}
            alt={tech.name}
            width={200}
            height={200}
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
            <span className="text-yellow text-underline">
              {t.heroAbout.technology}
            </span>
          </span>
        </h2>
      </div>

      {/* Marquee Wrapper */}
      <div className="relative max-w-7xl mx-auto">
        <div
          className="rounded-2xl bg-gradient-to-br from-blue-900 to-yellow-50
                        backdrop-blur-3xl md:shadow-2xs shadow-black/20 py-6"
        >
          <SlidingLogoMarquee
            items={marqueeItems}
            speed={25}
            pauseOnHover={true}
            enableBlur={true}
            blurIntensity={0.5}
            height="180px"
            gap="2rem"
            scale={1}
            autoPlay={true}
            backgroundColor="transparent"
            showControls={false}
            className="w-full flex items-center"
          />
        </div>
      </div>
    </section>
  );
}

export default TechnologySection;
