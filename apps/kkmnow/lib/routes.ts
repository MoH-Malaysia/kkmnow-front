import i18nConfig from "../next-i18next.config";

export const routes = {
  HOME: "/",
  COVID_19: "/dashboard/covid-19",
  COVID_VACCINATION: "/dashboard/covid-vaccination",
  BLOOD_DONATION: "/dashboard/blood-donation",
  ORGAN_DONATION: "/dashboard/organ-donation",
  PEKA_B40: "/dashboard/peka-b40",
  FACILITIES: "/dashboard/healthcare-facilities",
  HOSPITAL_BED_UTILISATION: "/dashboard/hospital-bed-utilisation",
  COVIDNOW_DATA: "/dashboard/covidnow-data",
  FISCAL: "/dashboard/fiscal",
  SHA_2011: "/dashboard/sha-2011",
};

export const static_routes: string[] = (() => {
  let s_routes = Object.values(routes).filter(route => !["/data-catalogue"].includes(route));

  s_routes.forEach(route => {
    s_routes.push(`/ms-MY${route}`);
  });
  // Chinese and Tamil exist only for these two dashboards, and only when switched on
  // (PAGE_LOCALES_ENABLED in next-i18next.config.js)
  const pageLocales: string[] = i18nConfig.optInLocales ?? [];
  [routes.FISCAL, routes.SHA_2011].forEach(route => {
    pageLocales.forEach(locale => s_routes.push(`/${locale}${route}`));
  });
  return s_routes;
})();
