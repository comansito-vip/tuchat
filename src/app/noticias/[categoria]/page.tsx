import type { Metadata } from "next";
import Link from "next/link";
import { getNews } from "@/data";
import { ScaffoldPage } from "@/components/layout/ScaffoldPage";
import { slugify, cap } from "@/lib/slug";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoria: string }>;
}): Promise<Metadata> {
  const { categoria } = await params;
  const title = `Noticias de ${cap(categoria)}`;
  return {
    title,
    description: `Las últimas noticias de ${cap(categoria)} en español. Mantente informado con TuChat.`,
    alternates: { canonical: `/noticias/${categoria}` },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "long" });
}

export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ categoria: string }>;
}) {
  const { categoria } = await params;
  const nombre = cap(categoria);

  const crumbs = [
    { name: "Inicio", url: "/" },
    { name: "Noticias", url: "/noticias" },
    { name: nombre, url: `/noticias/${categoria}` },
  ];

  const allNews = getNews();
  const matched = allNews.filter(
    (n) => slugify(n.category) === categoria
  );

  const children =
    matched.length > 0 ? (
      <ul className="mt-6 divide-y divide-line">
        {matched.map((item) => (
          <li key={item.slug} className="py-4">
            <Link
              href={`/noticias/${item.slug}`}
              className="block hover:text-blue transition-colors"
            >
              <span className="text-xs font-semibold uppercase text-blue">{item.category}</span>
              <p className="mt-0.5 font-semibold text-ink">{item.title}</p>
              <p className="mt-1 text-sm text-muted">{item.excerpt}</p>
              <time className="mt-1 block text-xs text-muted" dateTime={item.date}>
                {formatDate(item.date)}
              </time>
            </Link>
          </li>
        ))}
      </ul>
    ) : undefined;

  return (
    <ScaffoldPage
      title={`Noticias de ${nombre}`}
      crumbs={crumbs}
      intro={`Todas las noticias de ${nombre} en español. Aquí encontrarás los artículos más recientes sobre ${nombre.toLowerCase()} seleccionados por la comunidad de TuChat.`}
    >
      {children}
    </ScaffoldPage>
  );
}
