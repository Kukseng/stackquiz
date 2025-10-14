"use client";
import { useState, useEffect } from "react";

interface QuizTimerProps {
  initialTime: number;
  onTimeUp: () => void;
  isActive?: boolean;
}

export function QuizTimer({ initialTime, onTimeUp, isActive = true }: QuizTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  // Reset the timer whenever initialTime changes
  useEffect(() => {
    setTimeLeft(initialTime);
  }, [initialTime]);

  // Main timer logic
  useEffect(() => {
    if (!isActive || timeLeft === 0) return;

    // Set an interval to decrement the timer every second
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    // Cleanup interval on unmount or when timeLeft reaches 0
    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  // Handle time-up scenario
  useEffect(() => {
    if (timeLeft === 0) {
      const delay = setTimeout(() => onTimeUp(), 1000); // Wait 1 second before triggering onTimeUp
      return () => clearTimeout(delay);
    }
  }, [timeLeft, onTimeUp]);

  // Calculate the progress percentage for the circular progress bar
  const progressPercentage = ((initialTime - timeLeft) / initialTime) * 100;

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-20 py-6 sm:py-8 lg:py-12">
      <div className="relative flex items-center justify-center">
        {/* Circular Progress Bar */}
        <div className="w-32 h-32 rounded-full border-8 border-gray-300 relative">
          <div
            className="absolute inset-0 w-full h-full rounded-full"
            style={{
              background: `conic-gradient(
                ${timeLeft <= 10 ? 'red' : 'purple'} ${progressPercentage}%, 
                #e0e0e0 ${progressPercentage}%
              )`,
            }}
          ></div>

          {/* Timer countdown */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className={`text-3xl font-bold ${
                timeLeft <= 10 ? "text-red-500 animate-pulse" : "text-purple-600"
              }`}
            >
              {timeLeft}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
