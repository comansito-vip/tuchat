/**
 * Clasificaciones deportivas con varios proveedores y fallback en cadena
 * (Fase 3 del brief: resultados/clasificaciones). Si un proveedor falla o no
 * tiene clave, prueba el siguiente; si todos fallan, datos estáticos de reserva.
 *
 * Orden de preferencia:
 *   1. football-data.org   (env FOOTBALL_DATA_TOKEN)   — ligas europeas top
 *   2. API-Football        (env API_FOOTBALL_KEY)      — cobertura mundial
 *   3. TheSportsDB         (gratis, clave por defecto "3") — red de seguridad
 *   4. Tabla estática de reserva
 */

export interface Standing {
  rank: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  points: number;
}

export interface StandingsResult {
  source: string;
  season: string;
  rows: Standing[];
}

interface League {
  slug: string;
  name: string;
  footballData?: string; // código de competición
  apiFootball?: number; // id de liga
  theSportsDB: number; // id de liga
  fallback: Standing[];
}

const SEASON_YEAR = "2025"; // configurable: temporada 2025-2026
const SEASON_SDB = "2025-2026";

function fb(rows: [string, number][]): Standing[] {
  // Tabla de reserva mínima: posición + equipo + puntos (resto a 0, se rellena
  // con datos reales en cuanto responde un proveedor).
  return rows.map(([team, points], i) => ({
    rank: i + 1,
    team,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    points,
  }));
}

export const LEAGUES: League[] = [
  {
    slug: "laliga",
    name: "LaLiga",
    footballData: "PD",
    apiFootball: 140,
    theSportsDB: 4335,
    fallback: fb([
      ["Real Madrid", 87],
      ["FC Barcelona", 82],
      ["Atlético de Madrid", 74],
      ["Athletic Club", 66],
      ["Real Sociedad", 63],
      ["Real Betis", 58],
    ]),
  },
  {
    slug: "premier",
    name: "Premier League",
    footballData: "PL",
    apiFootball: 39,
    theSportsDB: 4328,
    fallback: fb([
      ["Liverpool", 84],
      ["Arsenal", 79],
      ["Manchester City", 74],
      ["Chelsea", 70],
    ]),
  },
  {
    slug: "seriea",
    name: "Serie A",
    footballData: "SA",
    apiFootball: 135,
    theSportsDB: 4332,
    fallback: fb([
      ["Inter", 88],
      ["Napoli", 79],
      ["Milan", 72],
      ["Juventus", 68],
    ]),
  },
  {
    slug: "ligamx",
    name: "Liga MX",
    apiFootball: 262,
    theSportsDB: 4350,
    fallback: fb([
      ["América", 35],
      ["Monterrey", 33],
      ["Guadalajara", 31],
      ["Tigres", 28],
    ]),
  },
  {
    slug: "bundesliga",
    name: "Bundesliga",
    footballData: "BL1",
    apiFootball: 78,
    theSportsDB: 4331,
    fallback: fb([
      ["Bayern München", 76],
      ["Bayer Leverkusen", 72],
      ["Borussia Dortmund", 65],
      ["VfB Stuttgart", 61],
    ]),
  },
  {
    slug: "ligue1",
    name: "Ligue 1",
    footballData: "FL1",
    apiFootball: 61,
    theSportsDB: 4334,
    fallback: fb([
      ["Paris Saint-Germain", 83],
      ["Mónaco", 74],
      ["Marsella", 68],
      ["Lille", 64],
    ]),
  },
  {
    slug: "argentina",
    name: "Liga Profesional Argentina",
    apiFootball: 128,
    theSportsDB: 4406,
    fallback: fb([
      ["River Plate", 42],
      ["Boca Juniors", 39],
      ["Racing Club", 37],
      ["Independiente", 33],
    ]),
  },
  {
    slug: "brasileirao",
    name: "Brasileirão",
    apiFootball: 71,
    theSportsDB: 4351,
    fallback: fb([
      ["Palmeiras", 71],
      ["Flamengo", 68],
      ["Botafogo", 64],
      ["São Paulo", 59],
    ]),
  },
  {
    slug: "mls",
    name: "MLS",
    apiFootball: 253,
    theSportsDB: 4346,
    fallback: fb([
      ["Inter Miami CF", 74],
      ["Columbus Crew", 65],
      ["FC Cincinnati", 64],
      ["Los Angeles FC", 63],
      ["Seattle Sounders", 60],
      ["Philadelphia Union", 57],
      ["LA Galaxy", 54],
    ]),
  },
  {
    slug: "saudi",
    name: "Saudi Pro League",
    apiFootball: 307,
    theSportsDB: 4955,
    fallback: fb([
      ["Al-Hilal", 84],
      ["Al-Nassr", 78],
      ["Al-Ahli", 69],
      ["Al-Ittihad", 65],
      ["Al-Shabab", 55],
      ["Al-Ettifaq", 48],
    ]),
  },
];

