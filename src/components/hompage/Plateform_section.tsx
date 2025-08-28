"use client";

import { Button } from "@/components/ui/button";
import { motion, useAnimation, useInView } from "framer-motion";
import { useRef, useEffect } from "react";

export function PlatformSection() {
  const textRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  const textControls = useAnimation();
  const imgControls = useAnimation();

  const textInView = useInView(textRef, { once: false, margin: "-100px" });
  const imgInView = useInView(imgRef, { once: false, margin: "-100px" });

  useEffect(() => {
    if (imgInView) {
      imgControls.start({
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 80, damping: 20, delay: 0.2 }, // delay image
      });
    } else {
      imgControls.start({ opacity: 0, y: 50 });
    }

    if (textInView && imgInView) {
      textControls.start({
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 80, damping: 20, delay: 0.6 }, // text delay after image
      });
    } else {
      textControls.start({ opacity: 0, y: 50 });
    }
  }, [textInView, imgInView, textControls, imgControls]);

  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Image */}
          <motion.div
            ref={imgRef}
            initial={{ opacity: 0, y: 50 }}
            animate={imgControls}
            className="order-2 lg:order-1 relative w-full h-64 sm:h-80 md:h-96 flex items-center justify-center mt-8 lg:mt-0"
          >
            <img
              src="second.svg"
              alt="People engaging with quiz platform"
              className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-full h-auto"
            />
          </motion.div>

          {/* Text */}
          <motion.div
            ref={textRef}
            initial={{ opacity: 0, y: 50 }}
            animate={textControls}
            className="order-1 lg:order-2 text-center lg:text-left"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Our Amazing Platform
            </h2>
            <p className="text-base sm:text-lg text-gray-300 mb-8 max-w-lg mx-auto lg:mx-0">
              Create quizzes to promote the educational benefits of your content. Engage your audience in real-time,
              and create moments they'll never forget.
            </p>
            <Button className="btn-secondary btn-text px-6 py-3 sm:py-4 md:py-5 box-radius font-semibold text-base sm:text-lg">
              Get Start
            </Button>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
