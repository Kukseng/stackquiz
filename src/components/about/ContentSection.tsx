"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";

type ContentSectionProps = {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  reversed?: boolean;
  className?: string; 
  children?: React.ReactNode;
};

// Animation variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export function ContentSection({
  title,
  description,
  imageSrc,
  imageAlt,
  reversed = false,
  className = "",
  children,
}: ContentSectionProps) {
  return (
    <section className={`px-4 sm:px-6 md:px-7 lg:px-9 xl:px-10 py-20 ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div
          className={`flex flex-col ${
            reversed ? "lg:flex-row" : "lg:flex-row-reverse"
          } items-center gap-16 lg:gap-28`}>
          {/* Text Section */}
          <motion.div
            variants={reversed ? fadeInLeft : fadeInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="flex-1 text-center lg:text-left"
          >
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8"
              variants={fadeInUp}
            >
              <span className="text-yellow-400 relative">
                {title}
                <motion.div
                  className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  viewport={{ once: true }}
                />
              </span>
            </motion.h2>
            <motion.p
              className="text-gray-300 text-lg sm:text-xl md:text-2xl leading-relaxed"
              variants={fadeInUp}
              transition={{ delay: 0.2 }}
            >
              {description}
            </motion.p>
          </motion.div>

          {/* Image Section */}
          <motion.div
            variants={reversed ? fadeInRight : fadeInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="flex-1 w-full max-w-md lg:max-w-lg mx-auto"
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: reversed ? -2 : 2 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Image
                src={imageSrc}
                alt={imageAlt}
                width={500}
                height={500}
                className="w-full h-auto object-contain drop-shadow-2xl"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Render any children (like your marquee) */}
        {children}
      </div>
    </section>
  );
}

