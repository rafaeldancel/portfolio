import { profile, siteContent } from "@/content";
import { ExternalArrow } from "@/components/ExternalArrow";

export function Contact() {
  return (
    <div className="contact-content">
      <a className="contact-email" href={`mailto:${profile.email}`}>{profile.email}</a>
      <div className="contact-links">
        <a href={profile.linkedin}>{siteContent.linkedinLabel}<ExternalArrow /></a>
        <a href={profile.github}>{siteContent.githubLabel}<ExternalArrow /></a>
      </div>
    </div>
  );
}
