"use client"

import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { motion, type Variants } from "framer-motion"

interface LeaderboardEntry {
  participantId: string
  nickname: string
  totalScore: number
  position: number
  rank: number
  isCurrentUser?: boolean
  avatarId?: string
  questionsAnswered?: number
  correctAnswers?: number
  streak?: number
  positionChange?: number
  isOnline?: boolean
  lastActivity?: string
  status?: string
}

interface RankProps {
  leaderboard: LeaderboardEntry[]
  quizTitle?: string // Add quiz title prop
}

export default function Rank({ leaderboard, quizTitle = "Quiz Challenge" }: RankProps) {
  // Ensure we have at least 3 entries for the podium
  const topThree = leaderboard
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 3)
    .map((entry, index) => ({
      name: entry.nickname,
      score: entry.totalScore,
      rank: entry.position,
      avatar: entry.avatarId || "/avatar.svg",
    }))

  // Order: 2nd, 1st, 3rd for podium display
  const podiumOrder = topThree.length >= 3 ? [topThree[1], topThree[0], topThree[2]] : topThree

  // Animation variants for podium
  const podiumVariants: Variants = {
    hidden: { y: 100, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.3,
        type: "spring",
        stiffness: 120,
        damping: 15,
      },
    }),
  }

  // Animation variants for avatar
  const avatarVariants: Variants = {
    initial: { scale: 0, rotate: -20 },
    animate: (i: number) => ({
      scale: 1,
      rotate: 0,
      transition: {
        delay: i * 0.3,
        type: "spring",
        stiffness: 200,
        damping: 10,
      },
    }),
    hover: { scale: 1.1, rotate: 5, transition: { duration: 0.3 } },
  }

  // Animation variants for name tag
  const nameVariants: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.3 + 0.2, duration: 0.4 },
    }),
  }

  // Animation variants for score text
  const scoreVariants: Variants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: { delay: i * 0.3 + 0.4, type: "spring", stiffness: 150 },
    }),
  }

  return (
    <div
      className="relative overflow-hidden h-[780px] p-6 md:p-8"
      style={{
        backgroundImage: "url('/hey2.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: "1rem",
        boxShadow: "0 4px 30px rgba(0,0,0,0.3)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4 md:gap-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-12 h-12 md:w-16 md:h-16 relative"
          >
            <Image src="/logo.png" alt="Logo" fill className="object-contain" />
          </motion.div>
          <motion.h1
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-2xl md:text-4xl font-black text-white"
          >
            STACK<span className="text-yellow-400">QUIZZ</span>
          </motion.h1>
        </div>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Badge className="px-4 py-2 text-sm md:text-lg bg-white text-gray-800 rounded-full font-bold shadow-lg max-w-xs truncate">
            {quizTitle}
          </Badge>
        </motion.div>
      </div>

      {/* Podiums */}
      <div className="flex justify-center items-end gap-2 md:gap-4 h-[660px]">
        {podiumOrder.map((player, index) => {
          const isFirst = player.rank === 1

          // Podium heights & styles
          const podiumHeight = isFirst ? 360 : index === 0 ? 240 : 200
          const podiumPadding = isFirst ? 20 : index === 0 ? 14 : 10
          const textSize = isFirst
            ? "text-7xl md:text-9xl"
            : index === 0
              ? "text-5xl md:text-7xl"
              : "text-4xl md:text-6xl"
          const scoreSize = isFirst
            ? "text-4xl md:text-5xl"
            : index === 0
              ? "text-2xl md:text-3xl"
              : "text-xl md:text-2xl"

          return (
            <motion.div
              key={player.rank}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={podiumVariants}
              className="flex flex-col items-center relative w-1/3 max-w-[200px]"
            >
              {/* Avatar with hover effect */}
              <motion.div
                custom={index}
                initial="initial"
                animate="animate"
                whileHover="hover"
                variants={avatarVariants}
                className="w-20 h-20 md:w-28 md:h-28 bg-white rounded-full p-1 mb-4 shadow-lg cursor-pointer transition-transform relative z-10"
              >
                <Image
                  src={player.avatar}
                  alt={player.name}
                  fill
                  className="rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/avatar.svg"
                  }}
                />
              </motion.div>

              {/* Name */}
              <motion.div
                custom={index}
                initial="initial"
                animate="animate"
                variants={nameVariants}
                className="bg-gradient-to-r from-orange-400 to-yellow-500 text-white px-4 py-2 rounded-full font-bold text-sm md:text-lg mb-2 shadow-lg"
              >
                {player.name}
              </motion.div>

              {/* Podium */}
              <motion.div
                initial={{ scaleY: 0, originY: 1 }}
                animate={{ scaleY: 1 }}
                transition={{
                  delay: index * 0.3 + 0.4,
                  type: "spring",
                  stiffness: 120,
                  damping: 15,
                }}
                className={`bg-gradient-to-t ${
                  isFirst ? "from-orange-600 to-orange-400" : "from-blue-700 to-blue-500"
                } rounded-t-3xl px-8 md:px-12 text-center shadow-xl flex flex-col justify-center w-full`}
                style={{
                  minHeight: `${podiumHeight}px`,
                  paddingTop: podiumPadding,
                  paddingBottom: podiumPadding,
                }}
              >
                <motion.div
                  custom={index}
                  initial="initial"
                  animate="animate"
                  variants={scoreVariants}
                  className={`${textSize} font-black text-white mb-2 md:mb-4`}
                >
                  {player.rank}
                </motion.div>
                <motion.div
                  custom={index}
                  initial="initial"
                  animate="animate"
                  variants={scoreVariants}
                  className={`${scoreSize} font-bold text-white`}
                >
                  {player.score.toLocaleString()}
                </motion.div>
              </motion.div>

              {/* Crown + Sparkle effects for 1st place */}
              {isFirst && (
                <>
                  {/* Crown */}
                  <motion.div
                    className="absolute -top-12 md:-top-16 left-1/2 -translate-x-1/2 z-20"
                    animate={{ rotate: [0, 10, -10, 0], y: [0, -5, 0] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                  >
                    <Image
                      src="/crown.svg"
                      alt="Crown"
                      width={60}
                      height={50}
                      className="drop-shadow-[0_0_20px_rgba(255,215,0,1)]"
                    />
                  </motion.div>

                  {/* Sparkles */}
                  <div className="absolute -top-16 md:-top-20 left-1/2 transform -translate-x-1/2 w-24 h-24 pointer-events-none">
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
                          scale: [0.5, 1.5, 0.5],
                        }}
                        transition={{
                          repeat: Number.POSITIVE_INFINITY,
                          duration: 1.5 + Math.random() * 0.5,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}