
export function ValuesSection() {
  const values = [
    {
      title: "Collaboration",
      description: "Working together to achieve great results and foster innovation.",
      color: "from-orange-400 to-yellow-400",
    },
    {
      title: "Innovation",
      description: "Constantly pushing boundaries to create cutting-edge learning experiences.",
      color: "from-green-400 to-blue-400",
    },
    {
      title: "Continuous Learning",
      description: "Embracing growth mindset and always striving to improve and evolve.",
      color: "from-purple-400 to-pink-400",
    },
  ]

  return (
    <section className="container mx-auto px-4 py-16 text-center">
      <h2 className="text-4xl font-bold text-white mb-12">
        Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">Values</span>
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {values.map((value, index) => (
          <div key={index} className={`bg-gradient-to-br ${value.color} p-6 rounded-2xl text-white`}>
            <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
            <p className="text-white/90 leading-relaxed">{value.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
