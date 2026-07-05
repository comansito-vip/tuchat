export interface AnimeSerie {
  name: string;
  /** Título original en japonés, usado como elemento gráfico del póster. */
  jp: string;
  emoji: string;
  blurb: string;
  /** Slug de la sala de chat asociada, si existe (enlace desde la guía). */
  slug?: string;
  /** Par de colores del degradado del póster (CSS, sin imágenes externas). */
  c1: string;
  c2: string;
}

// Pósters generados con CSS: degradado temático + título japonés + emoji.
// Sin imágenes externas (evita hotlink, copyright y 404). La paleta de cada
// serie evoca su identidad visual.
export const ANIME_SERIES: AnimeSerie[] = [
  {
    name: "Naruto",
    jp: "ナルト",
    emoji: "🍥",
    blurb: "La historia del ninja que nunca se rinde. Naruto Uzumaki y su camino hacia convertirse en Hokage con el poder del Zorro de las Nueve Colas (Kurama).",
    slug: "naruto",
    c1: "#f97316",
    c2: "#9a3412",
  },
  {
    name: "Dragon Ball Z",
    jp: "ドラゴンボール",
    emoji: "🐉",
    blurb: "Goku, los Saiyajin y las esferas del dragón. La serie que definió el anime de los 90 y sigue siendo el referente absoluto de peleas y transformaciones imposibles.",
    slug: "dragon-ball",
    c1: "#f59e0b",
    c2: "#c2410c",
  },
  {
    name: "One Piece",
    jp: "ワンピース",
    emoji: "⚓",
    blurb: "Monkey D. Luffy y los Piratas del Sombrero de Paja en busca del tesoro definitivo. La serie más larga del manga moderno y una de las más queridas de siempre.",
    slug: "one-piece",
    c1: "#dc2626",
    c2: "#1e3a8a",
  },
  {
    name: "Demon Slayer",
    jp: "鬼滅の刃",
    emoji: "⚔️",
    blurb: "Tanjiro Kamado, su hermana demonio y el Cuerpo de Cazadores de Demonios. La animación de ufotable redefinió los estándares visuales del anime contemporáneo.",
    slug: "kimetsu-no-yaiba",
    c1: "#047857",
    c2: "#111827",
  },
  {
    name: "Jujutsu Kaisen",
    jp: "呪術廻戦",
    emoji: "🔮",
    blurb: "Yuji Itadori se traga un dedo de Ryomen Sukuna y desencadena una guerra entre hechiceros y maldiciones. Acción brutal y animación de primer nivel.",
    slug: "jujutsu-kaisen",
    c1: "#6d28d9",
    c2: "#18181b",
  },
  {
    name: "Attack on Titan",
    jp: "進撃の巨人",
    emoji: "🏰",
    blurb: "La humanidad encerrada tras murallas gigantescas, acosada por titanes devoradores. Shingeki no Kyojin llevó el anime a nuevas cotas narrativas.",
    c1: "#57534e",
    c2: "#14532d",
  },
  {
    name: "Fullmetal Alchemist: Brotherhood",
    jp: "鋼の錬金術師",
    emoji: "⚗️",
    blurb: "Edward y Alphonse Elric buscan la Piedra Filosofal para recuperar sus cuerpos. Para muchos, la serie de anime mejor escrita de la historia.",
    c1: "#b91c1c",
    c2: "#44403c",
  },
  {
    name: "My Hero Academia",
    jp: "僕のヒーローアカデミア",
    emoji: "💪",
    blurb: "Izuku Midoriya, el único humano sin poderes en un mundo de héroes con Quirks. Una oda al esfuerzo con el universo de héroes más elaborado del anime moderno.",
    c1: "#059669",
    c2: "#b91c1c",
  },
  {
    name: "Chainsaw Man",
    jp: "チェンソーマン",
    emoji: "🪚",
    blurb: "Denji se fusiona con su perro-diablo Pochita para convertirse en el Hombre Motosierra. El manga más vendido de 2022, tan violento como emotivo.",
    c1: "#ea580c",
    c2: "#7f1d1d",
  },
  {
    name: "Hunter × Hunter",
    jp: "ハンター×ハンター",
    emoji: "🎯",
    blurb: "Gon Freecss busca a su padre convirtiéndose en Hunter. Una obra maestra de arcos en constante reinvención, con el sistema Nen entre los más profundos del manga.",
    c1: "#15803d",
    c2: "#064e3b",
  },
];

const BY_SLUG: Record<string, AnimeSerie> = Object.fromEntries(
  ANIME_SERIES.filter((s) => s.slug).map((s) => [s.slug as string, s]),
);

/** Devuelve la serie de anime asociada a una sala, si la hay. */
export function getAnimeBySlug(slug: string): AnimeSerie | undefined {
  return BY_SLUG[slug];
}
