import type { Metadata } from "next";
import Link from "next/link";
import { getTopicCatalog } from "@/lib/topic-groups";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FAQBlock } from "@/components/room/FAQBlock";
import { SectionTitle } from "@/components/ui/SectionTitle";
import {
  breadcrumbJsonLd,
  collectionJsonLd,
  faqJsonLd,
  itemListJsonLd,
  JsonLd,
  OG_BASE,
} from "@/lib/seo";

// Estática, como /chat: el catálogo de temáticas solo cambia con el goteo
// diario y el build lo recoge.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Salas de chat temáticas: fútbol, salud, hobbies y más",
  description:
    "Todas las salas de chat por temática, agrupadas por categoría: equipos de fútbol, salud, hobbies, religión, edades y decenas de aficiones más. Gratis y sin registro.",
  alternates: { canonical: "/chat/temas" },
  openGraph: { ...OG_BASE, url: "/chat/temas" },
};

const crumbs = [
  { name: "Inicio", url: "/" },
  { name: "Chat", url: "/chat" },
  { name: "Temáticas", url: "/chat/temas" },
];

function construirFaq(total: number, categorias: number) {
  return [
    {
      q: "¿Cómo están organizadas las salas temáticas?",
      a: `Las ${total} salas de esta página se agrupan en ${categorias} categorías según de qué se habla: los equipos de fútbol cuelgan de Fútbol, las salas de bienestar de Salud, las de aficiones de Hobbies, y las salas por edades tienen su propio bloque. Cada categoría con sala propia enlaza también a su chat general.`,
    },
    {
      q: "¿En qué se diferencian de las salas por país o ciudad?",
      a: "En una sala temática la conversación gira en torno a un interés común, venga cada uno de donde venga. En las salas de país o ciudad, la gente comparte lugar. Muchas temáticas pequeñas comparten canal con su categoría para no repartir a cuatro personas entre cuatro salas vacías.",
    },
    {
      q: "¿Puedo entrar sin registrarme?",
      a: "Sí. Igual que en el resto de TuChat: se elige la sala, se escribe un nick de invitado y se entra. Sin correo, sin contraseña y sin instalar nada, desde el móvil o el ordenador.",
    },
  ];
}

export default async function TemasPage() {
  const { primaryTopics, groups, totalEnGrupos } = await getTopicCatalog();
  const FAQ = construirFaq(totalEnGrupos, groups.length);
  const hubs = groups.filter((g) => g.slug);

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <JsonLd data={collectionJsonLd("Salas de chat temáticas", "/chat/temas")} />
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={faqJsonLd(FAQ)} />
      <JsonLd
        data={itemListJsonLd(hubs.map((g) => ({ url: `/chat/${g.slug}`, name: `Chat ${g.name}` })))}
      />
      <Breadcrumbs crumbs={crumbs} />
      <h1 className="mt-4 text-3xl font-extrabold text-ink">Salas de chat por temática</h1>
      <p className="mt-2 max-w-2xl text-muted">
        {totalEnGrupos} salas repartidas en {groups.length} categorías, además de las{" "}
        {primaryTopics.length} temáticas principales. Cada bloque se abre y se cierra; los
        primeros vienen abiertos porque son los que más gente tienen.
      </p>

      {/* Principales: las mismas tarjetas de /chat, aquí como fila de chips
          para que esta página sea el catálogo completo y no solo "el resto". */}
      <section className="mt-8">
        <SectionTitle>Temáticas principales</SectionTitle>
        <div className="mt-4 flex flex-wrap gap-2">
          {primaryTopics.map((p) => (
            <Link
              key={p.slug}
              href={`/chat/${p.slug}`}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-line bg-card px-3 py-2 text-sm font-medium text-ink transition-colors hover:border-blue hover:text-blue"
            >
              <span aria-hidden="true">{p.icon}</span>
              {p.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Todas las demás, agrupadas por categoría (fútbol, salud, hobbies...) */}
      <section className="mt-10">
        <SectionTitle>Todas las categorías</SectionTitle>
        <div className="mt-4 space-y-3">
          {groups.map((g, i) => (
            <details
              key={g.anchor}
              id={g.anchor}
              // Los 6 primeros (los de más gente conectada) abiertos: con todos
              // colapsados, llegar a una sala costaba un clic de más y en móvil
              // obligaba a re-scrollear tras cada despliegue.
              open={i < 6}
              className="group scroll-mt-20 rounded-xl border border-line bg-card"
            >
              <summary className="flex min-h-[48px] cursor-pointer items-center justify-between gap-3 px-5 py-3 font-semibold text-ink hover:text-blue">
                <h3 className="text-base font-semibold">
                  {g.name}
                  <span className="ml-2 font-normal text-muted">· {g.items.length}</span>
                </h3>
                <span className="text-muted transition-transform group-open:rotate-180" aria-hidden="true">▼</span>
              </summary>
              <div className="flex flex-wrap gap-2 px-4 pb-4 pt-2">
                {/* El enlace al hub sale del <summary>: dentro, tocar el nombre
                    navegaba y tocar 3px al lado desplegaba — ambiguo en táctil. */}
                {g.slug && (
                  <Link
                    href={`/chat/${g.slug}`}
                    className="inline-flex min-h-[40px] items-center rounded-full bg-blue/10 px-3 py-2 text-sm font-semibold text-blue transition-colors hover:bg-blue/20"
                  >
                    Ver {g.name} →
                  </Link>
                )}
                {g.items.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/chat/${p.slug}`}
                    className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-line bg-bg px-3 py-2 text-sm text-ink transition-colors hover:border-blue hover:text-blue"
                  >
                    <span aria-hidden="true">{p.icon}</span>
                    {p.name}
                  </Link>
                ))}
              </div>
            </details>
          ))}
        </div>
      </section>

      <div className="mt-12">
        <FAQBlock items={FAQ} />
      </div>
    </main>
  );
}
