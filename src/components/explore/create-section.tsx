"use client"
import React from 'react';
import { Plus, Heart } from 'lucide-react';

const CreateDiscoverQuiz = () => {
  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8  ">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-yellow-400 text-center mb-8 sm:mb-12 md:mb-16 px-4 leading-tight">
          Create and discover amazing quizzes
        </h1>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
          
          {/* Your StackQuiz Card */}
          <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 text-white relative overflow-hidden animate-fade-in-up shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <div className="relative z-10">
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-xl sm:text-2xl font-bold mb-2">Your StackQuiz</h2>
                  <p className="text-blue-100 text-xs sm:text-sm leading-relaxed max-w-sm">
                    Use the StackQuiz creator to build your own quizzes from scratch
                  </p>
                </div>
              </div>

              {/* Dotted Container */}
              <div className="border-2 border-dashed border-white border-opacity-40 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 text-center">
                {/* Plus Icon */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Plus className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-blue-600" />
                </div>

                {/* Button */}
                <button className="bg-white bg-opacity-90 text-blue-600 px-4 py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-3 rounded-full font-semibold hover:bg-opacity-100 hover:scale-105 transition-all duration-200 shadow-lg text-sm sm:text-base">
                  Create your first StackQuiz
                </button>
              </div>
            </div>

            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 opacity-10">
              <div className="w-full h-full bg-white rounded-full transform translate-x-12 sm:translate-x-16 -translate-y-12 sm:-translate-y-16"></div>
            </div>
          </div>

          {/* Favorite StackQuiz Card */}
          <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 text-white relative overflow-hidden animate-fade-in-up [animation-delay:120ms] shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <div className="relative z-10">
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-red-300" />
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-xl sm:text-2xl font-bold mb-2">Favorite StackQuiz</h2>
                  <p className="text-blue-100 text-xs sm:text-sm leading-relaxed max-w-sm">
                    Find your favorite learning resources and save them for later
                  </p>
                </div>
              </div>

              {/* Dotted Container */}
              <div className="border-2 border-dashed border-white border-opacity-40 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 text-center">
                {/* Heart Icon */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Heart className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-red-300" />
                </div>

                {/* Button */}
                <button className="bg-white bg-opacity-90 text-red-500 px-4 py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-3 rounded-full font-semibold hover:bg-opacity-100 hover:scale-105 transition-all duration-200 shadow-lg text-sm sm:text-base">
                  Go to Discover
                </button>
              </div>
            </div>

            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 opacity-10">
              <div className="w-full h-full bg-white rounded-full transform translate-x-12 sm:translate-x-16 -translate-y-12 sm:-translate-y-16"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default CreateDiscoverQuiz;