import Image from "next/image";

export function TopPlayersSection() {
  return (
    <section className="relative px-4 py-16 sm:py-20 overflow-hidden">
      <div className="relative max-w-5xl mx-auto text-center">
        {/* Title */}
        <h2 className="text-3xl py-24 sm:text-4xl font-extrabold text-white mb-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]">
          Top Players
        </h2>
        <div className="flex justify-center items-end gap-6 sm:gap-10 lg:gap-16">
          {/* 2nd Place */}
          <div className="text-center scale-90 sm:scale-100">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full border-4 border-cyan-400 bg-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.9)]">
              <span className="text-white text-lg sm:text-xl font-bold">V</span>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-7 h-7 sm:w-8 sm:h-8 bg-cyan-500 text-black text-xs sm:text-sm font-extrabold flex items-center justify-center rounded-full border-2 border-white shadow-[0_0_10px_rgba(34,211,238,0.8)]">
                2
              </div>
            </div>
            <div className="text-cyan-300 mt-2 sm:mt-3 font-semibold">Vatani</div>
            <div className="text-gray-400 text-xs sm:text-sm">level 3</div>
          </div>

          {/* 1st Place (Winner) */}
          <div className="text-center  relative scale-110 sm:scale-125">
            {/* Crown */}
            <div className="absolute -top-10 z-20 sm:-top-14 left-1/2 -translate-x-1/2 text-5xl sm:text-7xl drop-shadow-[0_0_20px_rgba(255,215,0,1)]">
              👑
            </div>
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 mx-auto rounded-full border-4 border-yellow-400 bg-purple-900 flex items-center justify-center shadow-[0_0_35px_rgba(255,215,0,1)] animate-pulse">
              <span className="text-white text-4xl sm:text-5xl font-bold">👤</span>
              <div className="absolute -bottom-3 sm:-bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-yellow-400 text-black text-xs sm:text-base font-extrabold flex items-center justify-center rounded-full border-2 border-white shadow-[0_0_15px_rgba(255,215,0,0.9)]">
                1
              </div>
            </div>
            <div className="text-yellow-300 mt-3 sm:mt-4 font-extrabold text-base sm:text-lg drop-shadow-[0_0_15px_rgba(255,215,0,0.9)]">
              Borey
            </div>
            <div className="text-gray-300 text-xs sm:text-sm">level 32</div>
          </div>

          {/* 3rd Place */}
          <div className="text-center scale-90 sm:scale-100">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full border-4 border-orange-400 bg-orange-600 flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.9)]">
              <Image
                src="/avatar.png"
                alt="Lina"
                width={96}
                height={96}
                className="rounded-full object-cover"
              />
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-7 h-7 sm:w-8 sm:h-8 bg-orange-500 text-black text-xs sm:text-sm font-extrabold flex items-center justify-center rounded-full border-2 border-white shadow-[0_0_10px_rgba(249,115,22,0.9)]">
                3
              </div>
            </div>
            <div className="text-orange-300 mt-2 sm:mt-3 font-semibold">Lina</div>
            <div className="text-gray-400 text-xs sm:text-sm">level 84</div>
          </div>
        </div>
      </div>
    </section>
  );
}
