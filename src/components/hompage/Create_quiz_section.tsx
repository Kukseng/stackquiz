"use client";
import { Button } from "@/components/ui/button";
import { motion, useAnimation, useInView } from "framer-motion";
import { useRef, useEffect } from "react";

export default function CreateQuizSection() {
  const textRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  const textControls = useAnimation();
  const imgControls = useAnimation();

  const textInView = useInView(textRef, { once: false, margin: "-100px" });
  const imgInView = useInView(imgRef, { once: false, margin: "-100px" });

  useEffect(() => {
    if (textInView) {
      textControls.start({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 80, damping: 20 },
      });
    } else {
      textControls.start({ opacity: 0, y: 50, scale: 0.95 });
    }

    if (imgInView) {
      imgControls.start({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 80, damping: 20, delay: 0.3 },
      });
    } else {
      imgControls.start({ opacity: 0, y: 50, scale: 0.95 });
    }
  }, [textInView, imgInView, textControls, imgControls]);

  return (
    <div className="w-full px-4 sm:px-7  md:px-8 lg:px-10 xl:px-12 py-12">
      <motion.div
        className="bg-gray-screen-page  box-radius max-w-3xl w-full flex flex-col lg:flex-row items-center lg:items-stretch p-8 sm:p-4 lg:p-6 gap-3 lg:gap-4 mx-auto"
        initial={{ scale: 1 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 80, damping: 20 }}
      >
        {/* Left: Text + Button */}
        <motion.div
          ref={textRef}
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={textControls}
          className="flex-1 flex flex-col justify-center text-center lg:text-left space-y-2"
        >
          <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-white leading-tight">
            Create a quiz
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white">
            Play for free <br /> with participants
          </p>
          <div className="mt-2">
            <Button className="btn-secondary btn-text px-4 py-2 sm:py-3 box-radius font-semibold text-sm sm:text-base">
              Get start →
            </Button>
          </div>
        </motion.div>

        {/* Right: Illustration */}
        <motion.div
          ref={imgRef}
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={imgControls}
          className="flex-1 flex justify-center lg:justify-end mt-4 lg:mt-0"
        >
          <img
            src="quiz.svg"
            alt="3D character thinking"
            className="w-80 sm:w-80 md:w-82 lg:w-90 max-w-[90%] sm:max-w-sm md:max-w-md lg:max-w-sm h-auto"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
