import { Metadata } from "datagovmy-ui/components";
import FiscalDashboard, { fiscalSpan } from "@dashboards/fiscal";
import type { FiscalPayload } from "@dashboards/fiscal/types";
import { useTranslation } from "datagovmy-ui/hooks";
import { withi18n } from "datagovmy-ui/decorators";
import { Page } from "datagovmy-ui/types";
import { InferGetStaticPropsType, GetStaticProps } from "next";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import { PAGE_LOCALES } from "@lib/locales";
import { getPrivateJson } from "@lib/private-data";

const Fiscal: Page = ({
  meta,
  data_last_updated,
  fiscal,
  budget_alloc,
  ghed,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-fiscal", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata
        title={t("header")}
        description={t("description", fiscalSpan(fiscal))}
        keywords={""}
      />
      <FiscalDashboard
        data_last_updated={data_last_updated}
        fiscal={fiscal}
        budget_alloc={budget_alloc}
        ghed={ghed}
      />
    </AnalyticsProvider>
  );
};

export const getStaticProps: GetStaticProps = withi18n(
  ["dashboard-fiscal", "common"],
  async () => {
    // Built by the data pipeline's exporter (see lib/private-data.ts). View-only: never committed
    const data = await getPrivateJson<FiscalPayload>("dashboards/fiscal.json");

    return {
      notFound: false,
      props: {
        meta: {
          id: "dashboard-fiscal",
          type: "dashboard",
          category: "public-finances",
          agency: "MOH",
        },
        data_last_updated: data.data_last_updated,
        fiscal: data.fiscal,
        budget_alloc: data.budget_alloc,
        ghed: data.ghed,
      },
    };
  },
  { locales: PAGE_LOCALES }
);

export default Fiscal;
