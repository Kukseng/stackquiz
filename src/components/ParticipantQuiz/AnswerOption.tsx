// components/ParticipantQuiz/AnswerOption.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaCircle, FaSquare, FaDiamond } from "react-icons/fa6";
import { IoTriangle } from "react-icons/io5";
import type { QuestionOption } from "@/components/ParticipantQuiz/types/participant.types";

interface AnswerOptionProps {
  option: QuestionOption;
  index: number;
  isSelected: boolean;
  isDisabled: boolean;
  onSelect: (optionId: string) => void;
}

export function AnswerOption({
  option,
  index,
  isSelected,
  isDisabled,
  onSelect,
}: AnswerOptionProps) {
  const handleClick = () => {
    if (!isDisabled) {
      onSelect(option.id);
    }
  };

  // Kahoot-style colors and icons
  const optionStyles = [
    {
      color: "bg-red-500 hover:bg-red-600",
      shadow: "shadow-red-500/50",
      icon: <IoTriangle size={32} className="text-white" />,
    },
    {
      color: "bg-blue-500 hover:bg-blue-600",
      shadow: "shadow-blue-500/50",
      icon: <FaDiamond size={32} className="text-white" />,
    },
    {
      color: "bg-yellow-500 hover:bg-yellow-600",
      shadow: "shadow-yellow-500/50",
      icon: <FaCircle size={32} className="text-white" />,
    },
    {
      color: "bg-green-500 hover:bg-green-600",
      shadow: "shadow-green-500/50",
      icon: <FaSquare size={32} className="text-white" />,
    },
    {
      color: "bg-purple-500 hover:bg-purple-600",
      shadow: "shadow-purple-500/50",
      icon: <IoTriangle size={32} className="text-white" />,
    },
    {
      color: "bg-pink-500 hover:bg-pink-600",
      shadow: "shadow-pink-500/50",
      icon: <FaDiamond size={32} className="text-white" />,
    },
  ];

  const style = optionStyles[index % optionStyles.length];

  // Format text: remove underscores, trim spaces, and capitalize words
  const formatText = (text: string) => {
    if (!text) return "";
    return text
      .replace(/_/g, " ")
      .trim()
      .replace(/\s+/g, " ") // clean double spaces
      .replace(/\b\w/g, (char) => char.toUpperCase()); // capitalize words
  };

  const displayText = formatText(option.text || option.optionText || "");

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: index * 0.1,
        type: "spring",
        stiffness: 200,
        damping: 15,
      }}
      whileHover={!isDisabled ? { scale: 1.05 } : {}}
      whileTap={!isDisabled ? { scale: 0.95 } : {}}
      onClick={handleClick}
      disabled={isDisabled}
      className={`
        relative w-full p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl text-left font-bold text-base sm:text-lg
        transition-all duration-200 
        ${
          isSelected
            ? `${style.color} text-white shadow-2xl ${style.shadow} ring-4 ring-white/40`
            : isDisabled
            ? "bg-gray-400 text-gray-600 cursor-not-allowed opacity-50"
            : `${style.color} text-white shadow-xl ${style.shadow}`
        }
      `}
    >
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
        {/* Kahoot-style icon */}
        <div
          className={`
            flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center 
            transition-all duration-200
            ${isSelected ? "bg-white/30 scale-110" : "bg-white/20"}
          `}
        >
          <div className="scale-75 sm:scale-90 md:scale-100">{style.icon}</div>
        </div>

        {/* Option text */}
        <span className="flex-1 text-white leading-tight break-words">
          {displayText}
        </span>

        {/* Selection checkmark */}
        {isSelected && (
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-white flex items-center justify-center"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </motion.div>
        )}
      </div>

      {/* Shine effect on hover */}
      {!isDisabled && (
        <motion.div
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.6 }}
        />
      )}
    </motion.button>
  );
}
