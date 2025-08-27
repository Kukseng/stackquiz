
import { Star } from "lucide-react"

export function TeamsSection() {
  const teamMembers = [
    { name: "Alice Johnson", role: "Frontend Developer", rating: 5 },
    { name: "Bob Smith", role: "Backend Developer", rating: 4 },
    { name: "Carol Davis", role: "UI/UX Designer", rating: 5 },
    { name: "David Wilson", role: "Product Manager", rating: 4 },
    { name: "Eva Brown", role: "QA Engineer", rating: 5 },
    { name: "Frank Miller", role: "DevOps Engineer", rating: 4 },
    { name: "Grace Lee", role: "Data Scientist", rating: 5 },
    { name: "Henry Taylor", role: "Marketing Lead", rating: 4 },
  ]

  return (
    <section className="container mx-auto px-4 py-16 text-center">
      <h2 className="text-4xl font-bold text-white mb-12">
        Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">Teams</span>
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center hover:bg-white/20 transition-all duration-300"
          >
            <img
              src={`/professional-team.png?height=80&width=80&query=professional ${member.role.toLowerCase()} portrait`}
              alt={member.name}
              className="w-16 h-16 rounded-full mx-auto mb-3 object-cover"
            />
            <h3 className="text-lg font-bold text-white mb-1">{member.name}</h3>
            <p className="text-gray-300 text-sm mb-2">{member.role}</p>
            <div className="flex justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${i < member.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
