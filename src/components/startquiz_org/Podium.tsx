"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";
import Stage from "./Stage";

export default function Podium() {
  const leaderboardData = [
    { name: "Dada", score: 2840, rank: 1, avatar: "/avatar.svg" },
    { name: "Bobo", score: 1969, rank: 2, avatar: "/avatar.svg" },
    { name: "Titi", score: 784, rank: 3, avatar: "/avatar.svg" },
  ];

  // Order: 2nd, 1st, 3rd
  const podiumOrder = [leaderboardData[1], leaderboardData[0], leaderboardData[2]];

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
    <Stage>
      <div className="mx-auto grid max-w-[760px] gap-6">
        {/* Subject Header */}
        <div className="mx-auto w-[680px] max-w-full rounded-2xl border border-[#f5c46b] bg-black/25 px-8 py-4 text-center text-3xl font-extrabold text-white">
          Computer Science
        </div>

        {/* Podium layout */}
        <div className="flex justify-center items-end gap-6 h-[660px]">
          {podiumOrder.map((player, index) => {
            const isFirst = player.rank === 1;

            const podiumHeight = isFirst ? 360 : index === 0 ? 240 : 200;
            const textSize =
              isFirst ? "text-7xl" : index === 0 ? "text-5xl" : "text-4xl";
            const scoreSize =
              isFirst ? "text-3xl" : index === 0 ? "text-2xl" : "text-xl";

            return (
              <motion.div
                key={player.rank}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={podiumVariants}
                className="flex flex-col items-center relative"
              >
                {/* Avatar */}
                <motion.div
                  className="w-24 h-24 bg-white rounded-full p-1 mb-4 shadow-lg cursor-pointer hover:scale-105 hover:shadow-2xl transition-transform relative"
                  animate={{ y: [0, -6, 0] }}
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
                <div className="bg-gradient-to-r from-orange-400 to-yellow-500 text-white px-4 py-1.5 rounded-full font-bold text-md mb-2 shadow-lg">
                  {player.name}
                </div>

                {/* Podium block */}
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
                  } rounded-t-3xl px-10 text-center shadow-xl flex flex-col justify-center`}
                  style={{
                    minHeight: `${podiumHeight}px`,
                    paddingTop: 14,
                    paddingBottom: 14,
                  }}
                >
                  <div className={`${textSize} font-black text-white mb-2`}>
                    {player.rank}
                  </div>
                  <div className={`${scoreSize} font-bold text-white`}>
                    {player.score}
                  </div>
                </motion.div>

                {/* Crown + sparkles for 1st place */}
                {isFirst && (
                  <>
                    <motion.div
                      className="absolute -top-14 left-1/2 -translate-x-1/2"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <Image
                        src="/crown.svg"
                        alt="Crown"
                        width={70}
                        height={60}
                        className="drop-shadow-[0_0_20px_rgba(255,215,0,1)]"
                      />
                    </motion.div>

                    <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 w-24 h-24 pointer-events-none">
                      {[...Array(6)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute bg-yellow-300 rounded-full"
                          style={{
                            top: "50%",
                            left: "50%",
                            width: "5px",
                            height: "5px",
                            boxShadow: "0 0 15px yellow, 0 0 25px gold",
                          }}
                          animate={{
                            x: [0, Math.random() * 30 - 15, 0],
                            y: [0, Math.random() * 30 - 15, 0],
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
    </Stage>
  );
}
