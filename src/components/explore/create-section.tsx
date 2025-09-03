"use client";
import React, { useRef, useEffect } from "react";
import { Plus, Heart } from "lucide-react";
import { motion, useAnimation, useInView } from "framer-motion";

interface CardType {
  id: number;
  title: string;
  desc: string;
  icon: React.ReactNode;
  buttonText: string;
  buttonColor: string;
  iconBg: string;
}

const cards: CardType[] = [
  {
    id: 1,
    title: "Your StackQuiz",
    desc: "Use the StackQuiz creator to build your own quizzes from scratch",
    icon: <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />,
    buttonText: "Create your first StackQuiz",
    buttonColor: "text-blue-600",
    iconBg: "bg-blue-600",
  },
  {
    id: 2,
    title: "Favorite StackQuiz",
    desc: "Find your favorite learning resources and save them for later",
    icon: <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-red-300" />,
    buttonText: "Go to Discover",
    buttonColor: "text-red-500",
    iconBg: "bg-red-500",
  },
];

// Extracted Card Component
const AnimatedCard: React.FC<{ card: CardType; index: number }> = ({ card, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const inView = useInView(ref, { once: false, margin: "-100px" });

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 80, damping: 20, delay: index * 0.1 },
      });
    } else {
      controls.start({ opacity: 0, y: 30 });
    }
  }, [inView, controls, index]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={controls}
      whileHover={{ scale: 1.05, boxShadow: "0px 15px 25px rgba(0,0,0,0.2)" }}
      className="bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 text-white relative overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300"
    >
      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center flex-shrink-0">
            {card.icon}
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">{card.title}</h2>
            <p className="text-blue-100 text-xs sm:text-sm leading-relaxed max-w-sm">{card.desc}</p>
          </div>
        </div>

        {/* Dotted Container */}
        <div className="border-2 border-dashed border-white border-opacity-40 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 text-center">
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            {card.icon}
          </div>

          <button
            className={`bg-white bg-opacity-90 ${card.buttonColor} px-4 py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-3 rounded-full font-semibold hover:bg-opacity-100 hover:scale-105 transition-all duration-200 shadow-lg text-sm sm:text-base`}
          >
            {card.buttonText}
          </button>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 opacity-10">
        <div className="w-full h-full bg-white rounded-full transform translate-x-12 sm:translate-x-16 -translate-y-12 sm:-translate-y-16"></div>
      </div>
    </motion.div>
  );
};

const CreateDiscoverQuiz: React.FC = () => {
  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-yellow-400 text-center mb-8 sm:mb-12 md:mb-16 px-4 leading-tight">
          Create and discover amazing quizzes
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
          {cards.map((card, index) => (
            <AnimatedCard key={card.id} card={card} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreateDiscoverQuiz;
