"use client";

import { motion, useAnimation, useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import Image from "next/image";

export function WhyChooseSection() {
  const features = [
    {
      title: "Customizable",
      description: "Easy learning experience and interactive quiz creation",
      gradient: "from-orange-400 via-red-400 to-pink-500",
      bg: "bg-orange-500/30",
      image: "/whychoose/vision.svg",
    },
    {
      title: "Global Community",
      description: "Connect with learners and educators from around the world",
      gradient: "from-green-400 via-blue-400 to-cyan-500",
      bg: "bg-green-500/30",
      image: "/whychoose/global.svg",
    },
    {
      title: "Fast & Easy",
      description: "Create quizzes within minutes and share them instantly",
      gradient: "from-pink-400 via-purple-400 to-indigo-500",
      bg: "bg-purple-500/30",
      image: "/whychoose/fast.svg",
    },
  ];

  // Create refs, controls, and inView individually
  const feature1Ref = useRef<HTMLDivElement>(null);
  const feature1Controls = useAnimation();
  const feature1InView = useInView(feature1Ref, { once: false, margin: "-100px" });

  const feature2Ref = useRef<HTMLDivElement>(null);
  const feature2Controls = useAnimation();
  const feature2InView = useInView(feature2Ref, { once: false, margin: "-100px" });

  const feature3Ref = useRef<HTMLDivElement>(null);
  const feature3Controls = useAnimation();
  const feature3InView = useInView(feature3Ref, { once: false, margin: "-100px" });

  useEffect(() => {
    if (feature1InView)
      feature1Controls.start({
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 80, damping: 20, delay: 0 },
      });
    else feature1Controls.start({ opacity: 0, y: 50 });

    if (feature2InView)
      feature2Controls.start({
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 80, damping: 20, delay: 0.2 },
      });
    else feature2Controls.start({ opacity: 0, y: 50 });

    if (feature3InView)
      feature3Controls.start({
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 80, damping: 20, delay: 0.4 },
      });
    else feature3Controls.start({ opacity: 0, y: 50 });
  }, [
    feature1InView,
    feature2InView,
    feature3InView,
    feature1Controls,
    feature2Controls,
    feature3Controls,
  ]);

  return (
    <section className="py-12 glow-pink">
      <div className="max-w-7xl mx-auto text-center">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            <span className="relative">
              Why choose <span className="text-yellow-400">STACKQUIZ?</span>
              <span className="absolute left-0 -bottom-1 w-full h-[4px] bg-yellow-400"></span>
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {/* Feature 1 */}
          <motion.div
            ref={feature1Ref}
            initial={{ opacity: 0, y: 50 }}
            animate={feature1Controls}
            className="relative rounded-2xl p-[3px] card-glow transform transition duration-300 hover:scale-110 overflow-hidden"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-r ${features[0].gradient} animate-gradient-x`}
            />
            <div
              className={`relative z-10 rounded-2xl p-8 text-white flex flex-col items-center ${features[0].bg}`}
            >
              <div className="relative w-16 h-16 mb-4">
                <Image src={features[0].image} alt={features[0].title} fill className="object-contain" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{features[0].title}</h3>
              <p className="text-white/90 text-center">{features[0].description}</p>
            </div>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            ref={feature2Ref}
            initial={{ opacity: 0, y: 50 }}
            animate={feature2Controls}
            className="relative rounded-2xl p-[3px] card-glow transform transition duration-300 hover:scale-110 overflow-hidden"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-r ${features[1].gradient} animate-gradient-x`}
            />
            <div
              className={`relative z-10 rounded-2xl p-8 text-white flex flex-col items-center ${features[1].bg}`}
            >
              <div className="relative w-16 h-16 mb-4">
                <Image src={features[1].image} alt={features[1].title} fill className="object-contain" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{features[1].title}</h3>
              <p className="text-white/90 text-center">{features[1].description}</p>
            </div>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            ref={feature3Ref}
            initial={{ opacity: 0, y: 50 }}
            animate={feature3Controls}
            className="relative rounded-2xl p-[3px] card-glow transform transition duration-300 hover:scale-110 overflow-hidden"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-r ${features[2].gradient} animate-gradient-x`}
            />
            <div
              className={`relative z-10 rounded-2xl p-8 text-white flex flex-col items-center ${features[2].bg}`}
            >
              <div className="relative w-16 h-16 mb-4">
                <Image src={features[2].image} alt={features[2].title} fill className="object-contain" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{features[2].title}</h3>
              <p className="text-white/90 text-center">{features[2].description}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
