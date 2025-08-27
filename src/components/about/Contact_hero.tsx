
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function ContactSection() {
  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-4xl font-bold text-white text-center mb-12">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">Contact Us</span>
      </h2>
      <div className="flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1">
          <img src="/3d-character-contact-form.png" alt="Contact Us Illustration" className="w-full max-w-sm mx-auto" />
        </div>
        <div className="flex-1">
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                placeholder="First Name"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
              <Input
                placeholder="Last Name"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
            <Input
              type="email"
              placeholder="Email"
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
            <Input
              placeholder="Phone Number"
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
            <Textarea
              placeholder="Message"
              rows={4}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
            <Button className="w-full bg-gradient-to-r from-orange-400 to-yellow-400 hover:from-orange-500 hover:to-yellow-500 text-white py-3 rounded-full text-lg font-semibold">
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
