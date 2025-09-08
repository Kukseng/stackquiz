
"use client";
import { useState } from "react";
import { Star} from "lucide-react";
import { motion } from "framer-motion";

// Animated Ghost Component
const AnimatedGhost = () => {
  return (
    <div className="relative scale-75 sm:scale-100">
      <div className="relative animate-bounce" style={{ animationDuration: '0.5s' }}>
        <div className="relative w-36 h-36 grid grid-cols-14 grid-rows-14 gap-0" style={{
          gridTemplateAreas: `
            "a1  a2  a3  a4  a5  top0  top0  top0  top0  a10 a11 a12 a13 a14"
            "b1  b2  b3  top1 top1 top1 top1 top1 top1 top1 top1 b12 b13 b14"
            "c1 c2 top2 top2 top2 top2 top2 top2 top2 top2 top2 top2 c13 c14"
            "d1 top3 top3 top3 top3 top3 top3 top3 top3 top3 top3 top3 top3 d14"
            "e1 top3 top3 top3 top3 top3 top3 top3 top3 top3 top3 top3 top3 e14"
            "f1 top3 top3 top3 top3 top3 top3 top3 top3 top3 top3 top3 top3 f14"
            "top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4"
            "top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4"
            "top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4"
            "top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4"
            "top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4"
            "top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4"
            "st0 st0 an4 st1 an7 st2 an10 an10 st3 an13 st4 an16 st5 st5"
            "an1 an2 an3 an5 an6 an8 an9 an9 an11 an12 an14 an15 an17 an18"`
        }}>
          {/* Ghost body parts */}
          {['top0', 'top1', 'top2', 'top3', 'top4', 'st0', 'st1', 'st2', 'st3', 'st4', 'st5'].map(id => (
            <div key={id} className="bg-red-500" style={{ gridArea: id }}></div>
          ))}
          
          {/* Animated bottom parts */}
          {[
            { id: 'an1', delay: '0ms', type: 'flicker0' },
            { id: 'an18', delay: '0ms', type: 'flicker0' },
            { id: 'an2', delay: '0ms', type: 'flicker1' },
            { id: 'an17', delay: '0ms', type: 'flicker1' },
            { id: 'an3', delay: '0ms', type: 'flicker1' },
            { id: 'an16', delay: '0ms', type: 'flicker1' },
            { id: 'an4', delay: '0ms', type: 'flicker1' },
            { id: 'an15', delay: '0ms', type: 'flicker1' },
            { id: 'an6', delay: '0ms', type: 'flicker0' },
            { id: 'an12', delay: '0ms', type: 'flicker0' },
            { id: 'an7', delay: '0ms', type: 'flicker0' },
            { id: 'an13', delay: '0ms', type: 'flicker0' },
            { id: 'an9', delay: '0ms', type: 'flicker1' },
            { id: 'an10', delay: '0ms', type: 'flicker1' },
            { id: 'an8', delay: '0ms', type: 'flicker0' },
            { id: 'an11', delay: '0ms', type: 'flicker0' },
          ].map(({ id, type }) => (
            <div 
              key={id} 
              className={`${type === 'flicker0' ? 'animate-pulse' : 'animate-ping'}`}
              style={{ 
                gridArea: id,
                backgroundColor: 'red',
                animationDuration: '0.5s',
              }}
            ></div>
          ))}
          
          {/* Eyes */}
          <div className="absolute top-8 left-3 w-10 h-12">
            <div className="absolute w-5 h-12 bg-white transform translate-x-2"></div>
            <div className="absolute w-10 h-8 bg-white transform translate-y-2"></div>
            <div className="absolute w-5 h-5 bg-blue-500 top-5 left-0 z-10 animate-pulse" style={{ animationDuration: '3s' }}></div>
          </div>
          
          <div className="absolute top-8 right-8 w-10 h-12">
            <div className="absolute w-5 h-12 bg-white transform translate-x-2"></div>
            <div className="absolute w-10 h-8 bg-white transform translate-y-2"></div>
            <div className="absolute w-5 h-5 bg-blue-500 top-5 right-0 z-10 animate-pulse" style={{ animationDuration: '3s' }}></div>
          </div>
        </div>
        
        {/* Shadow */}
        <div 
          className="absolute w-36 h-36 bg-black rounded-full opacity-20 blur-xl"
          style={{ 
            top: '80%', 
            transform: 'rotateX(80deg)',
            animationName: 'shadowPulse',
            animationDuration: '0.5s',
            animationIterationCount: 'infinite'
          }}
        ></div>
      </div>
    </div>
  );
};

