"use client";
import { Button } from "@/components/ui/button";
import { motion, useAnimation, useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import Link from "next/link";
export function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const inView = useInView(ref, { once: false, margin: "-100px" });

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 80, damping: 20 },
      });
    } else {
      controls.start({ opacity: 0, y: 50 });
    }
  }, [inView, controls]);

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
      className="px-4 py-12 sm:py-20"
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
          Ready to start your quiz journey?
        </h2>
        <p className="text-base sm:text-lg text-gray-300 mb-8">
          Join now and be part of the global learning community
        </p>

        <div className="flex flex-row gap-4 justify-center flex-wrap">
          <Link href="/signup" className="flex items-center gap-2">
          <Button className="flex-1 min-w-[140px] sm:flex-none btn-secondary btn-text px-6 sm:px-8 py-3 sm:py-4 box-radius text-base sm:text-lg font-semibold">
            Get Start
          </Button>
          </Link>
          <Link href="/explore" className="flex items-center gap-2">
          <Button
            variant="outline"
            className="flex-1 min-w-[140px] sm:flex-none border-white text-white hover:bg-gray-300 hover:text-gray-900 px-6 sm:px-8 py-3 sm:py-4 box-radius text-base sm:text-lg font-semibold bg-transparent"
          >
            Explore More
          </Button>
        </Link>
        </div>
      </div>
    </motion.section>
  );
}
