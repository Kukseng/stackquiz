"use client"

import { useState } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, useGLTF, Environment } from "@react-three/drei"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Avatar {
  id: number
  avatarNo: number
  name: string
  modelUrl: string
}

interface AvatarModelProps {
  url: string
}

function AvatarModel({ url }: AvatarModelProps) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} scale={0.3} position={[0, -1.5, 0]} />
}

interface AvatarCarouselProps {
  avatars: Avatar[]
  onSelect: (avatarId: number) => void
  onBack?: () => void
}

export default function AvatarCarousel({ avatars, onSelect, onBack }: AvatarCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const currentAvatar = avatars[currentIndex]

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? avatars.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === avatars.length - 1 ? 0 : prev + 1))
  }

  const handleConfirm = () => {
    setIsLoading(true)
    onSelect(currentAvatar.id)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Back button */}
      {onBack && (
        <button
          onClick={onBack}
          className="absolute top-6 left-6 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white/20 transition-colors border border-white/20"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Title */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <h1 className="text-white text-4xl md:text-5xl font-bold mb-2">Choose Your Avatar</h1>
        <p className="text-white/80 text-lg">Pick your character for the quiz</p>
      </motion.div>

      {/* Main carousel container */}
      <div className="relative w-full max-w-5xl">
        {/* 3D Avatar Display */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <div className="relative mx-auto w-full max-w-2xl aspect-[4/3]">
            {/* 3D Canvas */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden bg-gradient-to-b from-purple-800/30 to-blue-900/30 backdrop-blur-sm border-4 border-white/20 shadow-2xl">
              <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
                <ambientLight intensity={0.8} />
                <directionalLight position={[5, 5, 5]} intensity={1} />
                <directionalLight position={[-5, 5, -5]} intensity={0.5} />
                <Environment preset="sunset" />
                <OrbitControls
                  enableZoom={false}
                  enablePan={false}
                  minPolarAngle={Math.PI / 3}
                  maxPolarAngle={Math.PI / 2}
                  autoRotate
                  autoRotateSpeed={2}
                />
                <AvatarModel url={currentAvatar.modelUrl} />
              </Canvas>
            </div>

            {/* Spotlight effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 via-transparent to-transparent pointer-events-none rounded-3xl" />
          </div>

          {/* Avatar name badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-center"
          >
            <div className="inline-block bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-2xl px-8 py-3">
              <h2 className="text-white text-2xl font-bold">{currentAvatar.name}</h2>
            </div>
          </motion.div>
        </motion.div>

        {/* Navigation arrows */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-4 pointer-events-none">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrevious}
            className="pointer-events-auto w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl hover:bg-white/30 transition-colors border-2 border-white/30"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNext}
            className="pointer-events-auto w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl hover:bg-white/30 transition-colors border-2 border-white/30"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </motion.button>
        </div>
      </div>

      {/* Avatar indicator dots */}
      <div className="flex gap-2 mt-8 mb-6">
        {avatars.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-white w-8" : "bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>

      {/* Confirm button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleConfirm}
        disabled={isLoading}
        className="px-12 py-4 rounded-2xl font-bold text-xl text-blue-900 shadow-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
        }}
      >
        {isLoading ? "Joining..." : "Confirm & Join"}
      </motion.button>

      {/* Helper text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-white/60 text-sm mt-4"
      >
        Use arrows or dots to browse • Drag to rotate
      </motion.p>
    </div>
  )
}
