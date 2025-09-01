"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";

export function AboutHero() {

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-9 py-20 lg:py-20 text-center">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">

        {/* Text Section */}
        <motion.div 
          className="flex-1 text-center lg:text-left"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Welcome To
            <br />
            <span className="text-yellow">STACKQUIZ</span>
            <br />
            About Us
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-8 leading-relaxed">
            We are passionate about creating fun and interactive
            <br className="hidden sm:block" />
            quiz experiences that bring people together, test
            <br className="hidden sm:block" />
            knowledge, and inspire lifelong curiosity.
          </p>

          {/* Animated Button */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Button className="btn-secondary btn-text px-6 py-3 sm:py-4 md:py-5 box-radius font-semibold text-base sm:text-lg">
              Get Started
            </Button>
          </motion.div>
        </motion.div>

        {/* Image Section */}
        <motion.div 
          className="flex-1"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05, rotate: 2 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Image
            src="/about_svg/aboutus.svg"
            alt="About Us Illustration"
            width={600}
            height={400}
            className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto"
          />
        </motion.div>
      </div>
    </section>
  );
}