export function getLeague(slug: string): League | undefined {
  return LEAGUES.find((l) => l.slug === slug);
}

// ───────────────────────── Proveedores ─────────────────────────

async function fromFootballData(l: League): Promise<Standing[]> {
  const token = process.env.FOOTBALL_DATA_TOKEN;
  if (!token || !l.footballData) throw new Error("football-data no disponible");
  const res = await fetch(
    `https://api.football-data.org/v4/competitions/${l.footballData}/standings?season=${SEASON_YEAR}`,
    { headers: { "X-Auth-Token": token }, cache: "no-store" },
  );
  if (!res.ok) throw new Error(`football-data ${res.status}`);
  const data = await res.json();
  const table = data?.standings?.find((s: { type: string }) => s.type === "TOTAL")?.table ?? [];
  return table.map((r: Record<string, number & { name: string }>) => ({
    rank: r.position,
    team: (r.team as unknown as { name: string }).name,
    played: r.playedGames,
    won: r.won,
    drawn: r.draw,
    lost: r.lost,
    points: r.points,
  }));
}

async function fromApiFootball(l: League): Promise<Standing[]> {
  const key = process.env.API_FOOTBALL_KEY;
  if (!key || !l.apiFootball) throw new Error("api-football no disponible");
  const res = await fetch(
    `https://v3.football.api-sports.io/standings?league=${l.apiFootball}&season=${SEASON_YEAR}`,
    { headers: { "x-apisports-key": key }, cache: "no-store" },
  );
  if (!res.ok) throw new Error(`api-football ${res.status}`);
  const data = await res.json();
  const table = data?.response?.[0]?.league?.standings?.[0] ?? [];
  return table.map((r: { rank: number; team: { name: string }; all: Record<string, number>; points: number }) => ({
    rank: r.rank,
    team: r.team.name,
    played: r.all.played,
    won: r.all.win,
    drawn: r.all.draw,
    lost: r.all.lose,
    points: r.points,
  }));
}

async function fromTheSportsDB(l: League): Promise<Standing[]> {
  const key = process.env.THESPORTSDB_KEY || "3"; // clave de prueba gratuita
  const res = await fetch(
    `https://www.thesportsdb.com/api/v1/json/${key}/lookuptable.php?l=${l.theSportsDB}&s=${SEASON_SDB}`,
    { cache: "no-store" },
  );
  if (!res.ok) throw new Error(`thesportsdb ${res.status}`);
  const data = await res.json();
  const table = data?.table ?? [];
  if (!Array.isArray(table) || table.length === 0) throw new Error("thesportsdb sin tabla");
  return table.map((r: Record<string, string>, i: number) => ({
    rank: Number(r.intRank) || i + 1,
    team: r.strTeam,
    played: Number(r.intPlayed) || 0,
    won: Number(r.intWin) || 0,
    drawn: Number(r.intDraw) || 0,
    lost: Number(r.intLoss) || 0,
    points: Number(r.intPoints) || 0,
  }));
}

const PROVIDERS: { name: string; fetch: (l: League) => Promise<Standing[]> }[] = [
  { name: "football-data.org", fetch: fromFootballData },
  { name: "API-Football", fetch: fromApiFootball },
  { name: "TheSportsDB", fetch: fromTheSportsDB },
];

/** Clasificación de una liga, probando proveedores en orden con fallback. */
export async function getStandings(slug: string): Promise<StandingsResult> {
  const league = getLeague(slug);
  if (!league) throw new Error(`liga desconocida: ${slug}`);

  for (const provider of PROVIDERS) {
    try {
      const rows = await provider.fetch(league);
      if (rows.length > 0) return { source: provider.name, season: SEASON_SDB, rows };
    } catch {
      /* probamos el siguiente proveedor */
    }
  }
  return { source: "reserva", season: SEASON_SDB, rows: league.fallback };
}

// ───────────────────────── Próximos partidos ─────────────────────────

export interface Fixture {
  date: string; // ISO
  home: string;
  away: string;
}

async function fixturesFootballData(l: League): Promise<Fixture[]> {
  const token = process.env.FOOTBALL_DATA_TOKEN;
  if (!token || !l.footballData) throw new Error("football-data no disponible");
  const res = await fetch(
    `https://api.football-data.org/v4/competitions/${l.footballData}/matches?status=SCHEDULED`,
    { headers: { "X-Auth-Token": token }, cache: "no-store" },
  );
  if (!res.ok) throw new Error(`football-data ${res.status}`);
  const data = await res.json();
  return (data?.matches ?? []).slice(0, 10).map((m: { utcDate: string; homeTeam: { name: string }; awayTeam: { name: string } }) => ({
    date: m.utcDate,
    home: m.homeTeam.name,
    away: m.awayTeam.name,
  }));
}

