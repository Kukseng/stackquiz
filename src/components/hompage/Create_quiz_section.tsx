"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
export default function CreateQuizSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2, rootMargin: "-50px" }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full px-2  sm:px-3 md:px-4 lg:px-6">
      <div ref={sectionRef} className="max-w-3xl mx-auto">
        {/* Main Container */}
        <div
          className={`
            relative
            box-radius overflow-hidden shadow-lg
            transition-all duration-1000 ease-out
            ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-95"}
          `}
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-blue-400/25 to-blue-800/40 backdrop-blur-md rounded-xl p-6 shadow-lg">
            <div className="absolute -top-3 -right-3 w-24 h-24 bg-blue-400 bg-opacity-10 rounded-full blur-lg animate-pulse"></div>
            <div
              className="absolute top-1/2 -left-6 w-20 h-20 bg-blue-600 bg-opacity-20 rounded-full blur-md animate-bounce"
              style={{ animationDelay: "1s", animationDuration: "3s" }}
            ></div>
            <div 
              className="absolute bottom-6 right-1/4 w-12 h-12 bg-purple-400 bg-opacity-15 rounded-full blur-sm animate-pulse"
              style={{ animationDelay: "2s" }}
            ></div>
          </div>

          {/* Content Grid */}
          <div className="relative grid rounded-2xl md:bg-gradient-to-br from-white/1 to-white/10 lg:grid-cols-2 p-4 lg:p-8 items-center">
            {/* Left Content */}
            <div
              className={`
                space-y-6 text-center lg:text-left
                transition-all duration-1200 ease-out
                ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"}
              `}
              style={{ transitionDelay: "200ms" }}
            >
              {/* Main Heading */}
              <div className="space-y-3">
                <h1
                  className={`
                    text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight
                    transition-all duration-1000 ease-out
                    ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
                  `}
                  style={{ transitionDelay: "600ms" }}
                >
                  Create Amazing
                  <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                    Quiz Games
                  </span>
                </h1>

                <p
                  className={`
                    text-lg sm:text-xl text-gray-300  font-light leading-relaxed
                    transition-all duration-1000 ease-out
                    ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
                  `}
                  style={{ transitionDelay: "800ms" }}
                >
                  Engage your audience with interactive quizzes.
                  <br className="hidden sm:block" />
                  <span className="text-yellow-200 font-medium">Play together, learn together.</span>
                </p>
              </div>

              {/* CTA Button */}
              <div
                className={`
                  transition-all duration-1000 ease-out 
                  ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
                `}
                style={{ transitionDelay: "1000ms" }}
              >
                <Link href="/signup" className="flex items-center gap-2">
                <Button className="btn-secondary box-radius btn-text px-4 py-3 sm:py-3 rounded-lg font-semibold text-sm sm:text-base">
                  Get Started
                </Button>
                </Link>
              </div>

              {/* Feature Points */}
              <div
                className={`
                  flex flex-wrap gap-4 justify-center lg:justify-start text-blue-100
                  transition-all duration-1000 ease-out
                  ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
                `}
                style={{ transitionDelay: "1200ms" }}
              >
                {["No Setup Required", "Real-time Results", "Mobile Friendly"].map((feature, index) => (
                  <div key={feature} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 bg-green-400 rounded-full animate-pulse"
                      style={{ animationDelay: `${index * 0.2}s` }}
                    />
                    <span className="text-sm text-gray-50 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Image (responsive) */}
            <div className="flex justify-center mt-6 md:justify-end">
              <div className="w-full max-w-[150px] sm:max-w-[200px] md:max-w-[250px] lg:max-w-[300px]">
                <Image
                  src="/quiz.svg"
                  alt="People engaging with quiz platform"
                  width={500} 
                  height={500} 
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
