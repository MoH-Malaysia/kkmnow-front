/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.APP_URL || "https://data.moh.gov.my",
  generateIndexSitemap: true,
  generateRobotsTxt: true,
  priority: 0.7,
  autoLastmod: true,
  outDir: "public",
  exclude: ["en-GB", "ms-MY", "zh-MY", "ta-MY"]
    .flatMap(l => [`/${l}/404`, `/${l}/500`])
    .concat(["/404", "500"]),
};
