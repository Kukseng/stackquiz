
export function TechnologySection() {
  const technologies = [
    { name: "Next.js", icon: "⚡" },
    { name: "Node.js", icon: "🟢" },
    { name: "Microsoft", icon: "🔷" },
    { name: "GitHub", icon: "🐙" },
    { name: "React", icon: "⚛️" },
    { name: "Redis", icon: "🔴" },
  ]

  return (
    <section className="container mx-auto px-4 py-16 text-center">
      <h2 className="text-4xl font-bold text-white mb-12">
        Our{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">Technology</span>
      </h2>
      <div className="flex flex-wrap justify-center gap-8">
        {technologies.map((tech, index) => (
          <div
            key={index}
            className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl hover:bg-white/20 transition-all duration-300 cursor-pointer"
          >
            {tech.icon}
          </div>
        ))}
      </div>
    </section>
  )
}
