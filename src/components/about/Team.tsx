"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

import en from "@/locales/en.json";
import kh from "@/locales/km.json";

const teamMembers = [
  { name: "Mom Rotha", position: "Full Stack Developer", image: "/teacherchipor.png", shineColors: ["#60a5fa", "#fbbf24", "#ec4899"], socials: { linkedin: "#", github: "#", instagram: "#" } },
  { name: "Pech Rattanakmony", position: "Full Stack Developer", image: "/mony.jpg", shineColors: ["#fb923c", "#fbbf24", "#ec4899"], socials: { linkedin: "#", github: "#", instagram: "#" } },
  { name: "Phou Kukseng", position: "Full Stack Developer", image: "/kukseng.jpg", shineColors: ["#4ade80", "#60a5fa", "#a855f7"], socials: { linkedin: "#", github: "#", instagram: "#" } },
  { name: "Ey Channim", position: "Full Stack Developer", image: "/teacherchipor.png", shineColors: ["#60a5fa", "#fbbf24", "#ec4899"], socials: { linkedin: "#", github: "#", instagram: "#" } },
  { name: "Roeurm Dara", position: "Full Stack Developer", image: "/dara.jpg", shineColors: ["#c084fc", "#06b6d4", "#10b981"], socials: { linkedin: "#", github: "#", instagram: "#" } },
  { name: "Ben Leomheng", position: "Full Stack Developer", image: "/kukseng.jpg", shineColors: ["#4ade80", "#60a5fa", "#a855f7"], socials: { linkedin: "#", github: "#", instagram: "#" } },
  { name: "Chaing Polin", position: "Full Stack Developer", image: "/mony.jpg", shineColors: ["#8b5cf6", "#f59e0b", "#06b6d4"], socials: { linkedin: "#", github: "#", instagram: "#" } },
  { name: "Leng Senghong", position: "Full Stack Developer", image: "/mony.jpg", shineColors: ["#14b8a6", "#f97316", "#ec4899"], socials: { linkedin: "#", github: "#", instagram: "#" } },
];

export function TeamsSection() {
  const { language } = useLanguage();
  const t = language === "en" ? en : kh;

  return (
    <section className="relative py-20 text-white overflow-hidden">
      {/* Keyframe Animation */}
      <style jsx>{`
        @keyframes colorCycle {
          0%   { border-color: var(--color-0); }
          33%  { border-color: var(--color-1); }
          66%  { border-color: var(--color-2); }
          100% { border-color: var(--color-0); }
        }

        .animated-border {
          animation: colorCycle 2s linear infinite;
        }
      `}</style>

      {/* Section Title */}
      <div className="text-center mb-20">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white">
          <span className="text-yellow-400 underline">{t.heroAbout.ourTeam}</span>
        </h2>
      </div>

      {/* Team Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-14">
        {teamMembers.map((member, idx) => (
          <motion.div
            key={idx}
            className="relative flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: idx * 0.2 }}
            viewport={{ once: true, amount: 0.3 }}
            whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
            style={{
              "--color-0": member.shineColors[0],
              "--color-1": member.shineColors[1],
              "--color-2": member.shineColors[2],
            } as React.CSSProperties}
          >
            {/* Image Frame */}
            <div className="relative w-64 h-64 flex items-center justify-center">
              <div className="absolute -top-4 right-0 w-56 h-[300px] border-t-4 border-r-4 rounded-tr-2xl animated-border" />
              <div className="absolute -bottom-32 left-0 w-56 h-[300px] border-b-4 border-l-4 rounded-bl-2xl animated-border" />

              <div className="p-2 rounded-full bg-gradient-to-tr">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={250}
                  height={250}
                  className="rounded-full object-cover border-3 border-white w-60 h-60"
                />
              </div>
            </div>

            {/* Name & Position */}
            <h3 className="mt-6 text-xl font-semibold">{member.name}</h3>
            {member.position && <p className="text-sm sm:text-base text-gray-300">{member.position}</p>}

            {/* Social Icons */}
            <div className="flex gap-4 mt-4">
              <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer">
                <Image src="/linkedin.png" alt="LinkedIn" width={28} height={28} className="object-contain" />
              </a>
              <a href={member.socials.github} target="_blank" rel="noopener noreferrer">
                <Image src="/github.svg" alt="GitHub" width={28} height={28} className="object-contain" />
              </a>
              <a href={member.socials.instagram} target="_blank" rel="noopener noreferrer">
                <Image src="/instagram.png" alt="Instagram" width={28} height={28} className="object-contain" />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
