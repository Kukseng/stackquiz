"use client";

import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { motion, Variants } from "framer-motion";

export default function Rank() {
  const leaderboardData = [
    { name: "Dada", score: 2840, rank: 1, avatar: "/avatar.svg" },
    { name: "Bobo", score: 1969, rank: 2, avatar: "/avatar.svg" },
    { name: "Titi", score: 784, rank: 3, avatar: "/avatar.svg" },
  ];

  // order: 2nd, 1st, 3rd
  const podiumOrder = [
    leaderboardData[1],
    leaderboardData[0],
    leaderboardData[2],
  ];

  const podiumVariants: Variants = {
    hidden: { y: 100, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.25,
        type: "spring",
        stiffness: 120,
      },
    }),
  };

  return (
    <div
      className="relative overflow-hidden h-[780px] p-6"
      style={{
        backgroundImage: "url('/hey2.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: "1rem",
        boxShadow: "0 4px 30px rgba(0,0,0,0.2)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 relative">
            <Image src="/logo.png" alt="Logo" fill className="object-contain" />
          </div>
          <h1 className="text-4xl font-black text-white">
            STACK<span className="text-yellow-400">QUIZZ</span>
          </h1>
        </div>
        <Badge className="px-6 py-3 text-lg bg-white text-gray-800 rounded-full font-bold shadow-lg">
          Computer Science
        </Badge>
      </div>

      {/* Podiums */}
      <div className="flex justify-center items-end gap-1 h-[660px]">
        {podiumOrder.map((player, index) => {
          const isFirst = player.rank === 1;

          // podium heights & styles
          const podiumHeight = isFirst ? 360 : index === 0 ? 240 : 200;
          const podiumPadding = isFirst ? 20 : index === 0 ? 14 : 10;
          const textSize =
            isFirst ? "text-9xl" : index === 0 ? "text-7xl" : "text-6xl";
          const scoreSize =
            isFirst ? "text-5xl" : index === 0 ? "text-3xl" : "text-2xl";

          return (
            <motion.div
              key={player.rank}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={podiumVariants}
              className="flex flex-col items-center relative"
            >
              {/* Avatar with hover effect */}
              <motion.div
                className="w-32 h-32 bg-white rounded-full p-1 mb-4 shadow-lg cursor-pointer hover:scale-105 hover:shadow-2xl transition-transform relative"
                animate={{ y: [0, -8, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  delay: index * 0.3,
                }}
              >
                <Image
                  src={player.avatar || "/placeholder.svg"}
                  alt={player.name}
                  fill
                  className="rounded-full object-cover"
                />
              </motion.div>

              {/* Name */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.3 + 0.2 }}
                className="bg-gradient-to-r from-orange-400 to-yellow-500 text-white px-6 py-2 rounded-full font-bold text-lg mb-2 shadow-lg"
              >
                {player.name}
              </motion.div>

              {/* Podium */}
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{
                  delay: index * 0.3 + 0.4,
                  type: "spring",
                  stiffness: 120,
                }}
                className={`bg-gradient-to-t ${
                  isFirst
                    ? "from-orange-600 to-orange-400"
                    : "from-blue-700 to-blue-500"
                } rounded-t-3xl px-16 text-center shadow-xl flex flex-col justify-center`}
                style={{
                  minHeight: `${podiumHeight}px`,
                  paddingTop: podiumPadding,
                  paddingBottom: podiumPadding,
                }}
              >
                <div className={`${textSize} font-black text-white mb-4`}>
                  {player.rank}
                </div>
                <div className={`${scoreSize} font-bold text-white`}>
                  {player.score}
                </div>
              </motion.div>

              {/* Crown + Sparkle effects for 1st place */}
              {isFirst && (
                <>
                  {/* Crown as Image */}
                  <motion.div
                    className="absolute -top-16 left-1/2 -translate-x-1/2"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <Image
                      src="/crown.svg" 
                      alt="Crown"
                      width={90}
                      height={80}
                      className="drop-shadow-[0_0_20px_rgba(255,215,0,1)]"
                    />
                  </motion.div>

                  {/* Sparkles */}
                  <div className="absolute -top-28 left-1/2 transform -translate-x-1/2 w-32 h-32 pointer-events-none">
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute bg-yellow-300 rounded-full"
                        style={{
                          top: "50%",
                          left: "50%",
                          width: "6px",
                          height: "6px",
                          boxShadow: "0 0 20px yellow, 0 0 40px gold",
                        }}
                        animate={{
                          x: [0, Math.random() * 40 - 20, 0],
                          y: [0, Math.random() * 40 - 20, 0],
                          opacity: [0, 1, 0],
                          scale: [0.7, 1.2, 0.7],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.2 + Math.random(),
                          delay: i * 0.15,
                        }}
                      />
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
