import CardQuizComponent from "../CardQuizComponent";
import Searchbar from "../leaderboard/Searchbar";

export function Explore() {
  const quizCards = [
     {
      title: "Math Fundamental",
      questions: 15,
      difficulty: "Easy",
      time: "30 min",
      color: "bg-blue-600",
      image:
        "https://i.pinimg.com/1200x/57/26/63/5726635fe0e4c3c5affcbe56f871f7e2.jpg",
    },
    {
      title: "Science Essentials",
      questions: 20,
      difficulty: "Medium",
      time: "45 min",
      color: "bg-yellow-500",
      image:
        "https://i.pinimg.com/736x/85/a3/43/85a3435b29390b4c57822f6fd5d8a257.jpg",
    },
    {
      title: "Computer Programming",
      questions: 25,
      difficulty: "Hard",
      time: "1 hour",
      color: "bg-red-500",
      image:
        "https://i.pinimg.com/1200x/bc/db/43/bcdb43f51ba1feedf9077bb64a29a58e.jpg",
    },
    {
      title: "Science Essentials",
      questions: 20,
      difficulty: "Medium",
      time: "45 min",
      color: "bg-yellow-500",
      image:
        "https://i.pinimg.com/736x/2c/db/77/2cdb7717db18b51bf43e2e52380fb74f.jpg",
    },
    {
      title: "Math Fundamental",
      questions: 15,
      difficulty: "Easy",
      time: "30 min",
      color: "bg-blue-600",
      image:
        "https://i.pinimg.com/1200x/57/26/63/5726635fe0e4c3c5affcbe56f871f7e2.jpg",
    },
    {
      title: "Science Essentials",
      questions: 20,
      difficulty: "Medium",
      time: "45 min",
      color: "bg-yellow-500",
      image:
        "https://i.pinimg.com/736x/85/a3/43/85a3435b29390b4c57822f6fd5d8a257.jpg",
    },
    {
      title: "Computer Programming",
      questions: 25,
      difficulty: "Hard",
      time: "1 hour",
      color: "bg-red-500",
      image:
        "https://i.pinimg.com/1200x/bc/db/43/bcdb43f51ba1feedf9077bb64a29a58e.jpg",
    },
    {
      title: "Science Essentials",
      questions: 20,
      difficulty: "Medium",
      time: "45 min",
      color: "bg-yellow-500",
      image:
        "https://i.pinimg.com/736x/2c/db/77/2cdb7717db18b51bf43e2e52380fb74f.jpg",
    },
  ];

  return (
    <div className="min-h-[800px] bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden rounded-lg">
      <Searchbar />

      <div className="relative flex">
        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Library Page Header */}
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-white">Explore</h1>
            </div>
            <p className="text-gray-300 text-lg">
              Explore our collection of quizzes across various subjects and
              difficulty levels
            </p>
          </div>

          {/* Classic Mode Section */}
          <div className="mb-4">
            <div className="flex items-start gap-8"></div>
          </div>

          {/* Quiz Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quizCards.map((quiz, index) => (
              <CardQuizComponent
                key={index}
                id={index}
                title={quiz.title}
                questions={quiz.questions}
                difficulty={quiz.difficulty}
                time={quiz.time}
                color={quiz.color}
                image={quiz.image}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
