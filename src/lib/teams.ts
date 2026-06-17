export interface Team {
  name: string;
  slug: string;   // sala en /chat/{slug} si existe, vacío si no
  badge: string;  // URL del escudo (Wikimedia Commons SVG, dominio público o CC-BY)
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
      { name: "Real Madrid",       slug: "real-madrid",  badge: "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg" },
      { name: "FC Barcelona",      slug: "fc-barcelona", badge: "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg" },
      { name: "Atlético de Madrid",slug: "atletico-madrid", badge: "https://upload.wikimedia.org/wikipedia/en/f/f4/Atletico_de_madrid_logo_2017.svg" },
      { name: "Sevilla FC",        slug: "",             badge: "https://upload.wikimedia.org/wikipedia/en/3/3b/Sevilla_FC_logo.svg" },
      { name: "Valencia CF",       slug: "",             badge: "https://upload.wikimedia.org/wikipedia/en/c/ce/Valenciacf.svg" },
    ],
  },
  {
    slug: "premier",
    name: "Premier League",
    teams: [
      { name: "Manchester City",   slug: "",             badge: "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg" },
      { name: "Liverpool",         slug: "",             badge: "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg" },
      { name: "Arsenal",           slug: "",             badge: "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg" },
      { name: "Chelsea",           slug: "",             badge: "https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg" },
      { name: "Manchester United", slug: "",             badge: "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg" },
    ],
  },
  {
    slug: "seriea",
    name: "Serie A",
    teams: [
      { name: "Juventus",          slug: "",             badge: "https://upload.wikimedia.org/wikipedia/commons/1/15/Juventus_FC_2017_icon_%28black%29.svg" },
      { name: "Inter Milan",       slug: "",             badge: "https://upload.wikimedia.org/wikipedia/commons/0/05/FC_Internazionale_Milano_2021.svg" },
      { name: "AC Milan",          slug: "",             badge: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Logo_of_AC_Milan.svg" },
      { name: "Napoli",            slug: "",             badge: "https://upload.wikimedia.org/wikipedia/commons/2/2d/SSC_Napoli_2010-2021.svg" },
      { name: "AS Roma",           slug: "",             badge: "https://upload.wikimedia.org/wikipedia/en/f/f7/AS_Roma_logo_%282013%29.svg" },
    ],
  },
  {
    slug: "bundesliga",
    name: "Bundesliga",
    teams: [
      { name: "Bayern Munich",     slug: "",             badge: "https://upload.wikimedia.org/wikipedia/commons/1/1f/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg" },
      { name: "B. Dortmund",       slug: "",             badge: "https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg" },
      { name: "RB Leipzig",        slug: "",             badge: "https://upload.wikimedia.org/wikipedia/en/0/04/RB_Leipzig_2014_logo.svg" },
      { name: "Bayer Leverkusen",  slug: "",             badge: "https://upload.wikimedia.org/wikipedia/en/5/59/Bayer_04_Leverkusen_logo.svg" },
      { name: "E. Frankfurt",      slug: "",             badge: "https://upload.wikimedia.org/wikipedia/commons/0/04/Eintracht_Frankfurt_Logo.svg" },
    ],
  },
  {
    slug: "ligamx",
    name: "Liga MX",
    teams: [
      { name: "Club América",      slug: "america-mexico", badge: "https://upload.wikimedia.org/wikipedia/en/a/a4/Club_America_crest.svg" },
      { name: "Chivas",            slug: "",             badge: "https://upload.wikimedia.org/wikipedia/en/a/ab/Chivas_Logo_2022.png" },
      { name: "Cruz Azul",         slug: "",             badge: "https://upload.wikimedia.org/wikipedia/en/6/67/Cruz_Azul_Logo.svg" },
      { name: "Tigres UANL",       slug: "",             badge: "https://upload.wikimedia.org/wikipedia/en/3/3a/Tigres_UANL_logo.svg" },
      { name: "CF Monterrey",      slug: "",             badge: "https://upload.wikimedia.org/wikipedia/en/f/f2/CF_Monterrey_logo.svg" },
    ],
  },
  {
    slug: "ligue1",
    name: "Ligue 1",
    teams: [
      { name: "Paris Saint-Germain", slug: "",           badge: "https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg" },
      { name: "Olympique Marseille", slug: "",           badge: "https://upload.wikimedia.org/wikipedia/commons/d/d8/Olympique_Marseille_logo.svg" },
      { name: "Lyon",              slug: "",             badge: "https://upload.wikimedia.org/wikipedia/en/c/cc/Olympique_lyonnais_%28logo%29.svg" },
      { name: "Monaco",            slug: "",             badge: "https://upload.wikimedia.org/wikipedia/en/2/23/AS_Monaco_FC_Logo_2021.svg" },
      { name: "Lille",             slug: "",             badge: "https://upload.wikimedia.org/wikipedia/en/6/62/Lille_OSC_2011_logo.svg" },
    ],
  },
];

export function getLeagues(): League[] {
  return LEAGUES;
}
