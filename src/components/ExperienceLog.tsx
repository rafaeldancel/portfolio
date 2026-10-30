import { education, experience } from "@/content";

function commitId(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) hash = (Math.imul(hash, 31) + value.charCodeAt(i)) | 0;
  return (hash >>> 0).toString(16).padStart(8, "0").slice(0, 6);
}

export function ExperienceLog() {
  return (
    <div className="experience-content">
      <ol className="experience-log">
      {experience.map((entry) => (
        <li key={`${entry.org}-${entry.role}`} className="experience-row">
          <span className="commit-id" aria-hidden="true">{commitId(`${entry.role}:${entry.org}:${entry.range}`)}</span>
          <p className="experience-range">{entry.range}</p>
          <div className="experience-copy">
            <h3>{entry.role}</h3>
            <p className="experience-org">{entry.org}</p>
            <p className="experience-note">{entry.note}</p>
          </div>
        </li>
      ))}
      </ol>
      <div className="education-row">
        <p className="experience-range">{education.range}</p>
        <div>
          <h3>{education.degree}</h3>
          <p className="experience-org">{education.school}</p>
          <p className="education-honor">{education.honor}</p>
        </div>
        <ul className="education-certs">{education.certs.map((cert) => <li key={cert}>{cert}</li>)}</ul>
      </div>
    </div>
  );
}
