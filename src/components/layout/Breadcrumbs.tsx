import Link from "next/link";
import { breadcrumbJsonLd, JsonLd, type Crumb } from "@/lib/seo";

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Migas de pan" className="text-sm text-muted">
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      {crumbs.map((c, i) => (
        <span key={c.url}>
          {/* aria-hidden: es un adorno visual. Sin esto el lector lee "comilla
              angular" entre cada miga. El color sube de slate-300 (1.4:1) a
              slate-400, que ya se ve. */}
          {i > 0 && <span aria-hidden="true" className="mx-1.5 text-slate-400">›</span>}
          {i < crumbs.length - 1
            ? <Link href={c.url} className="hover:text-blue">{c.name}</Link>
            : <span aria-current="page" className="text-ink">{c.name}</span>}
        </span>
      ))}
    </nav>
  );
}
