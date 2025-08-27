
export function MissionSection() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 order-2 lg:order-1">
          <h2 className="text-4xl font-bold text-white mb-6">
            Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
              Mission
            </span>
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            Our mission is to revolutionize online learning and
            <br />
            knowledge-sharing through education and quiz to bridge
            <br />
            the gap between entertainment and learning, making
            <br />
            education more engaging and effective.
          </p>
        </div>
        <div className="flex-1 order-1 lg:order-2">
          <img src="/3d-characters-meeting.png" alt="Our Mission Illustration" className="w-full max-w-sm mx-auto" />
        </div>
      </div>
    </section>
  )
}
