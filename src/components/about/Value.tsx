"use client"
// components/ValuesSection.tsx
import React from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

import en from "@/locales/en.json";
import kh from "@/locales/km.json";
interface ValueCardProps {
  title: string;
  description: string;
  gradient: string;
  icon?: string; // path to image
}

const ValueCard: React.FC<ValueCardProps> = ({ title, description, gradient, icon }) => {
  return (
    <div
      className={`
        relative p-6 sm:p-8 rounded-3xl text-white 
        overflow-hidden transform transition-all duration-500
        hover:scale-105 
        group
      `}
    >
      {/* Animated gradient background */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${gradient} animate-gradient-background backdrop-blur-2xl  opacity-70 transition-all duration-1000`}
      ></div>

      {/* Card content */}
      <div className="relative flex flex-col items-center text-center space-y-4">
        {icon && (
          <div className="mb-2 transform transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 w-16 h-16 flex items-center justify-center">
            <Image
              src={icon}
              alt={`${title} Icon`}
              width={64}
              height={64}
              className="object-contain"
            />
          </div>
        )}
        <h3 className="text-2xl sm:text-3xl font-extrabold">{title}</h3>
        <p className="text-base sm:text-lg text-white/90">{description}</p>
      </div>
    </div>
  );
};

// Gradient animation CSS
const style = `
@keyframes gradient-background {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.animate-gradient-background {
  background-size: 200% 200%;
  animation: gradient-background 6s ease infinite;
}
`;

export const ValuesSection: React.FC = () => {
  const { language } = useLanguage();
  const t = language === "en" ? en : kh;

  return (
    <section className="container mx-auto px-4 sm:px-8 lg:px-16 py-20 text-center relative">
      <style>{style}</style>
      
      {/* Title */}
      <div className="text-center mb-30">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
          <span className="relative">
            <span className="text-yellow text-underline">{t.heroAbout.value}</span>
          </span>
        </h2>
      </div>

      {/* Values List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {t.heroAbout.values.map((value, index) => (
          <ValueCard
            key={index}
            title={value.title}
            description={value.description}
            gradient={
              index === 0
                ? "from-lime-500 via-green-500 to-emerald-600"
                : index === 1
                ? "from-green-400 via-blue-400 to-indigo-500"
                : "from-purple-400 via-pink-400 to-red-400"
            }
            icon={
              index === 0
                ? "/puzzle.png"
                : index === 1
                ? "/rocket.png"
                : "/book.png"
            }
          />
        ))}
      </div>
    </section>
  );
};

