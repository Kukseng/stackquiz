"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const teamMembers = [
  {
    name: "Mom Rotha",
    position: "Full Stack Developer",
    image: "/teacherchipor.png",
    frameColor: "from-blue-400 to-yellow-400",
    shineColors: ["#60a5fa", "#fbbf24", "#ec4899"], // blue-400, yellow-400, pink-400
    socials: { linkedin: "#", github: "#", instagram: "#" },
  },
  {
    name: "Pech Rattanakmony",
    position: "Full Stack Developer",
    image: "/mony.jpg",
    frameColor: "from-orange-400 to-pink-400",
    shineColors: ["#fb923c", "#fbbf24", "#ec4899"], // orange-400, yellow-400, pink-400
    socials: { linkedin: "#", github: "#", instagram: "#" },
  },
  {
    name: "Phou Kukseng",
    position: "Full Stack Developer",
    image: "/kukseng.jpg",
    frameColor: "from-green-400 to-blue-400",
    shineColors: ["#4ade80", "#60a5fa", "#a855f7"], // green-400, blue-400, purple-500
    socials: { linkedin: "#", github: "#", instagram: "#" },
  },
  {
    name: "Ey Channim",
    position: "Full Stack Developer",
    image: "/member4.jpg",
    frameColor: "from-purple-400 to-pink-400",
    shineColors: ["#c084fc", "#ec4899", "#f59e0b"], // purple-400, pink-400, amber-500
    socials: { linkedin: "#", github: "#", instagram: "#" },
  },
  {
    name: "Roeurm Dara",
    position: "Full Stack Developer",
    image: "/dara.jpg",
    frameColor: "from-purple-400 to-pink-400",
    shineColors: ["#c084fc", "#06b6d4", "#10b981"], // purple-400, cyan-500, emerald-500
    socials: { linkedin: "#", github: "#", instagram: "#" },
  },
  {
    name: "Ben Leomheng",
    position: "Full Stack Developer",
    image: "/member4.jpg",
    frameColor: "from-purple-400 to-pink-400",
    shineColors: ["#f97316", "#eab308", "#ef4444"],
    socials: { linkedin: "#", github: "#", instagram: "#" },
  },
  {
    name: "Chaing Polin",
    position: "Full Stack Developer",
    image: "/member4.jpg",
    frameColor: "from-purple-400 to-pink-400",
    shineColors: ["#8b5cf6", "#06b6d4", "#f59e0b"],
    socials: { linkedin: "#", github: "#", instagram: "#" },
  },
  {
    name: "Leng Senghong",
    position: "Full Stack Developer",
    image: "/member4.jpg",
    frameColor: "from-purple-400 to-pink-400",
    shineColors: ["#14b8a6", "#f97316", "#ec4899"],
    socials: { linkedin: "#", github: "#", instagram: "#" },
  },
];

export function TeamsSection() {
  return (
    <section className="relative py-20 text-white overflow-hidden">
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
          animation: colorCycle 1.5s linear infinite; /* faster speed */
        }

        .animated-border-bl {
          animation: colorCycle 1.5s linear infinite 0.25s; /* faster speed, offset */
        }
      `}</style>

      {/* Section title */}
      <div className="text-center mb-30">
  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
    <span className="relative">
      Our{" "}
      <span className="text-yellow">
        Team
      </span>
      <span className="absolute left-0 -bottom-1 w-full h-[4px] bg-yellow-400"></span>
    </span>
  </h2>
</div>

      {/* Team member cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-35 gap-y-30">
        {teamMembers.map((member, idx) => (
          <motion.div
            key={idx}
            className="relative flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: idx * 0.2 }}
            viewport={{ once: true, amount: 0.3 }}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.3 },
            }}
            style={
              {
                "--color-0": teamMembers[idx].shineColors[0],
                "--color-1": teamMembers[idx].shineColors[1],
                "--color-2": teamMembers[idx].shineColors[2],
              } as React.CSSProperties
            }
          >
            {/* Frame around image with animated colors */}
            <div className="relative w-72 h-72 flex items-center justify-center">
              {/* Top-right animated border */}
              <div
                className="absolute -top-6 right-0 w-56 h-[420px] border-t-5 border-r-5 rounded-tr-2xl animated-border-tr"
                style={{}}
              />

              {/* Bottom-left animated border */}
              <div
                className="absolute -bottom-40 left-0 w-56 h-[420px] border-b-5 border-l-5 rounded-bl-2xl animated-border-bl"
                style={{}}
              />

              <div className="p-4 rounded-full bg-gradient-to-tr ">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={288}
                  height={288}
                  className="rounded-full object-cover border-4 w-64 h-64 border-white"
                />
              </div>
            </div>

            <h3 className="mt-8 text-xl font-semibold">{member.name}</h3>
            {member.position && (
              <p className="text-sm sm:text-base text-gray-300">
                {member.position}
              </p>
            )}

            {/* Social icons */}
            <div className="flex gap-6 mt-4 text-2xl">
              <a
                href={member.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-8 h-8"
              >
                <div className="w-full h-full overflow-hidden flex items-center justify-center">
                  <Image
                    src="/linkedin.png"
                    alt="LinkedIn"
                    width={30}
                    height={30}
                    className="object-contain"
                  />
                </div>
              </a>
              <a
                href={member.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-8 h-8"
              >
                <div className="w-full h-full overflow-hidden flex items-center justify-center">
                  <Image
                    src="/github.png"
                    alt="GitHub"
                    width={30}
                    height={30}
                    className="object-contain"
                  />
                </div>
              </a>
              <a
                href={member.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-8 h-8"
              >
                <div className="w-full h-full overflow-hidden flex items-center justify-center">
                  <Image
                    src="/instagram.png"
                    alt="Instagram"
                    width={30}
                    height={30}
                    className="object-contain"
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
