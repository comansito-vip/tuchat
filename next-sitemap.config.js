/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://tuchat.org",
  generateRobotsTxt: true,
  exclude: ["/webchat"],
  robotsTxtOptions: {
    policies: [{ userAgent: "*", allow: "/", disallow: ["/webchat"] }],
  },
};
