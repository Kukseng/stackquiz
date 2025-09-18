// src/components/TimesUpScreen.js
'use client';
import Image from 'next/image';

export default function TimesUpScreen() {
  return (
    // This div centers the content both horizontally and vertically on the full screen.
    <div className="flex items-center justify-center min-h-screen">
      {/* Container for the "Time's Up" content */}
      <div className="flex flex-col items-center p-8">
        
        {/* "Time's Up" Heading */}
        <h2 className="text-white text-4xl font-extrabold mb-6">InCorect</h2>

        {/* Alarm Clock Icon */}
        {/* You'll need to replace '/alarm-clock.png' with the actual path to your alarm clock image */}
        <div className="mb-8">
          {/* Using a placeholder div with a background color for now. */}
          {/* If you have an actual image, use Next.js Image component */}
          <div className="w-32 h-32 flex items-center justify-center">
            <Image
              src="/play/wrong.svg" // Replace with your alarm clock image path
              alt="Incorrect"
              width={128}
              height={128}
              objectFit="contain" // Adjust as needed
            />
          </div>
        </div>
        <div className=" px-8 py-4 rounded-xl bg-white/40 mb-4 shadow-lg ">
          <p className="text-white text-2xl font-semibold">Incorect Answer !</p>
        </div>
        <p className="text-gray-300 text-lg italic">you are on the podium!</p>
      </div>
    </div>
  );
}