import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

export function SearchSection() {
  return (
    <section className="px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Type here..."
              className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <Select>
            <SelectTrigger className="w-48 bg-input border-border">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="math">Math Fundamental</SelectItem>
              <SelectItem value="programming">Computer Programming</SelectItem>
              <SelectItem value="science">Science Essentials</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  )
}



import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const templates = [
  {
    title: "Computer Fundamental",
    description: "Understanding computer fundamentals helps you unlock the core technology behind every device.",
    image: "/computer-brain-circuits-blue.png",
  },
  {
    title: "Science Essentials",
    description: "Science essentials cover core ideas of physics, chemistry, and biology for a strong foundation.",
    image: "/placeholder-ooz2m.png",
  },
  {
    title: "Math Fundamental",
    description: "Math fundamentals build core skills in arithmetic, algebra, geometry, and basic statistics.",
    image: "/placeholder-rdxd4.png",
  },
  {
    title: "Computer Fundamental",
    description: "Understanding computer fundamentals helps you unlock the core technology behind every device.",
    image: "/blue-tech-components.png",
  },
]

export function TemplatesSection() {
  return (
    <section className="px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold font-serif text-accent">Ready-to-Use Templates</h2>
          <Button variant="link" className="text-accent hover:text-accent/80">
            View more templates
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {templates.map((template, index) => (
            <Card key={index} className="bg-card border-border hover:scale-105 transition-transform cursor-pointer">
              <CardContent className="p-6 flex gap-4">
                <img
                  src={template.image || "/placeholder.svg"}
                  alt={template.title}
                  className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-card-foreground mb-2">{template.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{template.description}</p>
                </div>
                <Button variant="ghost" size="sm" className="text-accent hover:text-accent/80 self-start">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
