import { stack } from "@/content";

export function StackManifest() {
  return (
    <dl className="stack-manifest">
      {Object.entries(stack).map(([group, items]) => (
        <div className="manifest-row" key={group}>
          <dt>{group}</dt>
          <dd><ul className="token-list">{items.map((item) => <li key={item} className="stack-token">{item}</li>)}</ul></dd>
        </div>
      ))}
    </dl>
  );
}
