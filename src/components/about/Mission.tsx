"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function MissionSection() {
  return (
    <section className="container mx-auto px-4 sm:px-8 lg:px-30 md:py-4 sm:py-16 lg:py-8">
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
        {/* Left Side: Text */}
        <motion.div
          className="flex-1 text-center lg:text-left lg:px-6"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            Our{" "}
            <span className="text-yellow">
              Mission
            </span>
          </h2>
          <p className="text-gray-300 text-base sm:text-lg lg:text-2xl leading-relaxed">
            Our mission is to revolutionize online learning and
            <br className="hidden sm:block" />
            knowledge-sharing through education and quizzes to bridge the gap
            between entertainment and learning, making education more engaging
            and effective.
          </p>
        </motion.div>

        {/* Right Side: Image */}
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <Image
            src="/about_svg/aboutus(mission).svg" // must be in /public/about_svg/
            alt="Our Mission Illustration"
            width={500} // set a base width
            height={500} // set a base height
            className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto"
          />
        </motion.div>
      </div>
    </section>
  );
}
