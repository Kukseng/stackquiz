import React, { useState } from 'react';
import { Trophy, Users, Clock, HelpCircle, Edit, MoreVertical, Search, CheckCircle, MoreHorizontal } from 'lucide-react';

const QuizResultsDashboard = () => {
  const [activeTab, setActiveTab] = useState('Summary');
  const [activeLibraryTab, setActiveLibraryTab] = useState('Draft');

  const tabs = ['Summary', 'Participants (5)', 'Questions (3)', 'Feedback'];
  const libraryTabs = ['Recent', 'Draft', 'Favorites'];

  // Sample data
  const participants = [
    { name: 'Polin', rank: 1, correctAnswers: '100%', unanswered: '-', finalScore: 5503 },
    { name: 'Polin', rank: 1, correctAnswers: '100%', unanswered: '-', finalScore: 5503 },
    { name: 'Polin', rank: 1, correctAnswers: '100%', unanswered: '-', finalScore: 5503 },
    { name: 'Polin', rank: 1, correctAnswers: '100%', unanswered: '-', finalScore: 5503 },
    { name: 'Polin', rank: 1, correctAnswers: '100%', unanswered: '-', finalScore: 5503 },
  ];

  const questions = [
    { id: 1, question: 'What does @SpringBootApplication annotation do?', type: 'Quiz', correctRate: '100%' },
    { id: 2, question: 'What file is used for configuration in a Spring Boot project?', type: 'Quiz', correctRate: '100%' },
    { id: 3, question: 'Which dependency is used for building REST APIs in Spring Boot?', type: 'Quiz', correctRate: '100%' },
  ];

  const draftQuizzes = [
    { 
      id: 1, 
      title: 'Math fundamental', 
      category: 'Math', 
      level: 'Hard', 
      visibility: 'Private', 
      lastModified: '3 days ago',
      plays: 0,
      status: 'Draft'
    },
    { 
      id: 2, 
      title: 'Math fundamental', 
      category: 'Math', 
      level: 'Hard', 
      visibility: 'Private', 
      lastModified: '3 days ago',
      plays: 0,
      status: 'Draft'
    },
    { 
      id: 3, 
      title: 'Math fundamental', 
      category: 'Math', 
      level: 'Hard', 
      visibility: 'Private', 
      lastModified: '3 days ago',
      plays: 0,
      status: 'Draft'
    },
  ];

  const renderParticipantsView = () => (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 sm:mb-0">All (5)</h2>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search" 
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
            />
          </div>
        </div>

        {/* Table Header */}
        <div className="hidden md:grid md:grid-cols-5 gap-4 pb-3 border-b border-gray-200 text-sm font-medium text-gray-600">
          <div>Nickname</div>
          <div>Rank</div>
          <div>Correct answers</div>
          <div>Unanswered</div>
          <div>Final score</div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-gray-200">
          {participants.map((participant, index) => (
            <div key={index} className="py-4">
              <div className="md:grid md:grid-cols-5 md:gap-4 md:items-center">
                <div className="font-medium text-gray-900 mb-2 md:mb-0">{participant.name}</div>
                <div className="flex items-center mb-2 md:mb-0">
                  <span className="md:hidden text-sm text-gray-500 mr-2">Rank:</span>
                  <span className="font-medium">{participant.rank}</span>
                </div>
                <div className="flex items-center mb-2 md:mb-0">
                  <span className="md:hidden text-sm text-gray-500 mr-2">Correct:</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="font-medium text-green-600">{participant.correctAnswers}</span>
                  </div>
                </div>
                <div className="flex items-center mb-2 md:mb-0">
                  <span className="md:hidden text-sm text-gray-500 mr-2">Unanswered:</span>
                  <span>{participant.unanswered}</span>
                </div>
                <div className="flex items-center">
                  <span className="md:hidden text-sm text-gray-500 mr-2">Score:</span>
                  <span className="font-bold text-lg">{participant.finalScore}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderQuestionsView = () => (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 sm:mb-0">All (3)</h2>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search" 
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
            />
          </div>
        </div>

        {/* Table Header */}
        <div className="hidden md:grid md:grid-cols-3 gap-4 pb-3 border-b border-gray-200 text-sm font-medium text-gray-600">
          <div>Question</div>
          <div>Type</div>
          <div>Correct/Incorrect</div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-gray-200">
          {questions.map((question, index) => (
            <div key={question.id} className="py-4">
              <div className="md:grid md:grid-cols-3 md:gap-4 md:items-center">
                <div className="mb-2 md:mb-0">
                  <span className="font-medium text-gray-900">
                    {question.id}. {question.question}
                  </span>
                </div>
                <div className="mb-2 md:mb-0">
                  <span className="md:hidden text-sm text-gray-500 mr-2">Type:</span>
                  <span className="text-gray-600">{question.type}</span>
                </div>
                <div className="flex items-center">
                  <span className="md:hidden text-sm text-gray-500 mr-2">Success rate:</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="font-medium text-green-600">{question.correctRate}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLibraryView = () => (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Library Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-4 md:p-6">
            <div className="flex flex-wrap gap-1 border-b border-gray-200">
              {libraryTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveLibraryTab(tab)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeLibraryTab === tab
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

        {/* Quiz Library Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 md:p-6">
            {/* Table Header */}
            <div className="hidden lg:grid lg:grid-cols-6 gap-4 pb-3 border-b border-gray-200 text-sm font-medium text-gray-600">
              <div className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-gray-300" />
                <span>Title</span>
              </div>
              <div>Category</div>
              <div>Level</div>
              <div>Visibility</div>
              <div>Last modified</div>
              <div>Action</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-gray-200">
              {draftQuizzes.map((quiz) => (
                <div key={quiz.id} className="py-4">
                  <div className="lg:grid lg:grid-cols-6 lg:gap-4 lg:items-center">
                    {/* Title Column */}
                    <div className="flex items-center gap-3 mb-3 lg:mb-0">
                      <input type="checkbox" className="rounded border-gray-300 hidden lg:block" />
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <div className="w-6 h-6 text-white">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
                            </svg>
                          </div>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{quiz.title}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                              {quiz.status}
                            </span>
                            <span className="text-sm text-gray-500">{quiz.plays} plays</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Other columns for desktop */}
                    <div className="lg:block">
                      <span className="lg:hidden text-sm text-gray-500 mr-2">Category:</span>
                      <span className="text-gray-600">{quiz.category}</span>
                    </div>
                    <div className="lg:block">
                      <span className="lg:hidden text-sm text-gray-500 mr-2">Level:</span>
                      <span className="text-gray-600">{quiz.level}</span>
                    </div>
                    <div className="lg:block">
                      <span className="lg:hidden text-sm text-gray-500 mr-2">Visibility:</span>
                      <span className="text-gray-600">{quiz.visibility}</span>
                    </div>
                    <div className="lg:block">
                      <span className="lg:hidden text-sm text-gray-500 mr-2">Modified:</span>
                      <span className="text-gray-600">{quiz.lastModified}</span>
                    </div>
                    
                    {/* Action Column */}
                    <div className="flex justify-end lg:justify-start mt-3 lg:mt-0">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreHorizontal className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Mobile layout for other info */}
                  <div className="lg:hidden mt-3 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Category:</span>
                      <span className="ml-2 text-gray-900">{quiz.category}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Level:</span>
                      <span className="ml-2 text-gray-900">{quiz.level}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Visibility:</span>
                      <span className="ml-2 text-gray-900">{quiz.visibility}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Modified:</span>
                      <span className="ml-2 text-gray-900">{quiz.lastModified}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSummaryView = () => (
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
                <h4 className="font-medium text-gray-900">Dgidn&apos;t finish (0)</h4>
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
  );

  // Check if we should show library view
  if (activeTab === 'Library') {
    return renderLibraryView();
  }

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
                <button 
                  onClick={() => setActiveTab('Library')}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Quiz Library
                </button>
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

        {/* Main Content */}
        {activeTab === 'Summary' && renderSummaryView()}
        {activeTab === 'Participants (5)' && renderParticipantsView()}
        {activeTab === 'Questions (3)' && renderQuestionsView()}
        {activeTab === 'Feedback' && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Feedback</h2>
            <p className="text-gray-600">Feedback section coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizResultsDashboard;