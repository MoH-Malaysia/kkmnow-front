/** @type {import('next').NextConfig} */
const { i18n } = require("./next-i18next.config");
const pwa = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n,
  // Optional path prefix, e.g. when served behind a reverse proxy at a sub-path. Unset by default.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  reactStrictMode: false, // Bug requires strict-mode false: https://github.com/plouc/nivo/issues/2009
  poweredByHeader: false,
  transpilePackages: ["datagovmy-ui"],
  modularizeImports: {
    "datagovmy-ui": {
      transform: "datagovmy-ui/{{member}}",
      preventFullImport: true,
    },
  },
  publicRuntimeConfig: {
    APP_NAME: "KKMNOW",
    META_AUTHOR: "Ministry of Health",
    META_THEME: "#13293D",
    META_KEYWORDS:
      "kkmnow kementerian data kesihatan covidnow statistics malaysia blood organ donation vaccination vaccine b40 health ",
    META_DOMAIN: "data.moh.gov.my",
    META_URL: "https://data.moh.gov.my",
    META_IMAGE: "https://data.moh.gov.my/static/images/jata_512.png",
  },
  webpack(config, { isServer }) {
    // next-i18next.config.js reads local locale files on the server only
    if (!isServer) config.resolve.fallback = { ...config.resolve.fallback, fs: false, path: false };
    config.module.rules.push({
      test: /index\.(js|mjs|jsx|ts|tsx)$/,
      include: mPath => mPath.includes("datagovmy-ui"),
      sideEffects: false,
    });
    return config;
  },
  async rewrites() {
    return [
      {
        source: "/mp/lib.min.js",
        destination: "https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js",
      },
      {
        source: "/mp/lib.js",
        destination: "https://cdn.mxpnl.com/libs/mixpanel-2-latest.js",
      },
      {
        source: "/mp/decide",
        destination: "https://decide.mixpanel.com/decide",
      },
      {
        source: "/mp/:slug*",
        destination: "https://api.mixpanel.com/:slug*",
      },
    ];
  },
};

module.exports = () => {
  const plugins = [pwa]; // add analyzer here later
  return plugins.reduce((acc, next) => next(acc), nextConfig);
};
