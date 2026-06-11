import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { NewsGrid } from "@/components/home/NewsGrid";
import { collectionJsonLd, JsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Noticias",
  description:
    "Las últimas noticias en español: actualidad, deportes, tecnología, cultura, viajes, salud y economía.",
  alternates: { canonical: "/noticias" },
};

const crumbs = [
  { name: "Inicio", url: "/" },
  { name: "Noticias", url: "/noticias" },
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

export default function NoticiasPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <Breadcrumbs crumbs={crumbs} />
      <JsonLd data={collectionJsonLd("Noticias", "/noticias")} />
      <h1 className="mt-4 text-3xl font-extrabold text-ink">Noticias y actualidad</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Mantente informado con las noticias más relevantes en español, seleccionadas por nuestra
        comunidad.
      </p>

      <div className="mt-6">
        <NewsGrid />
      </div>

      <nav aria-label="Categorías de noticias" className="mt-8">
        <h2 className="mb-3 text-lg font-bold text-ink">Explorar por categoría</h2>
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
    </main>
  );
}
