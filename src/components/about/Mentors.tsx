

import { Star } from "lucide-react"

export function MentorsSection() {
  const mentors = [
    {
      name: "Zara Charan",
      role: "Senior Mentor",
      image: "/placeholder-x88pt.png",
      rating: 5,
    },
    {
      name: "Sana Imtiazul",
      role: "Lead Mentor",
      image: "/placeholder-x88pt.png",
      rating: 5,
    },
  ]

  return (
    <section className="container mx-auto px-4 py-16 text-center">
      <h2 className="text-4xl font-bold text-white mb-12">
        Our{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">Mentors</span>
      </h2>
      <div className="flex justify-center gap-8">
        {mentors.map((mentor, index) => (
          <div
            key={index}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/20 transition-all duration-300"
          >
            <img
              src={mentor.image || "/placeholder.svg"}
              alt={mentor.name}
              className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
            />
            <h3 className="text-xl font-bold text-white mb-2">{mentor.name}</h3>
            <p className="text-gray-300 mb-3">{mentor.role}</p>
            <div className="flex justify-center gap-1">
              {[...Array(mentor.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
