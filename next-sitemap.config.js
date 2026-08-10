/** @type {import('next-sitemap').IConfig} */
const fs = require("fs");
const path_ = require("path");

const LEAGUE_SLUGS = [
  "laliga", "premier", "seriea", "ligamx", "bundesliga", "ligue1", "argentina", "brasileirao",
  "mls", "saudi",
];

// Fecha real de publicación de cada artículo, leída de news.ts. Es la única
// parte del sitio con una fecha de verdad que ofrecer: el resto de páginas no
// tiene un "cuándo cambió" honesto que dar (ver la nota de `lastmod` abajo).
const NEWS_DATES = (() => {
  const src = fs.readFileSync(path_.join(__dirname, "src/data/news.ts"), "utf8");
  const fechas = {};
  for (const m of src.matchAll(/slug:\s*"([^"]+)"[\s\S]*?date:\s*"([\d-]+)"/g)) {
    fechas[m[1]] = m[2];
  }
  return fechas;
})();

function transformEntry(config, path) {
  // Sin `lastmod` con el timestamp del build: idéntico en las 4.600 URLs, le
  // dice a Google que todo cambió a la vez en cada deploy y acaba ignorándolo.
  // Los artículos son la excepción: tienen fecha de publicación real, así que
  // ahí el lastmod es cierto y sirve.
  const base = { loc: path };

  // Home + major hub pages
  if (path === "/" || path === "/chat" || path === "/noticias" || path === "/deportes") {
    return { ...base, changefreq: "daily", priority: 1.0 };
  }
  if (
    path === "/horoscopo" || path === "/tarot" || path === "/anime" || path === "/ranking"
  ) {
    return { ...base, changefreq: "daily", priority: 0.8 };
  }

  // Sports results (live scores)
  if (path.startsWith("/resultados/")) {
    return { ...base, changefreq: "daily", priority: 0.7 };
  }

  // Ranking por país: hereda relevancia de /ranking, no el 0.6 por defecto
  if (path.startsWith("/ranking/")) {
    return { ...base, changefreq: "daily", priority: 0.7 };
  }

  // Chat rooms
  if (path.startsWith("/chat/")) {
    return { ...base, changefreq: "weekly", priority: 0.8 };
  }

  // Weather + lotteries (service pages). /tiempo son 1.966 URLs —el 39% del
  // sitemap— con una mediana de 174 palabras frente a las 645 de una sala: su
  // valor es el dato, no el texto, y ese contraste es real. Mientras Google
  // conceda tan poco rastreo al dominio, la jerarquía tiene que decir con
  // claridad que primero van las salas.
  if (path.startsWith("/tiempo/")) {
    return { ...base, changefreq: "weekly", priority: 0.3 };
  }
  if (path.startsWith("/loterias/")) {
    return { ...base, changefreq: "weekly", priority: 0.5 };
  }

  // Horoscopo signs
  if (path.startsWith("/horoscopo/")) {
    return { ...base, changefreq: "monthly", priority: 0.6 };
  }

  // News categories
  if (/^\/noticias\/[^/]+$/.test(path)) {
    return { ...base, changefreq: "weekly", priority: 0.6 };
  }

  // News articles
  if (path.startsWith("/noticias/articulo/")) {
    const fecha = NEWS_DATES[path.replace("/noticias/articulo/", "")];
    return {
      ...base,
      changefreq: "monthly",
      priority: 0.5,
      ...(fecha ? { lastmod: new Date(`${fecha}T00:00:00Z`).toISOString() } : {}),
    };
  }

  // Legal + static pages
  if (path.startsWith("/legal/") || path === "/contacto") {
    return { ...base, changefreq: "yearly", priority: 0.3 };
  }

  // Default
  return { ...base, changefreq: "weekly", priority: 0.6 };
}

module.exports = {
  siteUrl: "https://www.tuchat.org",
  generateRobotsTxt: true,
  exclude: ["/webchat", "/admin", "/api/*", "/resultados", "/opengraph-image"],
  robotsTxtOptions: {
    // /webchat NO se bloquea: necesita ser rastreable para que su meta noindex
    // surta efecto (Google no lee el noindex de una URL bloqueada por robots).
    // Los bots de IA (GPTBot, ClaudeBot, PerplexityBot…) se declaran explícitamente
    // con Allow para blindar el acceso ante futuros cambios de la regla genérica y
    // señalar intención de ser citado por motores de respuesta.
    policies: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
      { userAgent: "GPTBot", allow: "/", disallow: ["/admin", "/api"] },
      { userAgent: "OAI-SearchBot", allow: "/", disallow: ["/admin", "/api"] },
      { userAgent: "ChatGPT-User", allow: "/", disallow: ["/admin", "/api"] },
      { userAgent: "ClaudeBot", allow: "/", disallow: ["/admin", "/api"] },
      { userAgent: "Claude-Web", allow: "/", disallow: ["/admin", "/api"] },
      { userAgent: "PerplexityBot", allow: "/", disallow: ["/admin", "/api"] },
      { userAgent: "Google-Extended", allow: "/", disallow: ["/admin", "/api"] },
      { userAgent: "CCBot", allow: "/", disallow: ["/admin", "/api"] },
    ],
  },
  transform: transformEntry,
  // /chat recibe searchParams (no estática) y next-sitemap no la recoge del build:
  // se añade explícitamente junto a las páginas de resultados por liga.
  additionalPaths: async (config) =>
    Promise.all([
      config.transform(config, "/chat"),
      ...LEAGUE_SLUGS.map((slug) =>
        config.transform(config, `/resultados/${slug}`)
      ),
    ]),
};
