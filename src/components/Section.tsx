import type { ReactNode } from "react";

type SectionProps = Readonly<{
  id: string;
  index: string;
  label: string;
  children?: ReactNode;
}>;

export function Section({ id, index, label, children }: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="section-shell">
      <h2 id={`${id}-heading`} className="section-label">
        <span>{index} / {label}</span>
        <span aria-hidden="true" className="section-line" />
      </h2>
      <div className="section-body grid-12">{children}</div>
    </section>
  );
}
