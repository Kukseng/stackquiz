
export function TopPlayersSection() {
  return (
    <section className="px-4 py-20">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-12">Top Players</h2>

        <div className="relative">
          {/* Crown */}
          <div className="text-6xl mb-8">👑</div>

          {/* Player avatars */}
          <div className="flex justify-center items-end gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-white font-bold">V</span>
              </div>
              <div className="text-white text-sm">Vicky</div>
              <div className="text-gray-400 text-xs">2nd</div>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-yellow-500 rounded-full mx-auto mb-2 flex items-center justify-center border-4 border-yellow-300">
                <span className="text-white font-bold text-lg">👤</span>
              </div>
              <div className="text-white font-bold">Winner</div>
              <div className="text-yellow-400 text-sm">1st</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-white font-bold">M</span>
              </div>
              <div className="text-white text-sm">Maulana</div>
              <div className="text-gray-400 text-xs">3rd</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
