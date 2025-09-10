import React, { useState } from 'react';
import { 
  Edit, 
  Heart, 
  MoreHorizontal, 
  X, 
  Play, 
  Users, 
  Eye, 
  EyeOff, 
  UserPlus,
  Settings,
  Share2,
  Download,
  Bookmark,
  Star,
  ChevronDown
} from 'lucide-react';

const QuizInterface = () => {
  const [showAnswers, setShowAnswers] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});

  const quizData = {
    title: "OOP Basics: Learn the Core Concepts!",
    description: "Discover Object-Oriented Programming through classes, objects, inheritance, and more. Build reusable, scalable code with real-world examples!",
    plays: "5K",
    participants: "15.5K",
    avatar: "/api/placeholder/40/40",
    userName: "Evano"
  };

  const questions = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    question: "What does OOP stand for?",
    options: [
      { id: 'a', text: 'Object-Oriented Programming', color: 'bg-red-500', isCorrect: true },
      { id: 'b', text: 'Open Operating Process', color: 'bg-blue-500', isCorrect: false },
      { id: 'c', text: 'Original Object Program', color: 'bg-orange-500', isCorrect: false },
      { id: 'd', text: 'Open Operating Process', color: 'bg-green-500', isCorrect: false }
    ],
    background: 'bg-gradient-to-br from-sky-300 via-blue-400 to-indigo-500'
  }));

  const handleAnswerSelect = (questionId: number, optionId: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const toggleFavorite = () => setIsFavorited(!isFavorited);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-start gap-3 sm:gap-4 flex-1">
            {/* Avatar */}
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
              <span className="text-white font-bold text-sm sm:text-lg">E</span>
            </div>
            
            {/* User Info and Actions */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                <h2 className="font-semibold text-slate-800 text-sm sm:text-base">{quizData.userName}</h2>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1 px-2 py-1 text-xs sm:text-sm text-slate-600 hover:text-slate-800 transition-colors">
                    <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                  <button 
                    onClick={toggleFavorite}
                    className={`flex items-center gap-1 px-2 py-1 text-xs sm:text-sm transition-colors ${
                      isFavorited ? 'text-red-500' : 'text-slate-600 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-3 h-3 sm:w-4 sm:h-4 ${isFavorited ? 'fill-current' : ''}`} />
                    <span className="hidden sm:inline">Add to favorite</span>
                  </button>
                  <div className="relative group">
                    <button className="flex items-center gap-1 px-2 py-1 text-xs sm:text-sm text-slate-600 hover:text-slate-800 transition-colors">
                      <MoreHorizontal className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Option</span>
                    </button>
                    {/* Dropdown Menu */}
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                      <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                        <Share2 className="w-4 h-4" />
                        Share Quiz
                      </button>
                      <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                        <Download className="w-4 h-4" />
                        Export
                      </button>
                      <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                        <Settings className="w-4 h-4" />
                        Settings
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button className="self-start p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
          {/* Quiz Info */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6 sm:mb-8">
              {/* Quiz Header */}
              <div className="relative h-48 sm:h-64 bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-600/20"></div>
                <div className="relative text-center">
                  <div className="text-6xl sm:text-8xl font-bold text-white mb-2 transform perspective-1000 rotateX-10 drop-shadow-2xl">
                    OOP&apos;s
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full animate-bounce"></div>
                  <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-pink-400 rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* Quiz Content */}
              <div className="p-4 sm:p-6">
                <div className="mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mb-3">
                    StackQuiz
                  </span>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 mb-3">
                    {quizData.title}
                  </h1>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {quizData.description}
                  </p>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 sm:gap-6 text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <Play className="w-4 h-4" />
                    <span className="font-medium">{quizData.plays}</span>
                    <span>plays</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span className="font-medium">{quizData.participants}</span>
                    <span>participants</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Panel */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 sticky top-6">
              <h3 className="font-semibold text-slate-800 mb-4 text-sm sm:text-base">StackQuiz Session</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shadow-sm">
                  <div className="flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    <span className="font-medium">Host live</span>
                  </div>
                  <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                </button>

                <button className="w-full flex items-center justify-between px-4 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl transition-colors">
                  <div className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    <span className="font-medium">Assign</span>
                  </div>
                  <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Questions Section */}
        <div className="mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-slate-800">
              Questions ({questions.length})
            </h2>
            <button
              onClick={() => setShowAnswers(!showAnswers)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-slate-800 border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
            >
              {showAnswers ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showAnswers ? 'Hide answers' : 'Show answers'}
            </button>
          </div>

          {/* Questions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {questions.map((question) => (
              <div key={question.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-200 group">
                {/* Question Header */}
                <div className={`relative h-24 sm:h-32 ${question.background} flex items-center justify-center`}>
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative bg-white rounded-lg px-3 py-2 shadow-sm max-w-[90%]">
                    <p className="text-xs sm:text-sm font-medium text-slate-800 text-center line-clamp-2">
                      {question.question}
                    </p>
                  </div>
                </div>

                {/* Answer Options */}
                <div className="p-3 sm:p-4">
                  <div className="grid grid-cols-2 gap-2">
                    {question.options.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleAnswerSelect(question.id, option.id)}
                        className={`relative p-2 rounded-lg text-xs font-medium text-white transition-all duration-200 hover:scale-105 hover:shadow-md ${
                          option.color
                        } ${
                          selectedAnswers[question.id] === option.id
                            ? 'ring-2 ring-white ring-offset-2'
                            : ''
                        } ${
                          showAnswers && option.isCorrect
                            ? 'ring-2 ring-green-400 ring-offset-2'
                            : ''
                        }`}
                      >
                        <span className="relative z-10 line-clamp-2">{option.text}</span>
                        {showAnswers && option.isCorrect && (
                          <div className="absolute top-1 right-1 w-3 h-3 bg-green-400 rounded-full flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Question Number */}
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-xs text-slate-500">
                      Question {question.id}/10
                    </span>
                    {selectedAnswers[question.id] && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h3 className="font-semibold text-slate-800">Quiz Progress</h3>
            <span className="text-sm text-slate-600">
              {Object.keys(selectedAnswers).length} of {questions.length} answered
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${(Object.keys(selectedAnswers).length / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizInterface;
