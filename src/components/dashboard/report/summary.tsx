import React, { useState } from 'react';
import { Trophy, Users, Clock, HelpCircle, Edit, MoreVertical } from 'lucide-react';

const QuizResultsDashboard = () => {
  const [activeTab, setActiveTab] = useState('Summary');

  const tabs = ['Summary', 'Participants (5)', 'Questions (3)', 'Feedback'];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <div className="flex items-center gap-3 mb-4 md:mb-0">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Spring Boot Quiz</h1>
                <Edit className="w-5 h-5 text-gray-600 cursor-pointer hover:text-blue-600" />
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Live
                  </div>
                  <div className="text-sm text-gray-600">Aug 5, 2025, 3:00 PM</div>
                  <div className="text-sm text-gray-600">Host by : Name</div>
                </div>
                <MoreVertical className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800" />
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-1 border-b border-gray-200">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Section - Results */}
          <div className="xl:col-span-2 space-y-6">
            {/* Perfect Score Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full border-8 border-green-500 flex items-center justify-center bg-white">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">100%</div>
                        <div className="text-sm font-medium text-gray-600">Correct</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Perfection!</h2>
                  <p className="text-gray-600 mb-6 text-lg">
                    Play again and see if the same group can stay perfect or see if new participants can match this score.
                  </p>
                  <button className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                    Play Again
                  </button>
                </div>
              </div>
            </div>

            {/* Advanced Reports */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Advanced reports</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Difficult Questions */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Difficult questions (0)</h4>
                    <HelpCircle className="w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600">Great job! No one found any questions too challenging.</p>
                </div>

                {/* Need Help */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Need help (0)</h4>
                    <HelpCircle className="w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600">No one seems to need help</p>
                </div>

                {/* Didn't Finish */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Didn&apos;t finish (0)</h4>
                    <HelpCircle className="w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600">Great! Everyone finished</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Stats & Actions */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-gray-600">Participants</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">5</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">?</span>
                    </div>
                    <span className="text-sm font-medium text-gray-600">Participants</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">3</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-gray-600">Time</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">5 min</span>
                </div>
              </div>
            </div>

            {/* Podium Card */}
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg p-6 text-white">
              <div className="text-center mb-4">
                <Trophy className="w-12 h-12 text-yellow-300 mx-auto mb-3" />
              </div>
              
              <div className="space-y-3">
                <button className="w-full bg-blue-500 hover:bg-blue-400 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                  View podium
                </button>
                <button className="w-full bg-white/20 hover:bg-white/30 text-white py-3 px-4 rounded-lg font-medium transition-colors backdrop-blur-sm">
                  Share podium
                </button>
              </div>
              
              <div className="mt-4 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                <p className="text-sm">
                  <span className="font-medium">Top tip:</span> Boost participant engagement by sharing the podium.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResultsDashboard;