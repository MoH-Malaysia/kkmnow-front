import { UserConfig } from "next-i18next";

export type I18nConfig = UserConfig & {
  autoloadNs: string[];
  /** Locales a page serves only if it lists them in withi18n's `locales` option; else 404 */
  optInLocales?: string[];
};

export type defineConfig = (namespace: string[], autoloadNs: string[]) => I18nConfig;
