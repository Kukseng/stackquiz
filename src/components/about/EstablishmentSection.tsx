"use client";

import { motion } from "framer-motion";

export function EstablishmentSection() {
  return (
    <section className="container mx-auto px-4 sm:px-8 lg:px-16 py-12 sm:py-16 lg:py-8">
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
        {/* Left Side: Image */}
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <img
            src="/about_svg/aboutus(goal).svg"
            alt="Our Goal Illustration"
            className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto"
          />
        </motion.div>

        {/* Right Side: Content */}
        <motion.div
          className="flex-1 text-center lg:text-left"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            Our{" "}
            <span className="text-transparent bg-clip-text bg-yellow-400">
              Establishment
            </span>
          </h2>

          <p className="text-gray-300 text-base sm:text-lg lg:text-2xl leading-relaxed">
           Our platform makes learning fun, social, and 
            <br className="hidden sm:block" />
           accessible by blending game-based quizzes with 
            <br className="hidden sm:block" />
           real-time competition to keep learners engaged.
            
          </p>
        </motion.div>
      </div>
    </section>
  );
}
