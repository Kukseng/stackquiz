"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

import en from "@/locales/en.json";
import kh from "@/locales/km.json";

const mentors = [
  {
    key: "mentor1",
    image: "/ourImage/teachersokcheat.jpg",
    shineColors: ["#f97316", "#eab308", "#ec4899"],
    socials: {
      linkedin: "https://linkedin.com/in/sokcheatsrorng",
      github: "https://github.com/Sokcheatsrorng",
      telegram: "https://t.me/Sokcheat_srorng",
    },
  },
  {
    key: "mentor12",
    image: "/ourImage/teacherchipor.png",
    shineColors: ["#3b82f6", "#eab308", "#ec4899"],
    socials: {
      linkedin: "https://linkedin.com/in/srengchipor",
      github: "https://github.com/jiporCK",
      telegram: "https://t.me/jiporsreng",
    },
  },
];

export function MentorsSection() {
  const { language } = useLanguage();
  const t = language === "en" ? en : kh;

  return (
    <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 text-white overflow-hidden">
      <style jsx>{`
        @keyframes colorCycle {
          0% { border-color: var(--color-0); }
          33.33% { border-color: var(--color-1); }
          66.66% { border-color: var(--color-2); }
          100% { border-color: var(--color-0); }
        }
        .animated-border-tr { animation: colorCycle 3s linear infinite; }
        .animated-border-bl { animation: colorCycle 3s linear infinite 0.5s; }
        .corner-border-tr, .corner-border-bl { pointer-events: none; }

        /* Responsive sizes */
        @media (max-width: 640px) {
          .corner-border-tr { width: 180px; height: 360px; top: -1.5rem; right: -0.5rem; }
          .corner-border-bl { width: 180px; height: 360px; bottom: -10rem; left: -0.5rem; }
        }
        @media (min-width: 641px) and (max-width: 768px) {
          .corner-border-tr { width: 160px; height: 320px; top: -1.5rem; right: -0.5rem; }
          .corner-border-bl { width: 160px; height: 320px; bottom: -9rem; left: -0.5rem; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .corner-border-tr { width: 180px; height: 380px; top: -1.5rem; right: 0; }
          .corner-border-bl { width: 180px; height: 380px; bottom: -10rem; left: 0; }
        }
        @media (min-width: 1025px) {
          .corner-border-tr { width: 220px; height: 460px; top: -1.5rem; right: 0; }
          .corner-border-bl { width: 220px; height: 460px; bottom: -10rem; left: 0; }
        }
      `}</style>

      {/* Section Title */}
      <div className="text-center mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
          <span className="text-yellow text-underline">{t.heroAbout.mentor}</span>
        </h2>
      </div>

      {/* Mentor Cards */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 md:gap-20 lg:gap-24 px-4 sm:px-6 md:px-8">
        {mentors.map((mentor, idx) => (
          <motion.div
            key={mentor.key}
            className="relative flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: idx * 0.2 }}
            viewport={{ once: true, amount: 0.3 }}
            whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
            style={{
              "--color-0": mentor.shineColors[0],
              "--color-1": mentor.shineColors[1],
              "--color-2": mentor.shineColors[2],
            } as React.CSSProperties}
          >
            {/* Image with animated border */}
            <div className="relative w-72 h-72 xs:w-80 xs:h-80 flex items-center justify-center">
              <div className="absolute corner-border-tr border-t-4 border-r-4 rounded-tr-2xl animated-border-tr" />
              <div className="absolute corner-border-bl border-b-4 border-l-4 rounded-bl-2xl animated-border-bl" />

              <div className="relative p-[4px] rounded-full overflow-hidden">
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                />
                <div className="relative p-[3px] rounded-full bg-white">
                  <div className="relative w-64 h-64 xs:w-72 xs:h-72">
                    <Image
                      src={mentor.image}
                      alt={t.mentors[mentor.key as keyof typeof t.mentors].name}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Name & Role */}
            <h3 className="mt-6 text-2xl font-semibold">
  {t.mentors[mentor.key as keyof typeof t.mentors].name}
</h3>
<p className="mt-2 text-gray-300 text-base sm:text-lg">
  {t.mentors[mentor.key as keyof typeof t.mentors].role}
</p>
            {/* Social links */}
            <div className="flex gap-6 mt-6">
              {Object.entries(mentor.socials).map(([key, link]) => (
                <a
                  key={key}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 hover:scale-110 transition-transform flex items-center justify-center"
                >
                  <Image
                    src={`/social_media_icon/${key}.svg`}
                    alt={key}
                    width={28}
                    height={28}
                    className="object-contain"
                  />
                </a>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
