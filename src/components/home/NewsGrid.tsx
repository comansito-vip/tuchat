import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { getNews } from "@/data";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "long" });
}

export function NewsGrid() {
  const news = getNews();
  const featured = news.find((n) => n.featured);
  const rest = news.filter((n) => !n.featured).slice(0, 4);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Featured story */}
      {featured && (
        <Link href="/noticias" className="block">
          <Card className="overflow-hidden hover:border-blue transition-colors">
            {/* Subtle image placeholder */}
            <div className="aspect-[16/9] bg-bg flex items-end p-4">
              <span className="text-xs font-semibold uppercase text-blue">{featured.category}</span>
            </div>
            <div className="p-5">
              <h3 className="mt-1 text-xl font-bold text-ink">{featured.title}</h3>
              <p className="mt-2 text-sm text-muted">{featured.excerpt}</p>
              <time className="mt-3 block text-xs text-muted" dateTime={featured.date}>
                {formatDate(featured.date)}
              </time>
            </div>
          </Card>
        </Link>
      )}

      {/* Rest items */}
      <div className="divide-y divide-line">
        {rest.map((item) => (
          <Link
            key={item.slug}
            href="/noticias"
            className="block py-4 first:pt-0 hover:text-blue transition-colors"
          >
            <span className="text-xs font-semibold uppercase text-blue">{item.category}</span>
            <p className="mt-0.5 font-semibold text-ink hover:text-blue">{item.title}</p>
            <time className="mt-1 block text-xs text-muted" dateTime={item.date}>
              {formatDate(item.date)}
            </time>
          </Link>
        ))}
      </div>
    </div>
  );
}
