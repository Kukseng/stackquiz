"use client"

import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { motion } from "framer-motion"

export default function Rank() {
  const leaderboardData = [
    { name: "Dada", score: 2840, rank: 1, avatar: "/avatar.svg" },
    { name: "Bobo", score: 1969, rank: 2, avatar: "/avatar.svg" },
    { name: "Titi", score: 784, rank: 3, avatar: "/avatar.svg" },
  ]

  const podiumOrder = [leaderboardData[1], leaderboardData[0], leaderboardData[2]] // 2nd, 1st, 3rd

  const podiumVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: { delay: i * 0.25, type: "spring", stiffness: 120 },
    }),
  }

  const sparkleVariants = {
    animate: {
      scale: [1, 1.6, 1],
      opacity: [0.7, 1, 0.7],
      transition: { repeat: Infinity, duration: 1.5, repeatDelay: 0.2 },
    },
  }

  return (
    <div
      className="relative overflow-hidden h-[780px] p-6"
      style={{
        backgroundImage: "url('/background2.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: "1rem",
        boxShadow: "0 4px 30px rgba(0,0,0,0.2)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
    >
      {/* Background floating dots */}
      {Array.from({ length: 100 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/40 rounded-full"
          style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
          animate={{ y: [0, -10, 0], opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 4, delay: Math.random() * 3 }}
        />
      ))}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
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
      <div className="flex justify-center items-end gap-2  h-[660px]">
        {podiumOrder.map((player, index) => {
          const isFirst = player.rank === 1
          const podiumHeight = isFirst ? 300 : index === 0 ? 200 : 160
          const podiumPadding = isFirst ? 16 : index === 0 ? 12 : 8
          const textSize = isFirst ? "text-9xl" : index === 0 ? "text-8xl" : "text-7xl"
          const scoreSize = isFirst ? "text-4xl" : index === 0 ? "text-3xl" : "text-2xl"

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
                className="w-32 h-32 bg-white rounded-full p-1 mb-4 shadow-lg cursor-pointer hover:scale-105 hover:shadow-2xl transition-transform"
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 2, delay: index * 0.3 }}
              >
                <img
                  src={player.avatar || "/placeholder.svg"}
                  alt={player.name}
                  className="w-full h-full rounded-full object-cover"
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
                transition={{ delay: index * 0.3 + 0.4, type: "spring", stiffness: 120 }}
                className={`bg-gradient-to-t ${
                  isFirst ? "from-orange-600 to-orange-400" : "from-blue-700 to-blue-500"
                } rounded-t-3xl px-16 py-${podiumPadding} text-center shadow-xl min-h-[${podiumHeight}px] flex flex-col justify-center`}
              >
                <div className={`${textSize} font-black text-white mb-4`}>{player.rank}</div>
                <div className={`${scoreSize} font-bold text-white`}>{player.score}</div>
              </motion.div>

              {/* Crown for 1st place */}
              {isFirst && (
                <motion.div
                  className="absolute -top-18 text-6xl"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  👑
                 
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
