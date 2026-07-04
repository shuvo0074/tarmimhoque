import { forwardRef, memo } from "react";
import { AboutSection } from "./sections/AboutSection";
import { ContactSection } from "./sections/ContactSection";
import { ExperienceSection } from "./sections/ExperienceSection";
import { HeroSection } from "./sections/HeroSection";
import { ProjectsSection } from "./sections/ProjectsSection";

const DeckComponent = forwardRef(function DeckComponent(_, ref) {
  return (
    <main id="deck" className="deck" aria-live="polite" ref={ref}>
      <HeroSection />
      <AboutSection />
      <ExperienceSection />
      <ProjectsSection />
      <ContactSection />
    </main>
  );
});

export const Deck = memo(DeckComponent);
