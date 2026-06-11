import Link from "next/link";
import { breadcrumbJsonLd, JsonLd, type Crumb } from "@/lib/seo";

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Migas de pan" className="text-sm text-muted">
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      {crumbs.map((c, i) => (
        <span key={c.url}>
          {i > 0 && <span className="mx-1.5 text-slate-300">›</span>}
          {i < crumbs.length - 1
            ? <Link href={c.url} className="hover:text-blue">{c.name}</Link>
            : <span className="text-ink">{c.name}</span>}
        </span>
      ))}
    </nav>
  );
}
