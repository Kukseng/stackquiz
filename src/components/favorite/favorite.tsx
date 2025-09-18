import CardQuizComponent from "../CardQuizComponent";
import Searchbar from "../leaderboard/Searchbar";
import TemplatesCardComponent from "../TemplateCardComponent";

export function Favorites() {

  return (
    <div className="min-h-[800px] bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden rounded-lg">
      <Searchbar />

      <div className="relative flex">
        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Library Page Header */}
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-white">Favorite</h1>
            </div>
            <p className="text-gray-300 text-lg">
             Save your favorite quizzes and track progress across all subjects.
            </p>
          </div>

          {/* Classic Mode Section */}
          <div className="mb-4">
            <div className="flex items-start gap-8"></div>
          </div>

          {/* Quiz Cards Grid */}
          <TemplatesCardComponent/>

        </div>  
      </div>
    </div>
  );
}
