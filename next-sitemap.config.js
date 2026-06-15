/** @type {import('next-sitemap').IConfig} */
const LEAGUE_SLUGS = [
  "laliga", "premier", "seriea", "ligamx", "bundesliga", "ligue1", "argentina", "brasileirao",
];

module.exports = {
  siteUrl: "https://tuchat.org",
  generateRobotsTxt: true,
  exclude: ["/webchat", "/admin", "/api/*", "/resultados"],
  robotsTxtOptions: {
    policies: [{ userAgent: "*", allow: "/", disallow: ["/webchat", "/admin", "/api"] }],
  },
  additionalPaths: async (config) =>
    Promise.all(
      LEAGUE_SLUGS.map((slug) =>
        config.transform(config, `/resultados/${slug}`)
      )
    ),
};
