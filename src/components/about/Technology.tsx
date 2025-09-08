"use client";
import React from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { motion, useAnimation, useInView } from "framer-motion";
import {  Variants } from "framer-motion";
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
  const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeOut" } 
  }
};

const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.6, ease: "easeOut" } 
  }
};

const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.6, ease: "easeOut" } 
  }
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { duration: 0.6, ease: "easeOut" } 
  }
};
const SectionTitle = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <motion.div
    className={`text-center mb-16 ${className}`}
    variants={fadeInUp}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
  >
    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white">
      <span className="relative">
        <span className="text-yellow-400 relative">
          {children}
          <motion.div
            className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            transition={{ delay: 0.5, duration: 0.8 }}
            viewport={{ once: true }}
          />
        </span>
      </span>
    </h2>
  </motion.div>
);
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-10 py-20">
      <SectionTitle>{t.heroAbout.technology}</SectionTitle>

      <motion.div
        className="relative max-w-7xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.div
          className="rounded-3xl bg-gradient-to-br from-blue-900/30 to-yellow-500/20 backdrop-blur-xl shadow-2xl border border-white/10 p-8"
          variants={scaleIn}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {technologies.map((tech, index) => (
              <motion.div
                key={tech.name}
                className="flex flex-col items-center group"
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: { delay: index * 0.1, duration: 0.5 }
                  }
                }}
                whileHover={{ scale: 1.1, y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-20 h-20 mb-4 relative group-hover:drop-shadow-2xl transition-all duration-300">
                  <Image
                    src={tech.image}
                    alt={tech.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">
                  {tech.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}