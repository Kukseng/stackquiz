import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CardQuizComponent from "../CardQuizComponent";
import { motion, Variants } from "framer-motion";
import Image from "next/image";

export function Again() {
  const players = [
    { name: "Boba", rank: 2, score: 85 },
    { name: "Dada", rank: 1, score: 100 },
    { name: "Titi", rank: 3, score: 70 },
  ];

  const podiumVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 100,
      scale: 0.8,
    },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: index * 0.2,
        duration: 0.6,
        type: "spring",
        stiffness: 120,
      },
    }),
  };

  const quizCards = [
    {
      title: "Math Fundamental",
      questions: 15,
      difficulty: "Easy",
      time: "30 min",
      color: "bg-blue-600",
      image:
        "https://i.pinimg.com/1200x/57/26/63/5726635fe0e4c3c5affcbe56f871f7e2.jpg",
    },
    {
      title: "Science Essentials",
      questions: 20,
      difficulty: "Medium",
      time: "45 min",
      color: "bg-yellow-500",
      image:
        "https://i.pinimg.com/736x/85/a3/43/85a3435b29390b4c57822f6fd5d8a257.jpg",
    },
    {
      title: "Computer Programming",
      questions: 25,
      difficulty: "Hard",
      time: "1 hour",
      color: "bg-red-500",
      image:
        "https://i.pinimg.com/1200x/bc/db/43/bcdb43f51ba1feedf9077bb64a29a58e.jpg",
    },
    {
      title: "Science Essentials",
      questions: 20,
      difficulty: "Medium",
      time: "45 min",
      color: "bg-yellow-500",
      image:
        "https://i.pinimg.com/736x/2c/db/77/2cdb7717db18b51bf43e2e52380fb74f.jpg",
    },
  ];

  return (
    <div className="min-h-[800px] bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden rounded-lg">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-pink-400 blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 rounded-full bg-cyan-400 blur-lg"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 rounded-full bg-purple-400 blur-2xl"></div>
      </div>

      <div className="relative z-10 flex">
        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Classic Mode Section */}
          <div className="mb-12">
            <div className="flex items-start gap-8">
              {/* Podium Illustration */}
              <div className="relative">
                <Card className="w-[500px] h-[300px]">
                  <Image
                    src="/Hey2.jpg"
                    width={800}
                    height={100}
                    alt="Card Image"
                    className="absolute inset-0 h-full object-cover rounded-xl"
                  />
                  <CardContent className="p-8 relative h-full">
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex items-end gap-1">
                      {players.map((player, index) => {
                        const isFirst = player.rank === 1;
                        const podiumHeight = isFirst
                          ? 32
                          : player.rank === 2
                          ? 24
                          : 16;
                        const textSize = isFirst ? "text-4xl" : "text-3xl";

                        return (
                          <motion.div
                            key={player.rank}
                            custom={index}
                            initial="hidden"
                            animate="visible"
                            variants={podiumVariants}
                            className="flex flex-col items-center relative"
                          >
                            {/* Floating animation for the name badge */}
                            <motion.div
                              animate={{ y: [0, -10, 0] }}
                              transition={{
                                repeat: Infinity,
                                duration: 2,
                                delay: index * 0.3,
                              }}
                              className="bg-yellow-400 text-black px-4 py-2 rounded-lg text-lg font-bold mb-2"
                            >
                              {player.name}
                            </motion.div>

                            {/* Animated Podium */}
                            <motion.div
                              initial={{ scaleY: 0 }}
                              animate={{ scaleY: 1 }}
                              transition={{
                                delay: index * 0.3 + 0.4,
                                type: "spring",
                                stiffness: 120,
                              }}
                              className={`
                                w-20 h-${podiumHeight} 
                                ${
                                  isFirst
                                    ? "bg-gradient-to-b from-yellow-400 to-orange-500"
                                    : player.rank === 2
                                    ? "bg-blue-400"
                                    : "bg-purple-500"
                                } 
                                rounded-t flex items-center justify-center text-white font-bold ${textSize}
                                shadow-xl hover:shadow-2xl transition-shadow cursor-pointer
                              `}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {player.rank}
                            </motion.div>

                            {/* Crown for 1st place */}
                            {isFirst && (
                              <motion.div
                                className="absolute -top-14 text-6xl"
                                animate={{
                                  rotate: [0, 10, -10, 0],
                                  scale: [1, 1.1, 1],
                                }}
                                transition={{
                                  repeat: Infinity,
                                  duration: 2,
                                  ease: "easeInOut",
                                }}
                              >
                                <Image
                                  src="/crown.svg"
                                  alt="Crown"
                                  width={60}
                                  height={60}
                                  className="drop-shadow-[0_0_20px_rgba(255,215,0,1)]"
                                />
                              </motion.div>
                            )}

                            {/* Sparkle effects for winner */}
                            {isFirst && (
                              <>
                                <motion.div
                                  className="absolute -top-4 -left-4 text-yellow-400 text-2xl"
                                  animate={{
                                    opacity: [0, 1, 0],
                                    scale: [0, 1, 0],
                                    rotate: [0, 180, 360],
                                  }}
                                  transition={{
                                    repeat: Infinity,
                                    duration: 1.5,
                                    delay: 0.5,
                                  }}
                                >
                                  ✨
                                </motion.div>
                                <motion.div
                                  className="absolute -top-8 -right-4 text-yellow-400 text-2xl"
                                  animate={{
                                    opacity: [0, 1, 0],
                                    scale: [0, 1, 0],
                                    rotate: [360, 180, 0],
                                  }}
                                  transition={{
                                    repeat: Infinity,
                                    duration: 1.5,
                                    delay: 1,
                                  }}
                                >
                                  ✨
                                </motion.div>
                              </>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Mode Selection */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-white mb-6">
                  Classic mode
                </h1>

                <div className="flex gap-3 mb-4">
                  <Button
                    variant="outline"
                    className="py-6 bg-transparent border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                  >
                    Up to 40 participants
                  </Button>
                  <Button
                    variant="outline"
                    className="py-6 bg-transparent border-gray-400 text-gray-300 hover:bg-gray-400 hover:text-black"
                  >
                    Competition
                  </Button>
                  <Button
                    variant="outline"
                    className="py-6 bg-transparent border-gray-400 text-gray-300 hover:bg-gray-400 hover:text-black"
                  >
                    Assessment
                  </Button>
                </div>

                <p className="text-gray-300 mb-6 text-lg">
                  Bring friendly with stackquiz need participants go to answer
                  correctly to a top score
                </p>

                <div>
                  <h3 className="text-white text-lg font-semibold mb-3">
                    Content
                  </h3>
                  <div className="flex gap-3">
                    <Input
                      placeholder="Computer Science"
                      className="flex-1 py-6 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400"
                      defaultValue="Computer Science"
                    />
                    <Button className="box-raduis font-bold btn-text btn-secondary px-8 py-6">
                      Start
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quiz Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quizCards.map((quiz, index) => (
              <CardQuizComponent
                key={index}
                id={index}
                title={quiz.title}
                questions={quiz.questions}
                difficulty={quiz.difficulty}
                time={quiz.time}
                color={quiz.color}
                image={quiz.image}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
