
export function WhyChooseSection() {
  const features = [
    {
      title: "Customizable",
      description: "Easy learning experience and interactive quiz creation",
      color: "bg-gradient-to-br from-orange-400 to-red-500",
    },
    {
      title: "Global Community",
      description: "Connect with learners and educators from around the world",
      color: "bg-gradient-to-br from-green-400 to-blue-500",
    },
    {
      title: "Fast & Easy",
      description: "Create quizzes within minutes and share them instantly",
      color: "bg-gradient-to-br from-pink-400 to-purple-500",
    },
  ]

  return (
    <section className=" py-20">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          Why Choose <span className="text-orange-400">StackQuizz</span>?
        </h2>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {features.map((feature, index) => (
            <div key={index} className={`${feature.color} rounded-2xl p-8 text-white`}>
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-white/90">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
