import { Section } from "@/components/Section";
import { TopBar } from "@/components/TopBar";
import { Hero } from "@/components/Hero";
import { ExperienceLog } from "@/components/ExperienceLog";
import { StackManifest } from "@/components/StackManifest";
import { WorkGrid } from "@/components/WorkGrid";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { sections } from "@/content";

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
      <main id="main-content" className="page-container" tabIndex={-1}>
        <Hero />
        {sections.map((section) => (
          <Section key={section.id} {...section}>{sectionContent[section.id]}</Section>
        ))}
      </main>
      <Footer />
    </>
  );
}
