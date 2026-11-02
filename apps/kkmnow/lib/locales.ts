import { routes } from "@lib/routes";
import i18nConfig from "../next-i18next.config";

/**
 * Languages offered only on the fiscal and SHA 2011 dashboards. Turned on or off in one place,
 * PAGE_LOCALES_ENABLED in next-i18next.config.js. Chinese is Simplified, as used in Malaysia.
 */
export const PAGE_LOCALES: string[] = i18nConfig.optInLocales ?? [];

export const PAGE_LANGUAGES = [
  { label: "中文", value: "zh-MY" },
  { label: "தமிழ்", value: "ta-MY" },
].filter(l => PAGE_LOCALES.includes(l.value));

/** Routes (and their sub-routes) that serve PAGE_LOCALES */
export const PAGE_LOCALE_ROUTES = [routes.FISCAL, routes.SHA_2011];

export const servesPageLocales = (pathname: string) =>
  PAGE_LOCALE_ROUTES.some(r => pathname === r || pathname.startsWith(`${r}/`));

/** Date format for "Last updated" lines, per language */
export const dateFormat = (lang: string) => (lang === "zh-MY" ? "yyyy年M月d日" : "dd MMM yyyy");
