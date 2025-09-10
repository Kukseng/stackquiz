// src/components/NicknameModal.js
'use client';
// src/components/NicknameInput.js
import { useState } from 'react';

export default function NicknameInput() {
  const [nickname, setNickname] = useState('');

  const handleStart = () => {
    // Implement your logic here, e.g., send the nickname to a server, or navigate to a new page.
    console.log(`Starting with nickname: ${nickname}`);
  };

  return (
    // This outer div centers the content both horizontally and vertically on the full screen.
    <div className="flex items-center justify-center min-h-screen">
      {/* This div creates the central card element with the blurred background and rounded corners. */}
      <div className="flex flex-col items-center px-8 py-6 bg-white/20 bg-opacity-70 backdrop-blur-sm rounded-3xl shadow-2xl">
        <h2 className="text-white text-2xl mb-6">Your nickname is ...</h2>
        
        {/* Input field */}
        <div className="flex w-[300px] mb-5">
          <input
            type="text"
            placeholder="Enter your nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full p-2 text-center rounded-2xl text-lg text-gray-800 bg-white bg-opacity-90 placeholder-gray-500 outline-none transition-all focus:ring-4 focus:ring-orange-400"
          />
        </div>
        {/* Start button */}
        <button
          onClick={handleStart}
          className="w-full py-2 px-4 text-2xl font-bold text-gray-800 rounded-xl
            btn-secondary transition-all transform hover:scale-102"
        >
          Start
        </button>
      </div>
    </div>
  );
}