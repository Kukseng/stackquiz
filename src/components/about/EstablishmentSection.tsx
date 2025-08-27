

export function EstablishmentSection() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1">
          <img src="/target-goal-achievement-3d.png" alt="Our Goal Illustration" className="w-full max-w-sm mx-auto" />
        </div>
        <div className="flex-1">
          <h2 className="text-4xl font-bold text-white mb-6">
            Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
              Establishment
            </span>
          </h2>
          <h3 className="text-2xl font-semibold text-orange-400 mb-4">Our Goal</h3>
          <p className="text-gray-300 text-lg leading-relaxed">
            Our platform makes learning fun, social, and
            <br />
            accessible by blending education with entertainment.
            <br />
            We aim to create an environment where users can
            <br />
            start new conversations to keep learners engaged.
          </p>
        </div>
      </div>
    </section>
  )
}
