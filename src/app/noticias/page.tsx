import type { Metadata } from "next";
import Link from "next/link";
import { getNews } from "@/data";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { FAQBlock } from "@/components/room/FAQBlock";
import { breadcrumbJsonLd, collectionJsonLd, faqJsonLd, articleListJsonLd, JsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Noticias en español — Actualidad, deportes, tecnología",
  description:
    "Las últimas noticias en español: actualidad, deportes, tecnología, cultura, viajes, salud y economía. Seleccionadas por la comunidad de TuChat.",
  alternates: { canonical: "/noticias" },
};

const crumbs = [
  { name: "Inicio", url: "/" },
  { name: "Noticias", url: "/noticias" },
];

const FAQ = [
  {
    q: "¿Qué tipo de noticias encuentro en TuChat?",
    a: "TuChat publica noticias de actualidad, deportes, tecnología, inteligencia artificial, cultura, viajes, salud y economía. Todo el contenido está en español y seleccionado para la comunidad hispanohablante.",
  },
  {
    q: "¿Con qué frecuencia se actualizan las noticias?",
    a: "La sección de noticias se actualiza regularmente con los artículos más relevantes de cada categoría. Puedes filtrar por categoría para ver solo los temas que más te interesan.",
  },
  {
    q: "¿Puedo comentar las noticias en el chat?",
    a: "Sí. Cada artículo incluye un acceso directo a la sala de chat relacionada con su temática para que puedas debatir la noticia con otros lectores en tiempo real.",
  },
];

const CATEGORIES = [
  { label: "Actualidad", slug: "actualidad" },
  { label: "Deportes", slug: "deportes" },
  { label: "Tecnología", slug: "tecnologia" },
  { label: "IA", slug: "ia" },
  { label: "Cultura", slug: "cultura" },
  { label: "Viajes", slug: "viajes" },
  { label: "Salud", slug: "salud" },
  { label: "Economía", slug: "economia" },
  { label: "Entretenimiento", slug: "entretenimiento" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function NoticiasPage() {
  const allNews = getNews();
  const featured = allNews.find((n) => n.featured);
  const rest = allNews.filter((n) => !n.featured);

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={collectionJsonLd("Noticias", "/noticias")} />
      <JsonLd data={faqJsonLd(FAQ)} />
      <JsonLd data={articleListJsonLd(allNews)} />
      <Breadcrumbs crumbs={crumbs} />
      <h1 className="mt-4 text-3xl font-extrabold text-ink">Noticias y actualidad</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Mantente informado con las noticias más relevantes en español, seleccionadas por nuestra
        comunidad.
      </p>

      {/* Category pills */}
      <nav aria-label="Categorías de noticias" className="mt-5">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/noticias/${cat.slug}`}
              className="rounded-full border border-line bg-card px-4 py-1.5 text-sm font-medium text-ink hover:border-blue hover:text-blue transition-colors"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Featured article */}
      {featured && (
        <div className="mt-8">
          <Link href={`/noticias/articulo/${featured.slug}`} className="block group">
            <Card className="overflow-hidden hover:border-blue transition-colors">
              <div className="aspect-[21/6] bg-gradient-to-br from-blue/10 to-brand/5 flex items-end p-5">
                <span className="rounded-full bg-blue px-3 py-1 text-xs font-bold uppercase text-white">
                  {featured.category}
                </span>
              </div>
              <div className="p-5 lg:p-6">
                <h2 className="text-2xl font-extrabold text-ink group-hover:text-blue transition-colors">
                  {featured.title}
                </h2>
                <p className="mt-2 text-muted">{featured.excerpt}</p>
                <time className="mt-3 block text-xs text-muted" dateTime={featured.date}>
                  {formatDate(featured.date)}
                </time>
              </div>
            </Card>
          </Link>
        </div>
      )}

      {/* Article list */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((item) => (
          <Link key={item.slug} href={`/noticias/articulo/${item.slug}`} className="block group">
            <Card className="h-full hover:border-blue transition-colors p-5">
              <span className="text-xs font-semibold uppercase text-blue">{item.category}</span>
              <h3 className="mt-1 font-bold text-ink group-hover:text-blue transition-colors leading-snug">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-muted line-clamp-2">{item.excerpt}</p>
              <time className="mt-3 block text-xs text-muted" dateTime={item.date}>
                {formatDate(item.date)}
              </time>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-12">
        <FAQBlock items={FAQ} />
      </div>
    </main>
  );
}
