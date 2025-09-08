"use client";

import { Button } from "@/components/ui/button";
import { motion, useAnimation, useInView } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { useRef, useEffect } from "react";
import Link from "next/link";

import en from "@/locales/en.json";
import kh from "@/locales/km.json";
import {  Variants } from "framer-motion";

// Consistent animation variants
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

// About Hero Component
export function AboutHero() {
  const { language } = useLanguage();
  const t = language === "en" ? en : kh;

  return (
    <section className="px-4 sm:px-6 md:px-7 lg:px-9 xl:px-10 pt-20 sm:pt-36 lg:pt-40">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            variants={fadeInLeft}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            <motion.h1 
              className="text-3xl py-7 sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--cosmic-text)] mb-6 leading-tight"
              variants={fadeInUp}
            >
              {t.heroAbout.welcome}
              <br />
              <motion.span 
                className="text-yellow-400 inline-block"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                STACKQUIZ
              </motion.span>
              <br />
              {t.heroAbout.aboutUs}
            </motion.h1>

            <motion.p 
              className="text-base sm:text-lg md:text-xl text-[var(--cosmic-muted)] mb-8 max-w-lg mx-auto lg:mx-0"
              variants={fadeInUp}
              transition={{ delay: 0.2 }}
            >
              {t.heroAbout.weAre}
              <br className="hidden sm:block" />
              {t.heroAbout.quiz}
              <br className="hidden sm:block" />
              {t.heroAbout.knowlage}
            </motion.p>

            <motion.div
              variants={fadeInUp}
              transition={{ delay: 0.4 }}
            >
              <Link href="/signup">
                <Button className="btn-secondary btn-text px-8 py-4 box-radius font-semibold text-lg hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                  Get Started
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Image Content */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
            className="order-2 lg:order-1 relative w-full h-64 sm:h-80 md:h-96 flex items-center justify-center mt-8 lg:mt-0"
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: 2 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Image
                src="/about_svg/aboutus.svg"
                alt="About Us Illustration"
                width={500}
                height={500}
                className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-full h-auto object-contain drop-shadow-2xl"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}