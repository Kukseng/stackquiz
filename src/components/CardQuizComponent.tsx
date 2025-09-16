"use client";
import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { Clock } from "lucide-react";
import { motion, useAnimation, useInView } from "framer-motion";

interface CardQuizProps {
  id: number;
  title: string;
  questions: number;
  time: string;
  difficulty: string;
  color: string;
  image: string;
  index: number;
}

export default function CardQuizComponent({
  title,
  questions,
  time,
  difficulty,
  color,
  image,
  index,
}: CardQuizProps) {
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const inView = useInView(ref, { once: false, margin: "-100px" });

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: {
          type: "spring",
          stiffness: 80,
          damping: 20,
          delay: index * 0.15,
        },
      });
    } else {
      controls.start({ opacity: 0, y: 60 });
    }
  }, [inView, controls, index]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={controls}
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-xl overflow-hidden shadow-md border cursor-pointer transition-transform duration-300"
    >
      {/* Image */}
      <div className="relative w-full h-56">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800">{title}</h3>
        <p className="text-gray-600 text-sm">{questions} questions</p>

        <div className="mt-4 flex items-center justify-between">
          <span className={`${color} text-white text-xs px-3 py-1 rounded-full`}>
            {difficulty}
          </span>

          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Clock size={16} />
            <span>{time}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
