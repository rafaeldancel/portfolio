import { work } from "@/content";
import { WorkCard } from "@/components/WorkCard";

export function WorkGrid() {
  return <div className="work-grid">{work.map((item) => <WorkCard key={item.id} item={item} />)}</div>;
}
