/**
 * Resultados reales de loterías españolas (/loterias/espana), leídos del
 * endpoint interno que usa la propia loteriasyapuestas.es para pintar sus
 * páginas de resultados. No es una API pública documentada, pero es la
 * fuente oficial (SELAE) y es gratis y sin key — el mismo enfoque que ya
 * corre en producción en un proyecto hermano (Chatcamara), portado de
 * `lib/providers/lottery/loteriasyapuestas.ts` allí.
 *
 * El endpoint exige cabeceras de navegador real (sin ellas responde
 * 403/406 vía Akamai). No cubre Lotería Nacional ni ONCE Cupón — esos
 * quedan sin resultado real y la página cae al placeholder de siempre.
 */

export interface LotteryDraw {
  slug: string;
  name: string;
  date: string;
  numbers: number[];
  complementary?: number;
  reintegro?: number;
  stars?: number[];
  jackpot?: string;
}

interface GameSpec {
  slug: string;
  name: string;
  apiId: string; // game_id que espera buscadorSorteos
}

// Nombres alineados con LOTERIA_INFO.espana en loterias/[pais]/page.tsx (el
// lookup de resultados por lotería se hace por nombre exacto). Lotería
// Nacional y ONCE no están en la lista: el endpoint no las soporta.
const GAMES: GameSpec[] = [
  { slug: "primitiva", name: "Primitiva", apiId: "LAPR" },
  { slug: "bonoloto", name: "Bonoloto", apiId: "BONO" },
  { slug: "gordo", name: "El Gordo de la Primitiva", apiId: "ELGR" },
  { slug: "euromillones", name: "Euromillones", apiId: "EMIL" },
  { slug: "eurodreams", name: "EuroDreams", apiId: "EDMS" },
];

const FETCH_HEADERS = {
  Accept: "*/*",
  "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Referer: "https://www.loteriasyapuestas.es/",
  "Sec-Fetch-Dest": "empty",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Site": "same-origin",
};

// Cada regeneración de /loterias/espana dispara GAMES.length peticiones al
// endpoint oficial. 6h de revalidate = 4 regens/día, tráfico modesto y
// respetuoso con un servicio sin key ni cuota pactada.
export const LOTTERY_REVALIDATE_SECONDS = 21600;

function ymd(date: Date): string {
  return date.toISOString().slice(0, 10).replace(/-/g, "");
}

// "12 - 17 - 20 - 24 - 27 - 34 C(41) R(0)" → numbers=[12,17,20,24,27,34], complementary=41, reintegro=0
// " 02 - 14 - 28 - 33 - 48 - 08 - 10"        → euromillones: últimos 2 son las estrellas
function parseCombinacion(
  combinacion: string,
  game: GameSpec,
): { numbers: number[]; complementary?: number; reintegro?: number; stars?: number[] } {
  const compMatch = combinacion.match(/\bC\((\d+)\)/i);
  const reintMatch = combinacion.match(/\bR\((\d+)\)/i);
  const clean = combinacion.replace(/\s+[CR]\(\d+\)/gi, "").trim();
  const numbers = clean
    .split(" - ")
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => !isNaN(n) && n > 0);

  if (game.slug === "euromillones" && numbers.length === 7) {
    const stars = numbers.splice(5);
    return { numbers, stars };
  }
  return {
    numbers,
    complementary: compMatch ? parseInt(compMatch[1], 10) : undefined,
    reintegro: reintMatch ? parseInt(reintMatch[1], 10) : undefined,
  };
}

async function fetchDraw(game: GameSpec): Promise<LotteryDraw | null> {
  const today = new Date();
  const weekAgo = new Date(today.getTime() - 7 * 86400000);
  const url =
    `https://www.loteriasyapuestas.es/servicios/buscadorSorteos` +
    `?game_id=${game.apiId}&fechaInicioInclusiva=${ymd(weekAgo)}&fechaFinInclusiva=${ymd(today)}&num_sorteos=1`;

  try {
    const res = await fetch(url, {
      headers: FETCH_HEADERS,
      next: { revalidate: LOTTERY_REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return null;

    const data = (await res.json()) as Record<string, unknown>[];
    if (!Array.isArray(data) || data.length === 0) return null;

    // El primer elemento puede ser el sorteo de hoy aún sin celebrar
    // (combinacion = null); nos quedamos con el más reciente ya celebrado.
    const draw = data.find((d) => d.combinacion != null && String(d.combinacion).trim() !== "");
    if (!draw) return null;

    const { numbers, complementary, reintegro, stars } = parseCombinacion(
      String(draw.combinacion),
      game,
    );
    if (numbers.length === 0) return null;

    const date = String(draw.fecha_sorteo ?? "").split(" ")[0];
    const boteEuros = parseFloat(String(draw.premio_bote ?? ""));
    const jackpot =
      !isNaN(boteEuros) && boteEuros > 0
        ? `${(boteEuros / 1_000_000).toLocaleString("es-ES", { maximumFractionDigits: 1 })}M €`
        : undefined;

    return { slug: game.slug, name: game.name, date, numbers, complementary, reintegro, stars, jackpot };
  } catch {
    return null;
  }
}

// Devuelve solo los juegos con dato real disponible; nunca lanza. La página
// de España debe seguir mostrando el resto en modo "sin resultado" cuando
// esto vuelve vacío (WAF bloqueando de nuevo, endpoint caído, etc.).
export async function getSpainLotteryResults(): Promise<LotteryDraw[]> {
  const draws = await Promise.all(GAMES.map(fetchDraw));
  return draws.filter((d): d is LotteryDraw => d !== null);
}