export default function Feedback() {
  const [rating, setRating] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number}>>([]);

  const handleRating = (value: number) => {
    setRating(value);
    setSubmitted(true);
    
    // Create celebration particles
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100
    }));
    setParticles(newParticles);
    
    // Clear particles after animation
    setTimeout(() => setParticles([]), 2000);
  };



  const currentRating = hoveredStar || rating || 0;


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden rounded-2xl">
      
      {/* Single animated ghost at bottom */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 opacity-50 animate-float">
        <AnimatedGhost />
      </div>

      
{/* Celebration particles */}
{particles.map((particle) => (
  <motion.div
    key={particle.id}
    className="absolute w-2 h-2 rounded-full pointer-events-none"
    style={{
      left: `${particle.x}%`,
      top: `${particle.y}%`,
      backgroundColor: `hsl(${Math.random() * 360}, 80%, 60%)`, // colorful
    }}
    initial={{ scale: 0, opacity: 0 }}
    animate={{
      y: [0, -20, 0],   // bounce up and down
      x: [0, Math.random() * 20 - 10, 0], // slight horizontal wiggle
      scale: [0, 1.2, 1], // pop effect
      opacity: [0, 1, 0],
      rotate: [0, 360, 720], // spin
    }}
    transition={{
      duration: 1.5,
      delay: particle.id * 0.1,
      repeat: Infinity,
      repeatType: "loop",
      ease: "easeOut",
    }}
  />
))}

      {/* Main content */}
      <div className="text-center z-10 p-10 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/20 shadow-2xl">
        <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
          Rate this quiz
        </h2>

                {/* Star rating */}
        <div className="flex gap-3 mb-8 justify-center items-end">
          {[1, 2, 3, 4, 5].map((star) => (
            <div
              key={star}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(null)}
              onClick={() => handleRating(star)}
              className={`cursor-pointer transition-all duration-300 transform hover:scale-125 hover:-translate-y-1 ${
                submitted ? 'animate-bounce' : ''
              } ${
                star === 3 ? '-translate-y-4' : 
                star === 2 || star === 4 ? '-translate-y-2' : 
                'translate-y-2'
              }`}
              style={{ animationDelay: `${star * 100}ms` }}
            >
              <Star
                size={star === 3 ? 80 : 60}
                className={`transition-all duration-200 ${
                  star <= currentRating
                    ? "text-yellow-400 fill-yellow-400 drop-shadow-lg filter brightness-110" 
                    : "text-gray-400 hover:text-yellow-200"
                } ${star <= currentRating ? 'drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]' : ''}`}
              />
            </div>
          ))}
        </div>

        {/* Rating display */}
        {rating && (
          <div className={`mb-6 transform transition-all duration-500 ${
            submitted ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
          }`}>
            <div className="text-2xl font-semibold mb-2">
              You rated this quiz:{" "}
              <span className="text-yellow-300 font-bold text-3xl">{rating}.0</span>
            </div>
          </div>
        )}

      

        {/* Fun interactive hint */}
        {!submitted && (
          <p className="text-sm text-white/70 mt-4 animate-pulse">
             Click a star to rate your experience 
          </p>
        )}
      </div>

   
      
      {/* Custom CSS for floating animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(1deg); }
          66% { transform: translateY(-5px) rotate(-1deg); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}