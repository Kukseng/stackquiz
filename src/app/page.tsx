
import CreateQuizSection from "@/components/hompage/Create_quiz_section";
import { CTASection } from "@/components/hompage/Cta_section";
import { MarqueeDemo } from "@/components/hompage/Feedback_section";
import { HeroSection } from "@/components/hompage/Hero_section";
import { PlatformSection } from "@/components/hompage/Plateform_section";
// import QuestionTypesSection from "@/components/hompage/Question_type_section";
import { StatsSection } from "@/components/hompage/State_section";
import  {TopPlayersSection}  from "@/components/hompage/Top_player";
import { WhyChooseSection } from "@/components/hompage/Why_chose_section";
// import { QuestionTypesSection } from "@/components/hompage/Question_type_section";
import Footer from "@/components/navbar_footer/FooterComponent";
import { Navbar } from "@/components/navbar_footer/NavbarComponent";


// import ParticlesBackground from '@/components/ui/ParticlesBackground';

export default function HomePage() {
  return (
    <div>
      {/* <Navbar /> */}
      <main>
        <HeroSection />
        <StatsSection />
        <CreateQuizSection />
        <WhyChooseSection />
        <PlatformSection />
        <MarqueeDemo/>
        <TopPlayersSection />
        {/* <QuestionTypesSection/> */}
        <CTASection />
      </main>
      {/* <Footer /> */}
    </div>
  );
}
