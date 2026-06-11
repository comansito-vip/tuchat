import type { Metadata } from "next";
import { ScaffoldPage } from "@/components/layout/ScaffoldPage";
import { cap } from "@/lib/slug";

const SIGN_INTROS: Record<string, string> = {
  aries:
    "Aries, el primer signo del zodiaco, inicia hoy con la energía y el ímpetu que le caracterizan. Descubre qué te deparan los astros en amor, trabajo y salud.",
  tauro:
    "Tauro, signo de tierra y sensatez, afronta el día con su acostumbrada determinación. Los astros tienen mensajes importantes para ti en todas las áreas de tu vida.",
  geminis:
    "Géminis, signo dual y comunicativo, despliega hoy toda su versatilidad. Conoce lo que el horóscopo tiene reservado para tu signo en amor, trabajo y bienestar.",
  cancer:
    "Cáncer, el signo más intuitivo del zodiaco, navega hoy entre sus emociones con sabiduría. Los astros iluminan tu camino en el amor, la familia y los negocios.",
  leo:
    "Leo, signo de fuego y liderazgo, brilla con fuerza hoy. Descubre cómo aprovechar la energía astral para destacar en el amor, el trabajo y la vida social.",
  virgo:
    "Virgo, meticuloso y analítico, afronta el día con precisión. El horóscopo de hoy te guía en decisiones de salud, trabajo y relaciones personales.",
  libra:
    "Libra, signo del equilibrio y la armonía, busca hoy la balanza perfecta en todas sus facetas. Los planetas te acompañan en amor, trabajo y convivencia.",
  escorpio:
    "Escorpio, profundo e intenso, transforma hoy sus energías en acción. Descubre los mensajes del horóscopo para el amor, las finanzas y tu mundo interior.",
  sagitario:
    "Sagitario, aventurero y optimista, mira hoy al horizonte con esperanza. Los astros señalan nuevas oportunidades en viajes, estudios y relaciones.",
  capricornio:
    "Capricornio, disciplinado y ambicioso, construye hoy su camino con pasos firmes. El horóscopo te orienta en trabajo, dinero y relaciones duraderas.",
  acuario:
    "Acuario, visionario e independiente, rompe hoy con lo establecido. Conoce cómo los astros influyen en tu creatividad, tus amistades y tus proyectos.",
  piscis:
    "Piscis, soñador y empático, navega hoy por sus aguas más profundas. El horóscopo revela lo que los planetas tienen preparado para tu intuición y tu corazón.",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ signo: string }>;
}): Promise<Metadata> {
  const { signo } = await params;
  const nombre = cap(signo);
  return {
    title: `Horóscopo de hoy: ${nombre}`,
    description: `Predicciones del horóscopo de hoy para ${nombre}. Amor, trabajo, salud y consejos para este día.`,
    alternates: { canonical: `/horoscopo/${signo}` },
  };
}

export default async function HoroscopoSignoPage({
  params,
}: {
  params: Promise<{ signo: string }>;
}) {
  const { signo } = await params;
  const nombre = cap(signo);
  const intro =
    SIGN_INTROS[signo.toLowerCase()] ??
    `Descubre las predicciones del horóscopo de hoy para ${nombre}. Amor, trabajo, salud y consejos para aprovechar al máximo este día según los astros.`;

  const crumbs = [
    { name: "Inicio", url: "/" },
    { name: "Horóscopo", url: "/horoscopo/aries" },
    { name: nombre, url: `/horoscopo/${signo}` },
  ];

  return (
    <ScaffoldPage
      title={`Horóscopo de ${nombre}`}
      crumbs={crumbs}
      intro={intro}
    />
  );
}
