'use client';
import Image from 'next/image';

export default function WaitingForHost() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center p-8 bg-opacity-80 rounded-3xl shadow-2xl border-2">
        <div className="mb-6">
          {/* If you have an SVG, you can embed it directly or use an SVG component. */}
          <div className="w-24 h-24 rounded-full flex items-center justify-center">
            <Image
              src="/play/roket.svg" 
              alt="Rocket"
              width={94}
              height={94}
              className="object-contain"
            />
          </div>
        </div>

        <h2 className="text-white text-3xl font-bold mb-2">Waiting for the Host</h2>
        <p className="text-gray-300 text-lg mb-8">Hang tight, the quiz will start soon</p>
        <div className="relative flex flex-col items-center bg-white/20 bg-opacity-70 backdrop-blur-sm rounded-2xl p-4 w-48">
          <div className="w-20 h-20 rounded-full overflow-hidden mb-2">
            <Image
              src="/play/avatar.svg" // Replace with your avatar image path
              alt="Player Avatar"
              width={80}
              height={80}
              className="object-cover"
            />
          </div>
          <p className="text-white text-lg font-semibold">Dada</p>
          
          {/* Edit Icon (positioned absolutely) */}
          <button className="absolute top-0 right-[-10px] p-1 border-2 rounded-full bg-white/40 transition-all">
            <span className="text-white text-sm">✏️</span> {/* Placeholder for an actual edit icon */}
          </button>
        </div>
      </div>
    </div>
  );
}