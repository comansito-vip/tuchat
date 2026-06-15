import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSigns, getSign, type Element } from "@/data/horoscopo";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { NickInput } from "@/components/ui/NickInput";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { FAQBlock } from "@/components/room/FAQBlock";
import { breadcrumbJsonLd, faqJsonLd, JsonLd } from "@/lib/seo";

const ELEMENT_STYLE: Record<Element, string> = {
  Fuego: "from-orange-50 to-red-50 text-red-700",
  Tierra: "from-lime-50 to-emerald-50 text-emerald-700",
  Aire: "from-sky-50 to-cyan-50 text-sky-700",
  Agua: "from-blue-50 to-indigo-50 text-blue-700",
};

export function generateStaticParams() {
  return getSigns().map((s) => ({ signo: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ signo: string }>;
}): Promise<Metadata> {
  const { signo } = await params;
  const sign = getSign(signo);
  if (!sign) return {};
  return {
    title: `Horóscopo ${sign.name}: amor, trabajo y salud`,
    description: `Horóscopo de ${sign.name} (${sign.dates}). Predicciones de amor, trabajo y salud, personalidad, compatibilidad y rasgos del signo.`,
    alternates: { canonical: `/horoscopo/${sign.slug}` },
  };
}

export default async function HoroscopoSignoPage({
  params,
}: {
  params: Promise<{ signo: string }>;
}) {
  const { signo } = await params;
  const sign = getSign(signo);
  if (!sign) notFound();

  const crumbs = [
    { name: "Inicio", url: "/" },
    { name: "Horóscopo", url: "/horoscopo" },
    { name: sign.name, url: `/horoscopo/${sign.slug}` },
  ];

  const compatibles = sign.compatible
    .map((s) => getSign(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const faq = [
    {
      q: `¿Cuáles son las fechas de ${sign.name}?`,
      a: `${sign.name} comprende a las personas nacidas entre el ${sign.dates}. Es un signo de ${sign.element.toLowerCase()} regido por ${sign.planet}.`,
    },
    {
      q: `¿Con qué signos es compatible ${sign.name}?`,
      a: `${sign.name} conecta especialmente bien con ${compatibles.map((c) => c.name).join(", ")}, por afinidad de elemento y energía.`,
    },
    {
      q: `¿Cómo es la personalidad de ${sign.name}?`,
      a: sign.personality,
    },
    {
      q: `¿Dónde puedo hablar de horóscopo y signos?`,
      a: `En el chat de Horóscopo y Tarot de TuChat puedes comentar tu signo, tu carta astral y tus predicciones con otras personas en tiempo real.`,
    },
  ];

  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={faqJsonLd(faq)} />
      <Breadcrumbs crumbs={crumbs} />

      <section
        className={`mt-4 rounded-2xl bg-gradient-to-br ${ELEMENT_STYLE[sign.element]} p-6 sm:p-8`}
      >
        <div className="flex items-center gap-4">
          <span className="text-5xl" aria-hidden>
            {sign.symbol}
          </span>
          <div>
            <h1 className="text-3xl font-extrabold text-ink">Horóscopo de {sign.name}</h1>
            <p className="text-sm font-semibold">
              {sign.dates} · {sign.element} · {sign.planet}
            </p>
          </div>
        </div>
        <p className="mt-4 max-w-2xl text-ink/80">{sign.intro}</p>
      </section>

      {/* Ficha */}
      <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Fechas", sign.dates],
          ["Elemento", sign.element],
          ["Planeta", sign.planet],
          ["Modalidad", sign.quality],
        ].map(([k, v]) => (
          <Card key={k} className="p-3">
            <dt className="text-xs text-muted">{k}</dt>
            <dd className="font-semibold text-ink">{v}</dd>
          </Card>
        ))}
      </dl>

      {/* Rasgos */}
      <div className="mt-4 flex flex-wrap gap-2">
        {sign.traits.map((t) => (
          <span
            key={t}
            className="rounded-full border border-line bg-card px-3 py-1 text-sm text-blue-dark"
          >
            {t}
          </span>
        ))}
      </div>

      {/* Predicción */}
      <section className="mt-8">
        <SectionTitle>Predicción para {sign.name}</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ["❤️ Amor", sign.amor],
            ["💼 Trabajo", sign.trabajo],
            ["🌿 Salud", sign.salud],
          ].map(([title, body]) => (
            <Card key={title} className="p-4">
              <h3 className="font-bold text-ink">{title}</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">{body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Personalidad */}
      <section className="mt-8">
        <h2 className="mb-3 text-lg font-bold text-ink">Cómo es {sign.name}</h2>
        <p className="max-w-3xl text-muted leading-relaxed">{sign.personality}</p>
      </section>

      {/* Compatibilidad */}
      <section className="mt-8">
        <SectionTitle>Compatibilidad de {sign.name}</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {compatibles.map((c) => (
            <Link
              key={c.slug}
              href={`/horoscopo/${c.slug}`}
              className="rounded-full border border-line bg-card px-3 py-1.5 text-sm text-blue-dark hover:border-blue"
            >
              {c.symbol} {c.name}
            </Link>
          ))}
        </div>
      </section>

      {/* CTA chat */}
      <section className="mt-8">
        <Card className="p-5">
          <p className="mb-3 text-sm font-semibold text-ink">
            ¿Quieres hablar de tu signo con más gente? Entra en el chat de Horóscopo y Tarot.
          </p>
          <NickInput canal="horoscopo" placeholder={`Tu nick para el chat de ${sign.name}...`} />
        </Card>
      </section>

      {/* Todos los signos */}
      <section className="mt-8">
        <SectionTitle href="/horoscopo" cta="Ver todos">
          Otros signos del zodiaco
        </SectionTitle>
        <div className="flex flex-wrap gap-2">
          {getSigns()
            .filter((s) => s.slug !== sign.slug)
            .map((s) => (
              <Link
                key={s.slug}
                href={`/horoscopo/${s.slug}`}
                className="rounded-lg border border-line bg-card px-3 py-1.5 text-sm text-muted hover:text-ink hover:border-blue"
              >
                {s.symbol} {s.name}
              </Link>
            ))}
        </div>
      </section>

      <FAQBlock items={faq} />
    </main>
  );
}
