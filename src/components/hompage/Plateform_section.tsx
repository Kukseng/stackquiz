import { Button } from "@/components/ui/button"

export function PlatformSection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Image on left for desktop, under text on mobile */}
          {/* <div className="order-2 lg:order-1 w-full h-80 sm:h-96 flex items-center justify-center">
            <img
              src="second.svg"
              alt="Platform presentation"
              className="w-full max-w-sm sm:max-w-md lg:max-w-full h-auto"
            />
          </div> */}
          <div className="order-2 lg:order-1 relative w-full h-64 sm:h-80 md:h-96 flex items-center justify-center mt-8 lg:mt-0">
            <img
              src="second.svg"
              alt="People engaging with quiz platform"
              className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-full h-auto"
            />
          </div>

          {/* Text on right for desktop, above image on mobile */}
          <div className="order-1 lg:order-2 text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Our Amazing Platform
            </h2>
            <p className="text-base sm:text-lg text-gray-300 mb-8 max-w-lg mx-auto lg:mx-0">
              Create quizzes to promote the educational benefits of your content. Engage your audience in real-time,
              and create moments they'll never forget.
            </p>
            <Button className="btn-secondary btn-text px-6 py-3 sm:py-4 md:py-5 box-radius font-semibold text-base sm:text-lg">
              Get Start
            </Button>
          </div>

        </div>
      </div>
    </section>
  )
}
