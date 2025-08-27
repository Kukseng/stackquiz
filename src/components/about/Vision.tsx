
export function VisionSection() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1">
          <img src="/future-vision-orb.png" alt="Our Vision Illustration" className="w-full max-w-sm mx-auto" />
        </div>
        <div className="flex-1">
          <h2 className="text-4xl font-bold text-white mb-6">
            Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">Vision</span>
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            Our vision is to become the leading platform where
            <br />
            learning and entertainment seamlessly merge, creating
            <br />a global community of learners who are motivated to
            <br />
            explore new topics through fun and engaging quizzes.
          </p>
        </div>
      </div>
    </section>
  )
}
