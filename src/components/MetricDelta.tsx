import type { WorkMetric } from "@/content";

export function MetricDelta({ from, to, value, unit, label }: WorkMetric) {
  const finalValue = to ?? value;
  return (
    <div className="metric">
      <p className="metric-value">
        {from !== undefined && <><span className="metric-from">{from}{to !== undefined && <span className="metric-unit">{unit}</span>}</span><span className="metric-arrow"> → </span></>}
        <span>{finalValue}<span className="metric-unit">{to !== undefined ? unit : ` ${unit}`}</span></span>
      </p>
      <p className="metric-label">{label}</p>
    </div>
  );
}
