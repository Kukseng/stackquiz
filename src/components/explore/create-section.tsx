import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Heart } from "lucide-react"

export function CreateSection() {
  return (
    <section className="px-4 py-16">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold font-serif text-accent mb-4">Create and discover amazing quizzes</h2>
      </div>

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-accent to-yellow-500 border-0 text-accent-foreground">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Your StackQuiz</h3>
            <p className="mb-6 opacity-90">Use the StackQuiz creator to build your own quizzes from scratch</p>
            <Button className="bg-white/20 hover:bg-white/30 text-accent-foreground border-white/30" variant="outline">
              Create your first StackQuiz
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent to-yellow-500 border-0 text-accent-foreground">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Favorite StackQuiz</h3>
            <p className="mb-6 opacity-90">Find your favorite learning resources and save them for later</p>
            <Button className="bg-white/20 hover:bg-white/30 text-accent-foreground border-white/30" variant="outline">
              Go to Discover
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
