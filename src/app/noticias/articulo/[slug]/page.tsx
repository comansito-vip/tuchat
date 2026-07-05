import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { NickInput } from "@/components/ui/NickInput";
import { getNews } from "@/data";
import { articleJsonLd, JsonLd } from "@/lib/seo";
import { slugify } from "@/lib/slug";
import { getNewsImage } from "@/lib/news-images";

const CATEGORY_CANAL: Record<string, string> = {
  deportes: "deportes", tecnologia: "tecnologia", ia: "tecnologia",
  cultura: "musica", entretenimiento: "musica", viajes: "viajes",
  salud: "salud", economia: "bolsa", actualidad: "espana",
};

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
  const image = a.image ?? getNewsImage(a.category, a.slug);
  return {
    title: a.title,
    description: a.excerpt,
    alternates: { canonical: `/noticias/articulo/${a.slug}` },
    openGraph: {
      type: "article",
      url: `/noticias/articulo/${a.slug}`,
      publishedTime: `${a.date}T00:00:00Z`,
      images: [image],
    },
    twitter: { card: "summary_large_image", images: [image] },
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

  const canal = CATEGORY_CANAL[categoria] ?? "espana";

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
          body: a.body,
          image: a.image ?? getNewsImage(a.category, a.slug),
        })}
      />

      {/* Hero image */}
      <div className="relative mt-4 overflow-hidden rounded-2xl aspect-[21/7] bg-gradient-to-br from-blue/10 to-brand/5">
        <Image
          src={a.image ?? getNewsImage(a.category, a.slug)}
          alt={a.title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover"
        />
      </div>

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

      {/* CTA chat */}
      <section className="mt-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-800 p-6 text-white">
        <p className="text-sm font-semibold opacity-80">Debate en el chat</p>
        <h2 className="mt-1 text-xl font-extrabold">¿Qué opinas sobre esta noticia?</h2>
        <p className="mt-1 text-sm opacity-80">Comenta con otros lectores en tiempo real.</p>
        <div className="mt-4">
          <NickInput canal={canal} variant="onColor" placeholder="Tu nick para entrar..." />
        </div>
        <p className="mt-4 text-xs opacity-70">
          O ve directamente a la{" "}
          <Link href={`/chat/${canal}`} className="underline hover:opacity-90">
            sala de chat
          </Link>{" "}
          y{" "}
          <Link href={`/noticias/${categoria}`} className="underline hover:opacity-90">
            más noticias de {a.category.toLowerCase()}
          </Link>.
        </p>
      </section>

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
