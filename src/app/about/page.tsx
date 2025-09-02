import { AboutHero } from "@/components/about/About_hero";
import { ContactSection } from "@/components/about/Contact_hero";
import { EstablishmentSection } from "@/components/about/EstablishmentSection";
import { MentorsSection } from "@/components/about/Mentors";
import { MissionSection } from "@/components/about/Mission";
import { TeamsSection } from "@/components/about/Team";
import { TechnologySection } from "@/components/about/Technology";
import { ValuesSection } from "@/components/about/Value";
import { VisionSection } from "@/components/about/Vision";



export default function AboutPage() {
  return (
    <div>
      {/* Animated stars background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}
      </div>


      <main className="relative z-10">
        <AboutHero/>
        <TechnologySection/>
        <EstablishmentSection/>
        <MissionSection/>
        <VisionSection/>
        <ValuesSection/>
        <MentorsSection/>
        <TeamsSection/>
        <ContactSection/>
      </main>
  
    </div>
  )
}
