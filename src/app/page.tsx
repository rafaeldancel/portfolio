import { Section } from "@/components/Section";
import { TopBar } from "@/components/TopBar";
import { Hero } from "@/components/Hero";
import { ExperienceLog } from "@/components/ExperienceLog";
import { StackManifest } from "@/components/StackManifest";
import { WorkGrid } from "@/components/WorkGrid";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { experience, sections, stack } from "@/content";
import { HighlightProvider } from "@/lib/highlight-context";

const sectionContent = {
  experience: <ExperienceLog />,
  stack: <StackManifest />,
  work: <WorkGrid />,
  contact: <Contact />,
};

export default function Home() {
  return (
    <>
      <TopBar />
      <HighlightProvider>
        <main id="main-content" className="page-container" tabIndex={-1}>
          <Hero />
          {sections.map((section) => (
            <Section key={section.id} {...section} reveal="print" revealItems={section.id === "experience" ? experience.length + 1 : section.id === "stack" ? Object.keys(stack).length : section.id === "contact" ? 2 : undefined}>{sectionContent[section.id]}</Section>
          ))}
        </main>
      </HighlightProvider>
      <Footer />
    </>
  );
}
