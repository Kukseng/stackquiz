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
