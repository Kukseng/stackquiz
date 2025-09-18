"use client";
import { Clock, Star, Users, BookOpen } from "lucide-react";
import { motion, useAnimation, useInView } from "framer-motion";
import React, { useEffect, useRef } from "react";
import Image from "next/image";

type Challenge = {
  id: number;
  title: string;
  questions: number;
  time: string;
  difficulty: string;
  color: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  participants: number;
  rating: number;
  image: string;
};

const CardQuizComponent: React.FC<{ challenge: Challenge; index: number }> = ({ challenge, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const inView = useInView(ref, { once: false, margin: "-100px" });

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 80, damping: 20, delay: index * 0.15 },
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
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="bg-white rounded-xl overflow-hidden shadow-md border cursor-pointer group"
    >
      {/* Image */}
      <div className="relative w-full h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
        <Image
          src={challenge.image}
          alt={challenge.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />

        {/* Rating */}
        <div className="absolute top-3 right-3 z-20 bg-white/95 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
          <Star size={12} className="text-yellow-500 fill-current" />
          <span className="text-xs font-semibold text-gray-700">{challenge.rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-lg text-gray-900 line-clamp-1 group-hover:text-gray-700 transition-colors">
            {challenge.title}
          </h3>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <BookOpen size={14} />
            <span>{challenge.questions} questions</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={14} />
            <span>{challenge.participants.toLocaleString()}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className={`bg-gradient-to-r ${challenge.color} text-white text-xs font-semibold px-3 py-1.5 rounded-full`}>
            {challenge.difficulty}
          </span>
          <div className="flex items-center gap-1 text-sm font-medium text-gray-600">
            <Clock size={16} className="text-gray-500" />
            <span>{challenge.time}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CardQuizComponent;
