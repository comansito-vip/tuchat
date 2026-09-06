import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { getNews } from "@/data";
import { getNewsImage } from "@/lib/news-images";

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
        <Link href={`/noticias/articulo/${featured.slug}`} className="block">
          <Card className="overflow-hidden hover:border-blue transition-colors">
            {/* La misma foto propia que abre /noticias: aquí había un bloque
                gris vacío de 16:9 con solo la categoría dentro. Lazy: está muy
                por debajo del pliegue en cualquier pantalla. */}
            <div className="relative aspect-[16/9] overflow-hidden bg-bg">
              <Image
                src={featured.image ?? getNewsImage(featured.category, featured.slug)}
                alt={featured.title}
                fill
                sizes="(max-width: 1024px) 100vw, 480px"
                className="object-cover"
              />
              <span className="absolute bottom-3 left-3 rounded-full bg-blue px-3 py-1 text-xs font-bold uppercase text-white">
                {featured.category}
              </span>
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
            href={`/noticias/articulo/${item.slug}`}
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
