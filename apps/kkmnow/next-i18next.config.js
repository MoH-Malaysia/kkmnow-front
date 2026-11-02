const defineConfig = require("datagovmy-ui/i18n");

const namespaces = [
  "common",
  "agencies",
  "division",
  "kkmnow-home",
  "dashboard-blood-donation",
  "dashboard-covid-19",
  "dashboard-covid-vaccination",
  "dashboard-hospital-bed-utilisation",
  "dashboard-organ-donation",
  "dashboard-peka-b40",
  "dashboard-fiscal",
  "dashboard-sha-2011",
  "kkmnow-home-local",
];

// Namespaces not yet published to the i18n CDN; served from public/locales instead.
const LOCAL_NAMESPACES = ["dashboard-fiscal", "dashboard-sha-2011", "kkmnow-home-local"];
// Public files sit under the basePath when one is set (see next.config.js)
const LOCAL_PREFIX = `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/locales/`;
const LOCAL_LOAD_PATH = `${LOCAL_PREFIX}{{lng}}/{{ns}}.json`;

const config = defineConfig(namespaces, [
  "common",
  "agencies",
  "dashboards",
  "division",
  "kkmnow-home",
]);

// Languages offered only by pages that opt in through withi18n's `locales` option (the fiscal and
// SHA 2011 dashboards). Every other page returns 404 for them, and middleware.ts redirects those
// requests to English. Their translations, including the shared strings those pages show, are
// local files in public/locales/{zh-MY,ta-MY}; missing keys fall back to English.
// Switched off for now (translations pending review): set to true to offer them.
const PAGE_LOCALES_ENABLED = false;
const PAGE_LOCALES = PAGE_LOCALES_ENABLED ? ["zh-MY", "ta-MY"] : [];
config.i18n.locales = [...config.i18n.locales, ...PAGE_LOCALES];
config.fallbackLng = "en-GB";
config.optInLocales = PAGE_LOCALES;

const remoteLoadPath = config.backend.loadPath;
config.backend.loadPath = (lngs, nss) =>
  lngs.some(lng => PAGE_LOCALES.includes(lng)) || nss.some(ns => LOCAL_NAMESPACES.includes(ns))
    ? LOCAL_LOAD_PATH
    : remoteLoadPath;

// The browser fetches LOCAL_LOAD_PATH from public/. The server has no origin to resolve it
// against, so read those files from disk and fetch everything else as usual.
if (typeof window === "undefined") {
  config.backend.request = (_options, url, _payload, callback) => {
    if (url.startsWith(LOCAL_PREFIX)) {
      const fs = require("fs");
      const path = require("path");
      const file = path.join(process.cwd(), "public", "locales", url.slice(LOCAL_PREFIX.length));
      fs.readFile(file, "utf8", (err, data) =>
        err ? callback(null, { status: 404, data: "" }) : callback(null, { status: 200, data })
      );
      return;
    }
    fetch(url)
      .then(async res => callback(null, { status: res.status, data: await res.text() }))
      .catch(err => callback(err));
  };
}

module.exports = config;
