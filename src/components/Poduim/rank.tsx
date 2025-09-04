
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

export default function Rank() {
  const leaderboardData = [
    {
      name: "Dada",
      score: 2840,
      rank: 1,
      avatar: "/avatar.svg",
    },
    {
      name: "Bobo",
      score: 1969,
      rank: 2,
      avatar: "/avatar.svg",
    },
    {
      name: "Titi",
      score: 784,
      rank: 3,
      avatar: "/avatar.svg",
    },
  ]

  return (
   <div 
  className="relative overflow-hidden h-[780px]" // changed from min-h-[400px] and removed full screen
  style={{
    backgroundImage: `url('https://i.pinimg.com/736x/62/4b/ef/624bef905175946c023304856f8494c8.jpg')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    borderRadius: "1rem",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(5px)",
    WebkitBackdropFilter: "blur(5px)",

  }}
>
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        {/* Curved lines pattern */}
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-30">
          <svg viewBox="0 0 400 800" className="w-full h-full">
            <defs>
              <pattern id="lines" patternUnits="userSpaceOnUse" width="20" height="20">
                <path d="M0,20 Q10,10 20,20" stroke="white" strokeWidth="1" fill="none" opacity="0.3"/>
              </pattern>
            </defs>
            <rect width="400" height="800" fill="url(#lines)"/>
          </svg>
        </div>
        
        {/* Dots pattern */}
        {Array.from({ length: 80 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
        
        {/* Plus signs */}
        <div className="absolute top-1/4 left-8 text-cyan-400/60 text-3xl font-bold">+</div>
        <div className="absolute bottom-1/3 right-12 text-pink-400/60 text-2xl font-bold">+</div>
        <div className="absolute top-1/2 right-1/4 text-purple-300/60 text-xl font-bold">+</div>
        <div className="absolute bottom-1/4 left-1/4 text-yellow-400/60 text-2xl font-bold">+</div>
        
        {/* Circular decorative elements */}
        <div className="absolute top-16 left-1/3 w-8 h-8 bg-purple-400/40 rounded-full"></div>
        <div className="absolute bottom-32 right-1/3 w-6 h-6 bg-pink-400/50 rounded-full"></div>
        <div className="absolute top-1/3 right-16 w-4 h-4 bg-cyan-400/60 rounded-full"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 relative">
           <Image
              src="/logo.png"
              alt="Logo"
              fill
              className="object-contain"
            />
            </div>
            <h1 className="text-4xl font-black text-white">
              STACK<span className="text-yellow-400">QUIZZ</span>
            </h1>
          </div>
          <Badge className="px-6 py-3 text-lg bg-white text-gray-800 rounded-full font-bold shadow-lg">
            Computer Science
          </Badge>
        </div>

        {/* Leaderboard */}
        <div className="flex-1 flex items-center justify-center px-8">
          <div className="relative w-full max-w-4xl">
            {/* Crown and sparkles for first place */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-16">
              <div className="relative">
                <div className="text-6xl">👑</div>
                {/* Sparkle dots around crown */}
                <div className="absolute -top-4 -left-4 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                <div className="absolute -top-2 -right-6 w-2 h-2 bg-yellow-300 rounded-full animate-pulse delay-300"></div>
                <div className="absolute -bottom-2 -left-6 w-2 h-2 bg-yellow-500 rounded-full animate-pulse delay-700"></div>
                <div className="absolute -bottom-4 -right-4 w-3 h-3 bg-yellow-400 rounded-full animate-pulse delay-1000"></div>
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-yellow-300 rounded-full animate-pulse delay-500"></div>
              </div>
            </div>
            
            <div className="flex items-end justify-center ">
              {/* Second Place */}
              <div className="flex flex-col items-center">
                <div className="w-30 h-30 bg-white rounded-full p-1 mb-4 shadow-lg">
                  <img
                    src={leaderboardData[1].avatar || "/placeholder.svg"}
                    alt={leaderboardData[1].name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div className="bg-gradient-to-r from-orange-400 to-yellow-500 text-white px-6 py-2 rounded-full font-bold text-lg mb-2 shadow-lg">
                  {leaderboardData[1].name}
                </div>
                <div className="bg-gradient-to-t from-blue-700 to-blue-500 rounded-t-3xl px-16 py-12 text-center shadow-xl min-h-[200px] flex flex-col justify-center">
                  <div className="text-8xl font-black text-white mb-4">2</div>
                  <div className="text-3xl font-bold text-white">{leaderboardData[1].score}</div>
                </div>
              </div>

              {/* First Place */}
              <div className="flex flex-col items-center relative">
                <div className="w-35 h-35 bg-white rounded-full p-1 mb-4 shadow-xl">
                  <img
                    src={leaderboardData[0].avatar || "/placeholder.svg"}
                    alt={leaderboardData[0].name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div className="bg-gradient-to-r from-orange-400 to-yellow-500 text-white px-6 py-2 rounded-full font-bold text-xl mb-2 shadow-lg">
                  {leaderboardData[0].name}
                </div>
                <div className="bg-gradient-to-t from-orange-600 to-orange-400 rounded-t-3xl px-20 py-16 text-center shadow-2xl min-h-[280px] flex flex-col justify-center">
                  <div className="text-9xl font-black text-white mb-4">1</div>
                  <div className="text-4xl font-bold text-white">{leaderboardData[0].score}</div>
                </div>
              </div>

              {/* Third Place */}
              <div className="flex flex-col items-center">
                <div className="w-30 h-30 bg-white rounded-full p-1 mb-4 shadow-lg">
                  <img
                    src={leaderboardData[2].avatar || "/placeholder.svg"}
                    alt={leaderboardData[2].name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div className="bg-gradient-to-r from-orange-400 to-yellow-500 text-white px-6 py-2 rounded-full font-bold text-lg mb-2 shadow-lg">
                  {leaderboardData[2].name}
                </div>
                <div className="bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-3xl px-16 py-8 text-center shadow-xl min-h-[160px] flex flex-col justify-center">
                  <div className="text-7xl font-black text-white mb-4">3</div>
                  <div className="text-2xl font-bold text-white">{leaderboardData[2].score}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}