async function fixturesApiFootball(l: League): Promise<Fixture[]> {
  const key = process.env.API_FOOTBALL_KEY;
  if (!key || !l.apiFootball) throw new Error("api-football no disponible");
  const res = await fetch(
    `https://v3.football.api-sports.io/fixtures?league=${l.apiFootball}&season=${SEASON_YEAR}&next=10`,
    { headers: { "x-apisports-key": key }, cache: "no-store" },
  );
  if (!res.ok) throw new Error(`api-football ${res.status}`);
  const data = await res.json();
  return (data?.response ?? []).map((f: { fixture: { date: string }; teams: { home: { name: string }; away: { name: string } } }) => ({
    date: f.fixture.date,
    home: f.teams.home.name,
    away: f.teams.away.name,
  }));
}

async function fixturesTheSportsDB(l: League): Promise<Fixture[]> {
  const key = process.env.THESPORTSDB_KEY || "3";
  const res = await fetch(
    `https://www.thesportsdb.com/api/v1/json/${key}/eventsnextleague.php?id=${l.theSportsDB}`,
    { cache: "no-store" },
  );
  if (!res.ok) throw new Error(`thesportsdb ${res.status}`);
  const data = await res.json();
  const events = data?.events;
  if (!Array.isArray(events) || events.length === 0) throw new Error("thesportsdb sin partidos");
  return events.slice(0, 10).map((e: Record<string, string>) => ({
    date: e.strTimestamp || `${e.dateEvent}T${e.strTime || "00:00:00"}`,
    home: e.strHomeTeam,
    away: e.strAwayTeam,
  }));
}

const FIXTURE_PROVIDERS = [fixturesFootballData, fixturesApiFootball, fixturesTheSportsDB];

/** Próximos partidos de una liga, con la misma cadena de fallback. */
export async function getFixtures(slug: string): Promise<Fixture[]> {
  const league = getLeague(slug);
  if (!league) return [];
  for (const fetchFixtures of FIXTURE_PROVIDERS) {
    try {
      const rows = await fetchFixtures(league);
      if (rows.length > 0) return rows;
    } catch {
      /* siguiente proveedor */
    }
  }
  return [];
}

/** Equipos (slug de sala) → liga cuya clasificación les corresponde. */
export const TEAM_LEAGUE: Record<string, string> = {
  // LaLiga
  "real-madrid": "laliga",
  "fc-barcelona": "laliga",
  "atletico-madrid": "laliga",
  "athletic-club": "laliga",
  "real-sociedad": "laliga",
  "real-betis": "laliga",
  "villarreal-cf": "laliga",
  "valencia-cf": "laliga",
  "sevilla-fc": "laliga",
  "girona-fc": "laliga",
  "rayo-vallecano": "laliga",
  osasuna: "laliga",
  "celta-vigo": "laliga",
  "rcd-mallorca": "laliga",
  "getafe-cf": "laliga",
  "rcd-espanyol": "laliga",
  "deportivo-alaves": "laliga",
  "levante-ud": "laliga",
  "elche-cf": "laliga",
  "real-oviedo": "laliga",
  // Premier League
  "manchester-city": "premier",
  "manchester-united": "premier",
  "liverpool-fc": "premier",
  "arsenal-fc": "premier",
  "chelsea-fc": "premier",
  // Serie A
  juventus: "seriea",
  "inter-milan": "seriea",
  "ac-milan": "seriea",
  napoli: "seriea",
  "as-roma": "seriea",
  // Bundesliga
  "bayern-munich": "bundesliga",
  "borussia-dortmund": "bundesliga",
  "bayer-leverkusen": "bundesliga",
  "rb-leipzig": "bundesliga",
  "eintracht-frankfurt": "bundesliga",
  // Ligue 1
  psg: "ligue1",
  "olympique-marsella": "ligue1",
  "olympique-lyon": "ligue1",
  "as-monaco": "ligue1",
  "lille-osc": "ligue1",
  // Liga MX
  "america-mexico": "ligamx",
  "chivas-guadalajara": "ligamx",
  "cruz-azul": "ligamx",
  "pumas-unam": "ligamx",
  "tigres-uanl": "ligamx",
  "club-monterrey": "ligamx",
  // Liga Profesional Argentina
  "boca-juniors": "argentina",
  "river-plate": "argentina",
  "racing-club": "argentina",
  independiente: "argentina",
  "san-lorenzo": "argentina",
  "velez-sarsfield": "argentina",
  "estudiantes-lp": "argentina",
  // Brasileirão
  flamengo: "brasileirao",
  palmeiras: "brasileirao",
  corinthians: "brasileirao",
  "sao-paulo": "brasileirao",
  "santos-fc": "brasileirao",
  // MLS
  "inter-miami": "mls",
  "la-galaxy": "mls",
  lafc: "mls",
  "atlanta-united": "mls",
  "seattle-sounders": "mls",
  // Saudi Pro League
  "al-nassr": "saudi",
  "al-hilal": "saudi",
  "al-ittihad": "saudi",
  "al-ahli-saudi": "saudi",
  "al-ettifaq": "saudi",
};
