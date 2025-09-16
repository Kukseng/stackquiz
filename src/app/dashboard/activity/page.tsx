import React from 'react';
import GridCardComponents from '@/components/GridCardComponent';
import Image from 'next/image';

const ActivityDashboard = () => {
  const recentActivities = [
    {
      id: 1,
      title: 'Web Design',
      questions: '20 Qs',
      accuracy: '34%',
      thumbnail: 'https://novawebbusiness.com/wp-content/uploads/2024/03/Web-Development.webp',
    },
    {
      id: 2,
      title: 'Web Design',
      questions: '20 Qs',
      accuracy: '45%',
      thumbnail: 'https://novawebbusiness.com/wp-content/uploads/2024/03/Web-Development.webp',
    },
    {
      id: 3,
      title: 'Web Design',
      questions: '20 Qs',
      accuracy: '43%',
      thumbnail: 'https://novawebbusiness.com/wp-content/uploads/2024/03/Web-Development.webp',
    },
    {
      id: 4,
      title: 'Web Design',
      questions: '20 Qs',
      accuracy: '45%',
      thumbnail: 'https://novawebbusiness.com/wp-content/uploads/2024/03/Web-Development.webp',
    },
  ];

  const getAccuracyColor = (accuracy: string) => {
    const numAccuracy = parseInt(accuracy);
    if (numAccuracy >= 50) return 'bg-green-500';
    if (numAccuracy >= 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Recent Activity Section */}
        <section className="mb-12">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-700 mb-6">Recent Activity</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
              >
                {/* Thumbnail */}
                <div className="relative w-full h-32">
                  <Image
                    src={activity.thumbnail}
                    alt={activity.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-medium text-gray-700">
                    {activity.questions}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">{activity.title}</h3>

                  {/* Accuracy Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className={`h-2 rounded-full ${getAccuracyColor(activity.accuracy)}`}
                      style={{ width: activity.accuracy }}
                    ></div>
                  </div>
                  <p className="text-sm text-white bg-orange-400 rounded-full px-3 py-1 inline-block font-medium">
                    {activity.accuracy} accuracy
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Created Section */}
        <section>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-700 mb-6">Created</h2>
          <GridCardComponents />
        </section>
      </div>
    </div>
  );
};

export default ActivityDashboard;
