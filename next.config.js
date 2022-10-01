/** @type {import('next').NextConfig} */
const { i18n } = require("./next-i18next.config");
const withGraphql = require("next-plugin-graphql");

module.exports = withGraphql({
  i18n,
  reactStrictMode: false, // Bug requires strict-mode false: https://github.com/plouc/nivo/issues/2009
  poweredByHeader: false, // Remove powered by header
});
