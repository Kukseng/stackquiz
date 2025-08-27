import { Button } from "@/components/ui/button";

export default function CreateQuizSection() {
  return (
    <div className="w-full px-4 sm:px-7 md:px-8 lg:px-10 xl:px-12 py-6">
      <div className="bg-gray-screen-page box-radius max-w-3xl w-full flex flex-col lg:flex-row items-center lg:items-stretch p-8 sm:p-4 lg:p-6 gap-3 lg:gap-4 mx-auto">
        {/* Left: Text + Button */}
        <div className="flex-1 flex flex-col justify-center text-center lg:text-left space-y-2">
          <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-white leading-tight">
            Create a quiz
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white">
            Play for free <br /> with participants
          </p>
          <div className="mt-2">
            <Button className="btn-secondary btn-text px-4 py-2 sm:py-3 box-radius font-semibold text-sm sm:text-base">
              Get start →
            </Button>
          </div>
        </div>

        {/* Right: Illustration */}
        <div className="flex-1 flex justify-center lg:justify-end mt-4 lg:mt-0">
          <img
            src="quiz.svg"
            alt="3D character thinking"
            className="w-80 sm:w-80 md:w-82 lg:w-90 max-w-[90%] sm:max-w-sm md:max-w-md lg:max-w-sm h-auto"
          />
        </div>
      </div>
    </div>
  );
}
