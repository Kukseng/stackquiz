"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";

type ContentSectionProps = {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  reversed?: boolean;
};

// Animations
const fadeInDownRight: Variants = {
  hidden: { opacity: 0, x: -50, y: -50 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const fadeInDownLeft: Variants = {
  hidden: { opacity: 0, x: 50, y: -50 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export function ContentSection({
  title,
  description,
  imageSrc,
  imageAlt,
  reversed = false,
}: ContentSectionProps) {
  const textVariant = reversed ? fadeInDownRight : fadeInDownLeft;
  const imageVariant = reversed ? fadeInDownLeft : fadeInDownRight;

  return (
    <section className="px-4 sm:px-6 md:px-7 lg:px-9 xl:px-10 py-20">
      <div className="max-w-7xl mx-auto">
        <div
          className={`flex flex-col ${
            reversed ? "lg:flex-row" : "lg:flex-row-reverse"
          } items-center gap-16 lg:gap-28`}
        >
          {/* Text Section */}
          <motion.div
            variants={textVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ margin: "-100px" }} // remove once:true
            className="flex-1 text-center lg:text-left"
          >
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8"
              variants={textVariant}
              transition={{ duration: 0.6 }}
            >
              <span className="text-yellow-400 relative">
                {title}
                <motion.div
                  className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  viewport={{ margin: "-100px" }}
                />
              </span>
            </motion.h2>
            <motion.p
              className="text-gray-300 text-lg sm:text-xl md:text-2xl leading-relaxed"
              variants={textVariant}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {description}
            </motion.p>
          </motion.div>

          {/* Image Section */}
          <motion.div
            variants={imageVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ margin: "-100px" }} // remove once:true
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
      </div>
    </section>
  );
}
