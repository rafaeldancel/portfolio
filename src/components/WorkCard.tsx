import { siteContent, type WorkItem } from "@/content";
import { MetricDelta } from "@/components/MetricDelta";
import { WorkDetail } from "@/components/WorkDetail";

export function WorkCard({ item }: { item: WorkItem }) {
  const building = item.status === "in-progress";
  return (
    <article id={`work-${item.id}`} aria-labelledby={`work-${item.id}-title`} className={`work-card${building ? " work-building" : ""}`}>
      <div className="work-card-header">
        <span className="work-index" aria-hidden="true">{item.id.length === 1 ? item.id.toUpperCase() : "/"}</span>
        <p className="work-kind">{item.kind}</p>
      </div>
      <h3 id={`work-${item.id}-title`}>{item.title}</h3>
      <p className="work-context">{item.context}</p>
      {building ? <p className="building-label">{siteContent.building}<span className="block-cursor" aria-hidden="true" /></p> : (
        <>
          {item.metric && <MetricDelta {...item.metric} />}
          <ul className="token-list work-stack">{item.stack.map((technology) => <li className="stack-token" key={technology}>{technology}</li>)}</ul>
          <WorkDetail item={item} />
        </>
      )}
    </article>
  );
}
