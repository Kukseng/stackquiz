"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const mentors = [
  {
    name: "Sreng Chipor",
    image: "/teacherchipor.png",
    shineColors: ["#3b82f6", "#eab308", "#ec4899"],
    borderColors: "border-blue-400",
    socials: { linkedin: "#", github: "#", instagram: "#" },
  },
  {
    name: "Srorng Sokcheat",
    image: "/teachersokcheat.JPG",
    shineColors: ["#f97316", "#eab308", "#ec4899"],
    borderColors: "border-orange-400",
    socials: { linkedin: "#", github: "#", instagram: "#" },
  },
];

export function MentorsSection() {
  return (
    <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 text-white overflow-hidden">
      {/* Add keyframe animations */}
      <style jsx>{`
        @keyframes colorCycle {
          0% {
            border-color: var(--color-0);
          }
          33.33% {
            border-color: var(--color-1);
          }
          66.66% {
            border-color: var(--color-2);
          }
          100% {
            border-color: var(--color-0);
          }
        }

        .animated-border-tr {
          animation: colorCycle 3s linear infinite;
        }

        .animated-border-bl {
          animation: colorCycle 3s linear infinite 0.5s;
        }

        /* Responsive border dimensions */
        @media (max-width: 640px) {
          .corner-border-tr {
            width: 180px;
            height: 360px;
            top: -1.5rem;
            right: -0.5rem;
          }

          .corner-border-bl {
            width: 180px;
            height: 360px;
            bottom: -10rem;
            left: -0.5rem;
          }
        }

        @media (min-width: 641px) and (max-width: 768px) {
          .corner-border-tr {
            width: 160px;
            height: 320px;
            top: -1.5rem;
            right: -0.5rem;
          }

          .corner-border-bl {
            width: 160px;
            height: 320px;
            bottom: -9rem;
            left: -0.5rem;
          }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
          .corner-border-tr {
            width: 180px;
            height: 380px;
            top: -1.5rem;
            right: 0;
          }

          .corner-border-bl {
            width: 180px;
            height: 380px;
            bottom: -10rem;
            left: 0;
          }
        }

        @media (min-width: 1025px) {
          .corner-border-tr {
            width: 220px;
            height: 460px;
            top: -1.5rem;
            right: 0;
          }

          .corner-border-bl {
            width: 220px;
            height: 460px;
            bottom: -10rem;
            left: 0;
          }
        }
      `}</style>

      {/* Section title */}
      <div className="text-center mb-30">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
          <span className="relative">
            Our <span className="text-yellow">Mentors</span>
            <span className="absolute left-0 -bottom-1 w-full h-[4px] bg-yellow-400"></span>
          </span>
        </h2>
      </div>

      {/* Mentor cards */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-30 sm:gap-16 md:gap-20 lg:gap-24 px-4 sm:px-6 md:px-8">
        {mentors.map((mentor, idx) => (
          <motion.div
            key={idx}
            className="relative flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: idx * 0.2 }}
            viewport={{ once: true, amount: 0.3 }}
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.3 },
            }}
            style={
              {
                "--color-0": mentor.shineColors[0],
                "--color-1": mentor.shineColors[1],
                "--color-2": mentor.shineColors[2],
              } as React.CSSProperties
            }
          >
            {/* Frame around image with animated colors */}
            <div className="relative w-72 h-72 xs:w-80 xs:h-80 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-72 lg:h-72 xl:w-80 xl:h-80 flex items-center justify-center">
              {/* Top-right corner with animated border */}
              <div
                className="absolute corner-border-tr border-t-3 sm:border-t-4 md:border-t-5 border-r-3 sm:border-r-4 md:border-r-5 rounded-tr-xl sm:rounded-tr-2xl animated-border-tr"
                style={{
                  filter: "drop-shadow(0 0 0px currentColor)",
                }}
              />

              {/* Bottom-left corner with animated border */}
              <div
                className="absolute corner-border-bl border-b-3 sm:border-b-4 md:border-b-5 border-l-3 sm:border-l-4 md:border-l-5 rounded-bl-xl sm:rounded-bl-2xl animated-border-bl"
                style={{
                  filter: "drop-shadow(0 0 0px currentColor)",
                }}
              />

              {/* ShineBorder wrapper */}
              <div className="relative p-[4px] sm:p-[5px] md:p-[6px] rounded-full overflow-hidden">
                {/* animated gradient border */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                />

                {/* white background to mask inner area */}
                <div className="relative p-[3px] sm:p-[4px] rounded-full bg-white">
                  <div className="relative w-64 h-64 xs:w-72 xs:h-72 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-64 lg:h-64 xl:w-72 xl:h-72">
                    <Image
                      src={mentor.image}
                      alt={mentor.name}
                      fill
                      sizes="(max-width: 640px) 256px, (max-width: 768px) 256px, (max-width: 1024px) 256px, (max-width: 1280px) 256px, 288px"
                      className="rounded-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Name */}
            <h3 className="mt-8 sm:mt-7 md:mt-8 text-2xl xs:text-3xl sm:text-2xl md:text-3xl lg:text-2xl xl:text-3xl font-semibold px-2">
              {mentor.name}
            </h3>

            {/* Social icons */}
            <div className="flex gap-6 sm:gap-5 md:gap-6 mt-6 sm:mt-5 md:mt-6">
              <a
                href={mentor.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-8 h-8 sm:w-7 sm:h-7 md:w-8 md:h-8 hover:scale-110 transition-transform duration-200"
              >
                <div className="w-full h-full flex items-center justify-center">
                  <Image
                    src="/LinkedIn.png"
                    alt="LinkedIn"
                    width={32}
                    height={32}
                    className="object-contain w-full h-full"
                  />
                </div>
              </a>

              <a
                href={mentor.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 hover:scale-110 transition-transform duration-200"
              >
                <div className="w-full h-full flex items-center justify-center">
                  <Image
                    src="/github.png"
                    alt="GitHub"
                    width={32}
                    height={32}
                    className="object-contain w-full h-full"
                  />
                </div>
              </a>

              <a
                href={mentor.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 hover:scale-110 transition-transform duration-200"
              >
                <div className="w-full h-full flex items-center justify-center">
                  <Image
                    src="/instagram.png"
                    alt="Instagram"
                    width={32}
                    height={32}
                    className="object-contain w-full h-full"
                  />
                </div>
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
