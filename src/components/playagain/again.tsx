import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, RotateCcw, Trophy, BarChart3, MessageSquare, Clock } from "lucide-react"

export function Again() {
  const quizCards = [
    {
      title: "Math Fundamental",
      questions: 15,
      difficulty: "Easy",
      time: "30 min",
      color: "bg-blue-600",
      image: "/mathematical-formulas-and-equations-on-dark-backgr.jpg",
    },
    {
      title: "Science Essentials",
      questions: 20,
      difficulty: "Medium",
      time: "45 min",
      color: "bg-yellow-500",
      image: "/chemistry-lab-equipment-microscope-and-molecules.jpg",
    },
    {
      title: "Computer Programming",
      questions: 25,
      difficulty: "Hard",
      time: "1 hour",
      color: "bg-red-500",
      image: "/circuit-board-brain-artificial-intelligence-techno.jpg",
    },
    {
      title: "Science Essentials",
      questions: 20,
      difficulty: "Medium",
      time: "45 min",
      color: "bg-yellow-500",
      image: "/chemistry-lab-equipment-microscope-and-molecules.jpg",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
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
                <Card className="w-80 h-64 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 border-0 overflow-hidden">
                  <CardContent className="p-6 relative h-full">
                    {/* Decorative dots pattern */}
                    <div className="absolute top-4 left-4 grid grid-cols-6 gap-1 opacity-60">
                      {Array.from({ length: 24 }).map((_, i) => (
                        <div key={i} className="w-1 h-1 bg-white rounded-full"></div>
                      ))}
                    </div>

                    {/* Curved lines decoration */}
                    <div className="absolute top-6 right-8 opacity-40">
                      <svg width="80" height="60" viewBox="0 0 80 60" className="text-white">
                        {Array.from({ length: 8 }).map((_, i) => (
                          <path
                            key={i}
                            d={`M 0 ${10 + i * 6} Q 40 ${5 + i * 6} 80 ${10 + i * 6}`}
                            stroke="currentColor"
                            strokeWidth="1"
                            fill="none"
                          />
                        ))}
                      </svg>
                    </div>

                    {/* Podium */}
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-end gap-2">
                      {/* 2nd place */}
                      <div className="flex flex-col items-center">
                        <div className="bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold mb-1">Boba</div>
                        <div className="w-12 h-16 bg-blue-400 rounded-t flex items-center justify-center text-white font-bold text-xl">
                          2
                        </div>
                      </div>

                      {/* 1st place */}
                      <div className="flex flex-col items-center">
                        <div className="bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold mb-1">Dada</div>
                        <div className="w-12 h-20 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-t flex items-center justify-center text-white font-bold text-2xl">
                          1
                        </div>
                      </div>

                      {/* 3rd place */}
                      <div className="flex flex-col items-center">
                        <div className="bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold mb-1">Titi</div>
                        <div className="w-12 h-12 bg-purple-500 rounded-t flex items-center justify-center text-white font-bold text-lg">
                          3
                        </div>
                      </div>
                    </div>

                    {/* Decorative stars */}
                    <div className="absolute top-12 left-12 text-white text-xs">✦</div>
                    <div className="absolute bottom-16 right-12 text-white text-xs">✦</div>
                  </CardContent>
                </Card>
              </div>

              {/* Mode Selection */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-white mb-6">Classic mode</h1>

                <div className="flex gap-3 mb-4">
                  <Button
                    variant="outline"
                    className="bg-transparent border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                  >
                    Up to 40 participants
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-transparent border-gray-400 text-gray-300 hover:bg-gray-400 hover:text-black"
                  >
                    Competition
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-transparent border-gray-400 text-gray-300 hover:bg-gray-400 hover:text-black"
                  >
                    Assessment
                  </Button>
                </div>

                <p className="text-gray-300 mb-6 text-lg">
                  Bring friendly with stackquiz need participants go to answer correctly to a top score
                </p>

                <div>
                  <h3 className="text-white text-lg font-semibold mb-3">Content</h3>
                  <div className="flex gap-3">
                    <Input
                      placeholder="Computer Science"
                      className="flex-1 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400"
                      defaultValue="Computer Science"
                    />
                    <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8">Start</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quiz Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quizCards.map((quiz, index) => (
              <Card
                key={index}
                className="bg-white/95 backdrop-blur border-0 overflow-hidden hover:scale-105 transition-transform cursor-pointer"
              >
                <div className="h-32 bg-gray-900 relative overflow-hidden">
                  <img src={quiz.image || "/placeholder.svg"} alt={quiz.title} className="w-full h-full object-cover" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-gray-900 mb-2">{quiz.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{quiz.questions} questions</p>

                  <div className="flex items-center justify-between">
                    <Badge
                      className={`${
                        quiz.difficulty === "Easy"
                          ? "bg-green-500"
                          : quiz.difficulty === "Medium"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      } text-white`}
                    >
                      {quiz.difficulty}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      {quiz.time}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
