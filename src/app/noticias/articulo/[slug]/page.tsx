import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { getNews } from "@/data";
import { articleJsonLd, JsonLd } from "@/lib/seo";
import { slugify } from "@/lib/slug";

function getArticle(slug: string) {
  return getNews().find((n) => n.slug === slug);
}

export function generateStaticParams() {
  return getNews().map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  return {
    title: a.title,
    description: a.excerpt,
    alternates: { canonical: `/noticias/articulo/${a.slug}` },
    openGraph: { type: "article", publishedTime: a.date },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function ArticuloPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();

  const categoria = slugify(a.category);
  const related = getNews()
    .filter((n) => n.slug !== a.slug && n.category === a.category)
    .slice(0, 4);
  const paragraphs = a.body ? a.body.split(/\n\n+/) : [a.excerpt];

  const crumbs = [
    { name: "Inicio", url: "/" },
    { name: "Noticias", url: "/noticias" },
    { name: a.category, url: `/noticias/${categoria}` },
    { name: a.title, url: `/noticias/articulo/${a.slug}` },
  ];

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <Breadcrumbs crumbs={crumbs} />
      <JsonLd
        data={articleJsonLd({
          title: a.title,
          description: a.excerpt,
          date: a.date,
          category: a.category,
          slug: a.slug,
        })}
      />

      <article className="mt-4">
        <Link
          href={`/noticias/${categoria}`}
          className="text-xs font-semibold uppercase text-blue hover:underline"
        >
          {a.category}
        </Link>
        <h1 className="mt-1 text-3xl font-extrabold leading-tight text-ink">{a.title}</h1>
        <time className="mt-2 block text-sm text-muted" dateTime={a.date}>
          {formatDate(a.date)}
        </time>
        <div className="prose mt-5 space-y-4 text-ink">
          {paragraphs.map((p, i) => (
            <p key={i} className={i === 0 ? "text-lg text-muted" : "text-muted"}>
              {p}
            </p>
          ))}
        </div>
      </article>

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-3 text-lg font-bold text-ink">Más de {a.category}</h2>
          <ul className="divide-y divide-line">
            {related.map((n) => (
              <li key={n.slug} className="py-3">
                <Link
                  href={`/noticias/articulo/${n.slug}`}
                  className="font-medium text-ink hover:text-blue"
                >
                  {n.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
