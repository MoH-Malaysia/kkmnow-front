import { Metadata } from "datagovmy-ui/components";
import DashboardHub, { HubEntry } from "@dashboards/hub";
import { useTranslation } from "datagovmy-ui/hooks";
import { withi18n } from "datagovmy-ui/decorators";
import { Page } from "datagovmy-ui/types";
import { GetStaticProps, InferGetStaticPropsType } from "next";

import { mohBudgetEnabled } from "@lib/moh-budget";
import { routes } from "@lib/routes";

const DashboardIndex: Page = ({ entries }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboards", "common"]);

  return (
    <>
      <Metadata title={t("common:nav.dashboards")} description={t("description")} keywords={""} />
      <DashboardHub entries={entries} />
    </>
  );
};

/** Dashboards whose name and description live in the CDN "dashboards" namespace */
const cdn = (name: string, route: string): HubEntry => ({
  route,
  name: `dashboards:dashboards.${name}.name`,
  description: `dashboards:dashboards.${name}.description`,
});

/** Dashboards not on the CDN yet: their own namespace carries the card text */
const local = (namespace: string, route: string): HubEntry => ({
  route,
  name: `${namespace}:header`,
  description: `${namespace}:card_description`,
});

export const getStaticProps: GetStaticProps = withi18n(
  [
    "dashboards",
    "dashboard-fiscal",
    "dashboard-sha-2011",
    // Only while switched on, so a hidden page's text isn't sent either
    ...(mohBudgetEnabled() ? ["dashboard-moh-budget"] : []),
  ],
  async () => {
    const entries: HubEntry[] = [
      cdn("blood-donation", routes.BLOOD_DONATION),
      cdn("covid-19", routes.COVID_19),
      cdn("covid-vaccination", routes.COVID_VACCINATION),
      local("dashboard-fiscal", routes.FISCAL),
      local("dashboard-sha-2011", routes.SHA_2011),
      // Listed only while the page is switched on (lib/moh-budget.ts)
      ...(mohBudgetEnabled() ? [local("dashboard-moh-budget", routes.MOH_BUDGET)] : []),
      cdn("hospital-bed-utilisation", routes.HOSPITAL_BED_UTILISATION),
      cdn("organ-donation", routes.ORGAN_DONATION),
      cdn("peka-b40", routes.PEKA_B40),
    ];

    return {
      props: {
        meta: {
          id: "dashboard-index",
          type: "misc",
          category: null,
          agency: null,
        },
        entries,
      },
    };
  }
);

export default DashboardIndex;
