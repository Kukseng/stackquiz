"use client";
import { motion, useAnimation, useInView } from "framer-motion";
import { useRef, useEffect } from "react";

export function WhyChooseSection() {
  const features = [
    {
      title: "Customizable",
      description: "Easy learning experience and interactive quiz creation",
      gradient: "from-orange-400 via-red-400 to-pink-500",
      bg: "bg-orange-500/30", 
      image: "whychoose/vision.svg",
    },
    {
      title: "Global Community",
      description: "Connect with learners and educators from around the world",
      gradient: "from-green-400 via-blue-400 to-cyan-500",
      bg: "bg-green-500/30", 
      image: "whychoose/global.svg",
    },
    {
      title: "Fast & Easy",
      description: "Create quizzes within minutes and share them instantly",
      gradient: "from-pink-400 via-purple-400 to-indigo-500",
      bg: "bg-purple-500/30", 
      image: "whychoose/fast.svg",
      
    },
  ];

  const refs = features.map(() => useRef<HTMLDivElement>(null));
  const controls = features.map(() => useAnimation());
  const inViews = refs.map((ref) =>
    useInView(ref, { once: false, margin: "-100px" })
  );

  useEffect(() => {
    inViews.forEach((inView, idx) => {
      if (inView) {
        controls[idx].start({
          opacity: 1,
          y: 0,
          transition: {
            type: "spring",
            stiffness: 80,
            damping: 20,
            delay: idx * 0.2,
          },
        });
      } else {
        controls[idx].start({ opacity: 0, y: 50 });
      }
    });
  }, [inViews, controls]);

  return (
    <section className="py-20 glow-pink">
      <div className="max-w-7xl  mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          Why Choose <span className="text-yellow">StackQuizz ?</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              ref={refs[index]}
              initial={{ opacity: 0, y: 50 }}
              animate={controls[index]}
              className="relative rounded-2xl p-[3px]  overflow-hidden"
            >
              {/* Gradient Border Layer */}
              <div
                className={`absolute inset-0 bg-gradient-to-r  ${feature.gradient} animate-gradient-x`}
              />

              {/* Inner Card */}
              <div
                className={`relative  z-10 rounded-2xl p-8 text-white flex flex-col items-center ${feature.bg}`}
              >
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-16 h-16 mb-4"
                />
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-white/90 text-center">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
