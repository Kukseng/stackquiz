


"use client";
import { Clock, Star, Users, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";
import Image from "next/image";
import Link from "next/link";

interface Challenge {
  id: string | number;
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
  description?: string;
  category?: string;
}

interface CardQuizComponentProps {
  challenge: Challenge;
  index: number;
  onQuizClick?: (challenge: Challenge) => void;
}

const CardQuizComponent: React.FC<CardQuizComponentProps> = ({
  challenge,
  index,
  onQuizClick,
}) => {
  const handleClick = () => {
    if (onQuizClick) onQuizClick(challenge);
    try {
      localStorage.setItem(
        "lastViewedQuiz",
        JSON.stringify({
          id: challenge.id,
          title: challenge.title,
          timestamp: new Date().toISOString(),
        })
      );
    } catch (error) {
      console.warn("Could not store quiz data:", error);
    }
  };

  return (
    <Link href={`/quizDetail/${challenge.id}`} onClick={handleClick}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.2, once: false }} 
        transition={{
          type: "spring",
          stiffness: 80,
          damping: 18,
          delay: index * 0.1,
        }}
        whileHover={{ scale: 1.05 }}
        className="bg-white rounded-xl overflow-hidden shadow-md border cursor-pointer group hover:shadow-lg transition-shadow duration-300"
      >
        {/* Image */}
        <div className="relative w-full h-48 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
          <Image
            src={challenge.image}
            alt={challenge.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={index < 3}
          />
          <div className="absolute top-3 right-3 z-20 bg-white/95 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
            <Star size={12} className="text-yellow-500 fill-current" />
            <span className="text-xs font-semibold text-gray-700">
              {challenge.rating.toFixed(1)}
            </span>
          </div>

          {challenge.category && (
            <div className="absolute top-3 left-3 z-20 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
              <span className="text-xs font-medium text-white">
                {challenge.category}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-bold text-lg text-gray-900 line-clamp-1 group-hover:text-gray-700 transition-colors leading-tight">
              {challenge.title}
            </h3>
          </div>

          {challenge.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {challenge.description}
            </p>
          )}

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <BookOpen size={14} />
              <span>
                {challenge.questions} question
                {challenge.questions !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={14} />
              <span>{challenge.participants.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <span
              className={`bg-gradient-to-r ${challenge.color} text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm`}
            >
              {challenge.difficulty}
            </span>
            <div className="flex items-center gap-1 text-sm font-medium text-gray-600">
              <Clock size={16} className="text-gray-500" />
              <span>{challenge.time}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default CardQuizComponent;
