// src/components/QuizSummary.js
'use client';
import { useState } from 'react';

export default function QuizSummary() {
  const [summaryData, setSummaryData] = useState({
    accuracy: 95,
    rank: '1/4',
    score: 315,
    correct: 3,
    partiallyCorrect: 3,
    incorrect: 1,
    timePerQuestion: '4s',
    streak: '1',
  });

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center p-4 rounded-3xl shadow-2xl border-2 max-w-lg w-full">
        
        {/* Header Section */}
        <div className="flex w-full justify-between items-center mb-3">
          <button className="text-white text-2xl">&times;</button>
          <h2 className="text-white text-3xl font-bold">Summary</h2>
          {/* Replace with your logo/name */}
          <div className="flex items-center">
            <span className="text-white font-bold">STACKQUIZZ</span>
          </div>
        </div>

        {/* Solo Review Button */}
        <button className="flex items-center px-4 py-2 rounded-full bg-white/40 mb-4 text-white text-sm">
          <span className="mr-2">👤</span>Solo review
        </button>

        <p className="text-gray-300 text-center mb-3">Congratulations, you finished the quiz.</p>

        {/* Accuracy Bar */}
        <div className="w-full mb-3">
          <div className="flex justify-between items-center mb-2 text-white font-semibold">
            <span>Accuracy</span>
            <span>{summaryData.accuracy}%</span>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-3 relative">
            <div 
              className="bg-green-500 h-3 rounded-full" 
              style={{ width: `${summaryData.accuracy}%` }}
            ></div>
            <div 
              className="absolute top-0 h-4 rounded-full" 
              style={{ 
                left: `${summaryData.accuracy}%`, 
                width: '10px', 
                backgroundColor: 'red',
                transform: 'translateX(-5px)'
              }}
            ></div>
          </div>
        </div>

        {/* Rank and Score */}
        <div className="flex justify-between w-full mb-4">
          <div className="bg-blue-600 p-3 rounded-2xl flex-1 text-center mr-2">
            <p className="text-white text-sm font-light">Rank</p>
            <p className="text-white text-2xl font-bold">{summaryData.rank}</p>
          </div>
          <div className="bg-yellow-500 p-3 rounded-2xl flex-1 text-center ml-2">
            <p className="text-white text-sm font-light">Score</p>
            <p className="text-white text-2xl font-bold">{summaryData.score}</p>
          </div>
        </div>

        {/* Find New Quiz Button */}
        <button className="w-full py-2 rounded-full text-white text-xl font-bold bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 transition-all transform hover:scale-105 mb-6">
          Find new quiz
        </button>

        {/* Performance Stats */}
        <h3 className="text-white text-xl font-semibold mb-2">Performance stats</h3>
        <div className="grid grid-cols-3 gap-2 w-full text-center">
          <div className="bg-green-600 py-2 rounded-xl">
            <p className="text-white text-lg font-bold">{summaryData.correct}</p>
            <p className="text-white text-xs">Correct</p>
          </div>
          <div className="bg-yellow-600 py-2 rounded-xl">
            <p className="text-white text-lg font-bold">{summaryData.partiallyCorrect}</p>
            <p className="text-white text-xs">Partially correct</p>
          </div>
          <div className="bg-red-600 py-2 rounded-xl">
            <p className="text-white text-lg font-bold">{summaryData.incorrect}</p>
            <p className="text-white text-xs">Incorrect</p>
          </div>
          <div className="bg-purple-800 py-2 rounded-xl">
            <p className="text-white text-lg font-bold">{summaryData.timePerQuestion}</p>
            <p className="text-white text-xs">Time/ques</p>
          </div>
          <div className="bg-purple-800 py-2 rounded-xl col-span-2">
            <p className="text-white text-lg font-bold">{summaryData.streak}</p>
            <p className="text-white text-xs">Streak</p>
          </div>
        </div>

        {/* Feedback and Report Buttons */}
        <div className="flex justify-between w-full mt-6">
          <button className="flex-1 py-3 px-2 bg-purple-800 rounded-full text-white text-sm font-semibold mr-2">
            <span className="mr-1">💬</span>Feedback
          </button>
          <button className="flex-1 py-3 px-2 bg-purple-800 rounded-full text-white text-sm font-semibold ml-2">
            <span className="mr-1">⚠️</span>Report
          </button>
        </div>
      </div>
    </div>
  );
}