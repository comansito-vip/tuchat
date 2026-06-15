import type { Metadata } from "next";
import Link from "next/link";
import { getNews } from "@/data";
import { ScaffoldPage } from "@/components/layout/ScaffoldPage";
import { NickInput } from "@/components/ui/NickInput";
import { FAQBlock } from "@/components/room/FAQBlock";
import { slugify, cap } from "@/lib/slug";
import { breadcrumbJsonLd, collectionJsonLd, articleListJsonLd, faqJsonLd, JsonLd } from "@/lib/seo";

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

const CATEGORY_FAQ: Record<string, { q: string; a: string }[]> = {
  actualidad: [
    { q: "¿Qué tipo de noticias de actualidad cubre TuChat?", a: "La sección de actualidad recoge política, sociedad, economía y sucesos relevantes del mundo hispanohablante: España, México, Argentina, Colombia y el resto de América Latina." },
    { q: "¿Puedo comentar las noticias de actualidad con otras personas?", a: "Sí. Cada artículo enlaza directamente a la sala de chat de TuChat relacionada con su tema. Puedes debatir la noticia con otros lectores en tiempo real, sin registro." },
  ],
  deportes: [
    { q: "¿Qué deportes cubre la sección de noticias deportivas?", a: "Cubrimos fútbol, baloncesto, tenis, atletismo y las principales competiciones: Liga española, Champions League, Copa América, Fórmula 1 y más deportes del mundo hispanohablante." },
    { q: "¿Dónde puedo comentar los resultados deportivos en tiempo real?", a: "En el chat de deportes de TuChat puedes debatir partidos, resultados y polémicas con otros aficionados en directo. También hay salas por equipo para hablar de tu club favorito." },
  ],
  tecnologia: [
    { q: "¿Qué temas cubre la sección de tecnología?", a: "Cubrimos smartphones, aplicaciones, inteligencia artificial, ciberseguridad, gadgets, videojuegos y las principales novedades del sector tecnológico en español." },
    { q: "¿Hay una sala de chat de tecnología en TuChat?", a: "Sí. En la sala de tecnología y en la de videojuegos puedes debatir las últimas noticias tech, pedir opiniones sobre dispositivos y compartir recomendaciones con la comunidad." },
  ],
  ia: [
    { q: "¿Qué noticias de inteligencia artificial puedo encontrar aquí?", a: "Cubrimos los últimos modelos de IA (ChatGPT, Gemini, Claude), sus aplicaciones en el trabajo y la vida cotidiana, regulación europea (AI Act) y el impacto de la automatización en el empleo." },
    { q: "¿Dónde puedo hablar sobre inteligencia artificial en el chat?", a: "En la sala de tecnología de TuChat hay debates frecuentes sobre IA, herramientas, prompts y el futuro del trabajo. Entra gratis sin registro y únete a la conversación." },
  ],
  cultura: [
    { q: "¿Qué contenidos culturales cubre TuChat?", a: "Cubrimos cine, música, literatura, arte, patrimonio y festivales de la cultura hispanohablante. Desde Almodóvar hasta el flamenco o el Primavera Sound, pasando por la literatura latinoamericana." },
    { q: "¿Puedo debatir sobre cultura en el chat de TuChat?", a: "Sí. Hay salas de música, cine y cultura general donde puedes recomendar películas, discutir libros, compartir playlists y conocer a gente con los mismos intereses culturales." },
  ],
  viajes: [
    { q: "¿Qué tipo de contenido de viajes publica TuChat?", a: "Artículos sobre destinos españoles y latinoamericanos, rutas de senderismo, turismo rural, enoturismo y consejos prácticos para viajar por el mundo hispanohablante con presupuesto ajustado." },
    { q: "¿Hay una sala de chat de viajes donde pedir recomendaciones?", a: "Sí. En la sala de viajes de TuChat puedes preguntar sobre destinos, compartir experiencias y obtener recomendaciones de primera mano de gente que ya ha visitado el lugar que te interesa." },
  ],
  salud: [
    { q: "¿Qué información de salud publica TuChat?", a: "Publicamos noticias de investigación médica, salud mental, nutrición, bienestar y hábitos saludables, siempre con información rigurosa y contrastada de fuentes científicas y sanitarias." },
    { q: "¿Hay una sala de chat de salud y bienestar en TuChat?", a: "Sí. En la sala de salud puedes compartir experiencias, preguntar dudas y apoyar a otros usuarios que buscan información sobre bienestar, dieta y salud mental en un entorno respetuoso." },
  ],
  economia: [
    { q: "¿Qué noticias económicas cubre TuChat?", a: "Cubrimos inflación, mercados financieros, empleo, finanzas personales y la evolución de las economías de España y Latinoamérica, con foco en el impacto cotidiano para el ciudadano." },
    { q: "¿Dónde puedo comentar las noticias de economía?", a: "En la sala de bolsa y economía de TuChat puedes debatir mercados, noticias económicas y compartir estrategias de ahorro e inversión con otros usuarios interesados en el tema." },
  ],
  entretenimiento: [
    { q: "¿Qué contenido de entretenimiento cubre TuChat?", a: "Series, películas, realities, celebrities, música pop y todo lo viral de la cultura de masas hispanohablante. Desde Gran Hermano hasta Netflix, passando por Luis Miguel o Rosalía." },
    { q: "¿Hay una sala de entretenimiento en TuChat?", a: "Sí. En las salas de música y series puedes hablar de tus programas favoritos, debatir estrenos y compartir recomendaciones con una comunidad activa de aficionados al entretenimiento." },
  ],
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
    openGraph: { url: `/noticias/${categoria}` },
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
  const faq = CATEGORY_FAQ[categoria] ?? [
    { q: `¿Qué noticias de ${nombre} puedo encontrar en TuChat?`, a: `La sección de ${nombre} recoge los artículos más relevantes en español, seleccionados por la comunidad de TuChat. Se actualiza regularmente con contenido nuevo.` },
    { q: `¿Puedo comentar las noticias de ${nombre}?`, a: `Sí. TuChat tiene salas de chat donde puedes debatir las noticias con otros lectores en tiempo real. El acceso es gratuito y sin registro.` },
  ];

  return (
    <ScaffoldPage
      title={`Noticias de ${nombre}`}
      crumbs={crumbs}
      intro={`Todas las noticias de ${nombre} en español. Aquí encontrarás los artículos más recientes sobre ${nombre.toLowerCase()} seleccionados por la comunidad de TuChat.`}
      placeholder={false}
    >
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={collectionJsonLd(`Noticias de ${nombre}`, `/noticias/${categoria}`)} />
      <JsonLd data={faqJsonLd(faq)} />
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

      <FAQBlock items={faq} />
    </ScaffoldPage>
  );
}
