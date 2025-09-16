"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

import en from "@/locales/en.json";
import kh from "@/locales/km.json";

const teamMembers = [
  { 
    id: "rotha",
    image: "/ourImage/rotha.png", 
    shineColors: ["#60a5fa", "#fbbf24", "#ec4899"], 
    socials: { 
      linkedin: "https://www.linkedin.com/in/rotha-mom-266a512ba/", 
      github: "https://github.com/momrotha/", 
      telegram: "https://t.me/rothamomm" 
    } 
  },
  { 
    id: "mony",
    image: "/ourImage/mony.jpg", 
    shineColors: ["#fb923c", "#fbbf24", "#ec4899"], 
    socials: { 
      linkedin: "https://www.linkedin.com/in/rattanakmony-pech-b12a37335/", 
      github: "https://github.com/aintantony", 
      telegram: "https://t.me/aintantony" 
    } 
  },
  { 
    id: "kukseng",
    image: "/ourImage/kukseng.jpg", 
    shineColors: ["#4ade80", "#60a5fa", "#a855f7"], 
    socials: { 
      linkedin: "https://www.linkedin.com/in/kukseng-phou-5726b8317/", 
      github: "https://github.com/Kukseng", 
      telegram: "https://t.me/Kukseng" 
    } 
  },
  { 
    id: "channim",
    image: "/ourImage/channim.png", 
    shineColors: ["#60a5fa", "#fbbf24", "#ec4899"], 
    socials: { 
      linkedin: "https://www.linkedin.com/in/ey-channim-b318b8310/", 
      github: "https://github.com/ChannimEY", 
      telegram: "https://t.me/Jii_nim1" 
    } 
  },
  { 
    id: "dara",
    image: "/ourImage/dara.jpg", 
    shineColors: ["#c084fc", "#06b6d4", "#10b981"], 
    socials: { 
      linkedin: "https://www.linkedin.com/in/rouerm-dara-757176346", 
      github: "https://github.com/Roeurmdara", 
      telegram: "https://t.me/Roeurmdara" 
    } 
  },
  { 
    id: "loemheng",
    image: "/ourImage/heng.jpg", 
    shineColors: ["#4ade80", "#60a5fa", "#a855f7"], 
    socials: { 
      linkedin: "https://www.linkedin.com/in/ben-loemheng-145533326/", 
      github: "https://github.com/loemheng840", 
      telegram: "https://t.me/loemheng" 
    } 
  },
  { 
    id: "polin",
    image: "/mony.jpg", 
    shineColors: ["#8b5cf6", "#f59e0b", "#06b6d4"], 
    socials: { 
      linkedin: "https://github.com/polinchaing", 
      github: "https://github.com/polinchaing", 
      telegram: "https://t.me/Polinchaing" 
    } 
  },
  { 
    id: "senghong",
    image: "/ourImage/senghong.png", 
    shineColors: ["#14b8a6", "#f97316", "#ec4899"], 
    socials: { 
      linkedin: "https://www.linkedin.com/in/rouerm-dara-757176346", 
      github: "https://github.com/senghong", 
      telegram: "https://t.me/Lengsenghong" 
    } 
  },
];

export function TeamsSection() {
  const { language } = useLanguage();
  const t = language === "en" ? en : kh;
  const fontClass = language === "en" ? "en-font" : "kh-font";

  return (
    <section className={`relative py-20 text-white overflow-hidden ${fontClass}`}>
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

        .social-link {
          transition: transform 0.2s ease, opacity 0.2s ease;
        }

        .social-link:hover {
          transform: scale(1.2);
          opacity: 0.8;
        }
      `}</style>

      {/* Section Title */}
      <div className="text-center mb-20">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white">
          <span className="text-yellow text-underline">{t.heroAbout.ourTeam}</span>
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
                  alt={t.teams[member.id as keyof typeof t.teams]?.name || member.id}
                  width={250}
                  height={250}
                  className="rounded-full object-cover border-3 border-white w-60 h-60"
                />
              </div>
            </div>

            {/* Name & Position */}
            <h3 className="mt-6 text-xl font-semibold">
              {t.teams[member.id as keyof typeof t.teams]?.name || member.id}
            </h3>
            <p className="text-sm sm:text-base text-gray-300">
              {t.teams[member.id as keyof typeof t.teams]?.name || member.id}
            </p>

            {/* Social Icons */}
            <div className="flex gap-4 mt-4 relative z-10">
              {member.socials.linkedin && member.socials.linkedin !== "#" && (
                <a 
                  href={member.socials.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link cursor-pointer block relative z-10"
                  onClick={(e) => {
                    e.preventDefault();
                    window.open(member.socials.linkedin, '_blank');
                  }}
                >
                  <Image 
                    src="/social_media_icon/linkedin.svg" 
                    alt="LinkedIn" 
                    width={28} 
                    height={28} 
                    className="object-contain pointer-events-none" 
                  />
                </a>
              )}
              
              {member.socials.github && member.socials.github !== "#" && (
                <a 
                  href={member.socials.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link cursor-pointer block relative z-10"
                  onClick={(e) => {
                    e.preventDefault();
                    window.open(member.socials.github, '_blank');
                  }}
                >
                  <Image 
                    src="/social_media_icon/github.svg" 
                    alt="GitHub" 
                    width={28} 
                    height={28} 
                    className="object-contain pointer-events-none" 
                  />
                </a>
              )}
              
              {member.socials.telegram && member.socials.telegram !== "#" && (
                <a 
                  href={member.socials.telegram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link cursor-pointer block relative z-10"
                  onClick={(e) => {
                    e.preventDefault();
                    window.open(member.socials.telegram, '_blank');
                  }}
                >
                  <Image 
                    src="/social_media_icon/telegram.svg" 
                    alt="Telegram" 
                    width={28} 
                    height={28} 
                    className="object-contain pointer-events-none" 
                  />
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}