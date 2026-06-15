import type { Metadata } from "next";
import Link from "next/link";
import { getNews } from "@/data";
import { ScaffoldPage } from "@/components/layout/ScaffoldPage";
import { NickInput } from "@/components/ui/NickInput";
import { slugify, cap } from "@/lib/slug";
import { breadcrumbJsonLd, collectionJsonLd, articleListJsonLd, JsonLd } from "@/lib/seo";

const CATEGORY_CANAL: Record<string, string> = {
  deportes: "deportes",
  tecnologia: "tecnologia",
  ia: "tecnologia",
  cultura: "musica",
  entretenimiento: "musica",
  viajes: "viajes",
  salud: "salud",
  economia: "bolsa",
  actualidad: "espana",
};

const CATEGORY_DESC: Record<string, string> = {
  actualidad: "Noticias de actualidad en español: política, sociedad y sucesos del mundo hispanohablante. Comenta las noticias con la comunidad de TuChat.",
  deportes: "Últimas noticias de deportes en español: fútbol, baloncesto, tenis y más. Sigue la actualidad deportiva y debate los resultados en el chat.",
  tecnologia: "Noticias de tecnología en español: novedades de móviles, apps, internet y gadgets. Todo lo que necesitas saber sobre el mundo tech al día.",
  ia: "Noticias sobre inteligencia artificial en español: ChatGPT, modelos de lenguaje, automatización y el impacto de la IA en el trabajo y la sociedad.",
  cultura: "Noticias de cultura en español: cine, música, literatura, arte y patrimonio. Descubre lo más destacado del panorama cultural hispanohablante.",
  viajes: "Noticias y artículos de viajes en español: destinos, consejos, rutas y experiencias para planificar tus próximas vacaciones.",
  salud: "Noticias de salud en español: investigación médica, bienestar, nutrición y consejos para cuidar tu salud con información rigurosa.",
  economia: "Noticias de economía en español: mercados, inflación, empleo y finanzas personales. Entiende la actualidad económica con TuChat.",
  entretenimiento: "Noticias de entretenimiento en español: series, películas, música y celebrities. Lo más viral de la cultura pop hispanohablante.",
};

export function generateStaticParams() {
  const categorias = new Set(getNews().map((n) => slugify(n.category)));
  return [...categorias].map((categoria) => ({ categoria }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoria: string }>;
}): Promise<Metadata> {
  const { categoria } = await params;
  const title = `Noticias de ${cap(categoria)}`;
  return {
    title,
    description: CATEGORY_DESC[categoria] ?? `Las últimas noticias de ${cap(categoria)} en español. Comenta la actualidad con la comunidad de TuChat.`,
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
  const matched = allNews.filter((n) => slugify(n.category) === categoria);
  const canal = CATEGORY_CANAL[categoria] ?? "espana";

  return (
    <ScaffoldPage
      title={`Noticias de ${nombre}`}
      crumbs={crumbs}
      intro={`Todas las noticias de ${nombre} en español. Aquí encontrarás los artículos más recientes sobre ${nombre.toLowerCase()} seleccionados por la comunidad de TuChat.`}
      placeholder={false}
    >
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={collectionJsonLd(`Noticias de ${nombre}`, `/noticias/${categoria}`)} />
      {matched.length > 0 && <JsonLd data={articleListJsonLd(matched)} />}

      {matched.length > 0 ? (
        <ul className="mt-6 divide-y divide-line">
          {matched.map((item) => (
            <li key={item.slug} className="py-4">
              <Link
                href={`/noticias/articulo/${item.slug}`}
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
      ) : (
        <p className="mt-6 text-muted">No hay artículos disponibles en esta categoría todavía.</p>
      )}

      <section className="mt-8 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-800 p-6 text-white">
        <p className="text-sm font-semibold opacity-80">Debate en el chat</p>
        <h2 className="mt-1 text-xl font-extrabold">¿Qué opinas sobre estas noticias?</h2>
        <p className="mt-1 text-sm opacity-80">Comenta con otros lectores en tiempo real.</p>
        <div className="mt-4">
          <NickInput canal={canal} variant="onColor" placeholder="Tu nick para entrar..." />
        </div>
      </section>
    </ScaffoldPage>
  );
}
