"use client"
// components/ValuesSection.tsx
import React from "react";
import { motion, useAnimation, useInView } from "framer-motion";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import {  Variants } from "framer-motion";
import en from "@/locales/en.json";
import kh from "@/locales/km.json";


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
interface ValueCardProps {
  title: string;
  description: string;
  gradient: string;
  icon?: string; // path to image
}

interface ValueCardProps {
  title: string;
  description: string;
  gradient: string;
  icon?: string;
  index: number;
}

const ValueCard: React.FC<ValueCardProps> = ({ title, description, gradient, icon, index }) => {
  return (
    <motion.div
      className="relative p-8 rounded-3xl text-white overflow-hidden group cursor-pointer"
      variants={{
        hidden: { opacity: 0, y: 50, scale: 0.9 },
        visible: { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          transition: { delay: index * 0.1, duration: 0.6 }
        }
      }}
      whileHover={{ 
        scale: 1.05, 
        y: -10,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
    >
      {/* Animated gradient background */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90`}
        animate={{
          background: [
            `linear-gradient(45deg, ${gradient})`,
            `linear-gradient(225deg, ${gradient})`,
            `linear-gradient(45deg, ${gradient})`
          ]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />

      {/* Card content */}
      <div className="relative flex flex-col items-center text-center space-y-6">
        {icon && (
          <motion.div
            className="mb-2 w-16 h-16 flex items-center justify-center"
            whileHover={{ rotate: 360, scale: 1.2 }}
            transition={{ duration: 0.6, type: "spring" }}
          >
            <Image
              src={icon}
              alt={`${title} Icon`}
              width={64}
              height={64}
              className="object-contain drop-shadow-lg"
            />
          </motion.div>
        )}
        <h3 className="text-2xl sm:text-3xl font-bold">{title}</h3>
        <p className="text-base sm:text-lg text-white/95 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
};
// 


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

export function ValuesSection() {
  const { language } = useLanguage();
  const t = language === "en" ? en : kh;

  return (
    <section className="container mx-auto px-4 sm:px-8 lg:px-16 py-20">
      <SectionTitle>{t.heroAbout.value}</SectionTitle>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {t.heroAbout.values.map((value, index) => (
          <ValueCard
            key={index}
            title={value.title}
            description={value.description}
            gradient={
              index === 0
                ? "from-lime-500 via-green-500 to-emerald-600"
                : index === 1
                ? "from-green-400 via-blue-400 to-indigo-500"
                : "from-purple-400 via-pink-400 to-red-400"
            }
            icon={
              index === 0
                ? "/puzzle.png"
                : index === 1
                ? "/rocket.png"
                : "/book.png"
            }
            index={index}
          />
        ))}
      </motion.div>
    </section>
  );
};