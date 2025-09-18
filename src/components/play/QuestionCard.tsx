'use client';
import { useState } from 'react';

// ✅ Props types
interface TimerProps {
  time: number;
}

interface AnswerButtonProps {
  text: string;
  color: string;
  icon: string;
}

// Timer component
const Timer: React.FC<TimerProps> = ({ time }) => (
  <div className="absolute top-1/3 left-8 transform -translate-y-1/2 w-20 h-20 rounded-full flex items-center justify-center border-4 shadow-lg">
    <span className="text-white text-3xl font-bold">{time}</span>
  </div>
);

// Answer button component
const AnswerButton: React.FC<AnswerButtonProps> = ({ text, color, icon }) => (
  <button
    className={`flex items-center w-full p-6 text-xl text-white rounded-2xl transition-all transform hover:scale-102 ${color}`}
  >
    <div className="mr-4 text-2xl">{icon}</div>
    {text}
  </button>
);

export default function QuizQuestion() {
  const [question, setQuestion] = useState('HTML Stands for');
  const [time, setTime] = useState(5);
  const [answers, setAnswers] = useState([
    { text: 'HyperText Make Language', color: 'bg-red-600', icon: '●' },
    { text: 'HyperText Markup Language', color: 'bg-orange-500', icon: '▲' },
    { text: 'HybridText Market Language', color: 'bg-blue-600', icon: '■' },
    { text: 'Hyperlink Type Make Language', color: 'bg-green-600', icon: '◆' },
  ]);

  return (
    <div className="relative min-h-screen p-3">
      <div className="flex items-center justify-center p-6 lg:mt-[150px]">
        <div className="w-4/5 md:w-3/5 p-4 md:p-8 rounded-3xl text-center bg-white/40 text-white text-3xl font-bold mb-10 border-2">
          <div>{question}</div> 
        </div>
      </div>

      <div className='relative flex justify-center'>
        <Timer time={time} /> 
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-11/12 md:w-3/4 mx-auto mt-16">
        {answers.map((answer, index) => (
          <AnswerButton
            key={index}
            text={answer.text}
            color={answer.color}
            icon={answer.icon}
          />
        ))}
      </div>
    </div>
  );
}
