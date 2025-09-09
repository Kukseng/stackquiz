"use client";

import { motion } from "framer-motion";
import Image from "next/image";
interface Player {
  id: string;
  name: string;
  avatar: string;
  correct: number;
  incorrect: number;
  missing: number;
  points: string;
  score: number;
}

const players: Player[] = [
  {
    id: "1",
    name: "Dada",
    avatar: "/avatar.svg",
    correct: 8,
    incorrect: 2,
    missing: 0,
    points: "8/10",
    score: 315,
  },
  {
    id: "2",
    name: "Bobo",
    avatar: "/avatar.svg",
    correct: 6,
    incorrect: 3,
    missing: 1,
    points: "6/10",
    score: 300,
  },
  {
    id: "3",
    name: "Titi",
    avatar: "/avatar.svg",
    correct: 5,
    incorrect: 5,
    missing: 0,
    points: "5/10",
    score: 258,
  },
  {
    id: "4",
    name: "Jira",
    avatar: "/avatar.svg",
    correct: 3,
    incorrect: 6,
    missing: 1,
    points: "3/10",
    score: 172,
  },
  {
    id: "5",
    name: "Rara",
    avatar: "/avatar.svg",
    correct: 2,
    incorrect: 7,
    missing: 1,
    points: "2/10",
    score: 130,
  },
  {
    id: "6",
    name: "Lala",
    avatar: "/avatar.svg",
    correct: 1,
    incorrect: 8,
    missing: 1,
    points: "1/10",
    score: 100,
  },
  {
    id: "7",
    name: "Nana",
    avatar: "/avatar.svg",
    correct: 0,
    incorrect: 9,
    missing: 1,
    points: "0/10",
    score: 50,
  },
];

export default function Table() {
  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/10">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left border-collapse rounded-2xl overflow-hidden">
          <thead>
            <tr className="border-b border-white/20">
              {[
                "Name",
                "Correct",
                "Incorrect",
                "Missing",
                "Points",
                "Score",
              ].map((title) => (
                <th
                  key={title}
                  className="text-white/90 font-semibold p-3 text-center"
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="space-y-3 rounded-2xl">
            {players.map((player, index) => (
              <motion.tr
                key={player.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                  ease: "easeOut",
                }}
                className="group bg-white/5 hover:bg-gradient-to-r hover:via-pink-500/20 hover:to-blue-500/20 transition-all duration-500 hover:shadow-xl"
              >
                {/* Avatar + Name */}
                <td className="flex items-center gap-3 p-3">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                  >
                    <Image
                      src={player.avatar || "/placeholder.svg"} // fallback if avatar is missing
                      alt={player.name}
                      width={48} // equivalent to h-12 w-12 (12 * 4px = 48px)
                      height={48}
                      className="rounded-full border-2 object-cover bg-amber-50"
                      onError={(e) => {
                        // fallback if image fails to load
                        (e.currentTarget as HTMLImageElement).src =
                          "/placeholder.svg";
                      }}
                    />
                  </motion.div>
                  <span className="text-white font-medium text-lg group-hover:text-white/90 transition-colors">
                    {player.name}
                  </span>
                </td>

                {/* Stats */}
                <td className="text-white text-center font-medium text-lg">
                  {player.correct}
                </td>
                <td className="text-white text-center font-medium text-lg">
                  {player.incorrect}
                </td>
                <td className="text-white text-center font-medium text-lg">
                  {player.missing}
                </td>
                <td className="text-white text-center font-medium text-lg">
                  {player.points}
                </td>
                <td className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-center font-bold text-lg radius-lg">
                  {player.score}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
