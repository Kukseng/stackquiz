
import { Button } from "@/components/ui/button"

export function AboutHero() {
  return (
    <section className="container mx-auto px-4 py-20 text-center">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="flex-1 text-left">
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
            Welcome To
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
              StackQuizz
            </span>
            <br />
            About Us
          </h1>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            We are passionate about creating fun and interactive
            <br />
            quiz experiences that bring people together, test
            <br />
            knowledge, and inspire lifelong curiosity.
          </p>
          <Button className="bg-gradient-to-r from-orange-400 to-yellow-400 hover:from-orange-500 hover:to-yellow-500 text-white px-8 py-3 rounded-full text-lg font-semibold">
            Get Started
          </Button>
        </div>
        <div className="flex-1">
          <img src="hh.svg" alt="About Us Illustration" className="w-full max-w-md mx-auto" />
        </div>
      </div>
    </section>
  )
}
