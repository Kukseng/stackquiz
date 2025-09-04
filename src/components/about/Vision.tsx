"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function VisionSection() {
  return (
    <section className="container mx-auto px-4 sm:px-8 lg:px-16 sm:py-16 lg:py-8">
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
        {/* Left Side: Image */}
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <Image
            src="/about_svg/aboutus(vision).svg" // Use a leading slash for public folder
            alt="Our Vision Illustration"
            width={500} // adjust according to your design
            height={500} // adjust according to your design
            className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto"
          />
        </motion.div>

        {/* Right Side: Text */}
        <motion.div
          className="flex-1 text-center lg:text-left"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            Our{" "}
            <span className="text-yellow">
              Vision
            </span>
          </h2>
          <p className="text-gray-300 text-base sm:text-lg lg:text-2xl leading-relaxed">
            Our vision is to become the leading platform where
            <br className="hidden sm:block" />
            learning and entertainment seamlessly merge, creating
            <br className="hidden sm:block" />
            a global community of learners who are motivated to
            <br className="hidden sm:block" />
            explore new topics through fun and engaging quizzes.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
