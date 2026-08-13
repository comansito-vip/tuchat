export interface Team {
  name: string;
  slug: string;   // sala en /chat/{slug} si existe, vacío si no
  // Ruta al escudo dentro de `public/img/escudos/`. Hasta agosto de 2026 esto
  // era un enlace directo a upload.wikimedia.org y **doce de los treinta daban
  // 404**: Wikimedia renombra ficheros y la página se quedaba con el hueco sin
  // que nada avisara. Ahora la imagen es nuestra y una que falte se ve en el
  // build. Las fuentes se citan en el aviso legal.
  badge: string;
}

export interface League {
  slug: string;
  name: string;
  teams: Team[];
}

const LEAGUES: League[] = [
  {
    slug: "laliga",
    name: "LaLiga",
    teams: [
      { name: "Real Madrid",       slug: "real-madrid",  badge: "/img/escudos/real-madrid.svg" },
      { name: "FC Barcelona",      slug: "fc-barcelona", badge: "/img/escudos/fc-barcelona.svg" },
      { name: "Atlético de Madrid",slug: "atletico-madrid", badge: "/img/escudos/atletico-de-madrid.png" },
      { name: "Sevilla FC",        slug: "",             badge: "/img/escudos/sevilla-fc.png" },
      { name: "Valencia CF",       slug: "",             badge: "/img/escudos/valencia-cf.svg" },
    ],
  },
  {
    slug: "premier",
    name: "Premier League",
    teams: [
      { name: "Manchester City",   slug: "",             badge: "/img/escudos/manchester-city.svg" },
      { name: "Liverpool",         slug: "",             badge: "/img/escudos/liverpool.png" },
      { name: "Arsenal",           slug: "",             badge: "/img/escudos/arsenal.svg" },
      { name: "Chelsea",           slug: "",             badge: "/img/escudos/chelsea.svg" },
      { name: "Manchester United", slug: "",             badge: "/img/escudos/manchester-united.svg" },
    ],
  },
  {
    slug: "seriea",
    name: "Serie A",
    teams: [
      { name: "Juventus",          slug: "",             badge: "/img/escudos/juventus.png" },
      { name: "Inter Milan",       slug: "",             badge: "/img/escudos/inter-milan.svg" },
      { name: "AC Milan",          slug: "",             badge: "/img/escudos/ac-milan.svg" },
      { name: "Napoli",            slug: "",             badge: "/img/escudos/napoli.png" },
      { name: "AS Roma",           slug: "",             badge: "/img/escudos/as-roma.png" },
    ],
  },
  {
    slug: "bundesliga",
    name: "Bundesliga",
    teams: [
      { name: "Bayern Munich",     slug: "",             badge: "/img/escudos/bayern-munich.png" },
      { name: "B. Dortmund",       slug: "",             badge: "/img/escudos/b-dortmund.svg" },
      { name: "RB Leipzig",        slug: "",             badge: "/img/escudos/rb-leipzig.svg" },
      { name: "Bayer Leverkusen",  slug: "",             badge: "/img/escudos/bayer-leverkusen.svg" },
      { name: "E. Frankfurt",      slug: "",             badge: "/img/escudos/e-frankfurt.png" },
    ],
  },
  {
    slug: "ligamx",
    name: "Liga MX",
    teams: [
      { name: "Club América",      slug: "america-mexico", badge: "/img/escudos/club-america.png" },
      { name: "Chivas",            slug: "",             badge: "/img/escudos/chivas.png" },
      { name: "Cruz Azul",         slug: "",             badge: "/img/escudos/cruz-azul.png" },
      { name: "Tigres UANL",       slug: "",             badge: "/img/escudos/tigres-uanl.png" },
      { name: "CF Monterrey",      slug: "",             badge: "/img/escudos/cf-monterrey.png" },
    ],
  },
  {
    slug: "ligue1",
    name: "Ligue 1",
    teams: [
      { name: "Paris Saint-Germain", slug: "",           badge: "/img/escudos/paris-saint-germain.svg" },
      { name: "Olympique Marseille", slug: "",           badge: "/img/escudos/olympique-marseille.svg" },
      { name: "Lyon",              slug: "",             badge: "/img/escudos/lyon.png" },
      { name: "Monaco",            slug: "",             badge: "/img/escudos/monaco.png" },
      { name: "Lille",             slug: "",             badge: "/img/escudos/lille.png" },
    ],
  },
];

export function getLeagues(): League[] {
  return LEAGUES;
}
