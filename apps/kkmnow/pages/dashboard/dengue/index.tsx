import { GetStaticProps, InferGetStaticPropsType } from "next";
import { get } from "datagovmy-ui/api";
import { useTranslation } from "datagovmy-ui/hooks";
import { WindowProvider } from "datagovmy-ui/contexts/window";
import { withi18n } from "datagovmy-ui/decorators";
import DengueDashboard from "@dashboards/dengue";
import { Page } from "datagovmy-ui/types";
import Layout from "@components/Layout";
import { Metadata, StateDropdown, StateModal } from "datagovmy-ui/components";
import { routes } from "@lib/routes";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";

const Dengue: Page = ({
  meta,
  last_updated,
  next_update,
  params,
  keystats,
  timeseries,
  districts,
  map,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-dengue", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords="" />
      <DengueDashboard
        last_updated={last_updated}
        next_update={next_update}
        params={params}
        keystats={keystats}
        timeseries={timeseries}
        districts={districts}
        map={map}
      />
    </AnalyticsProvider>
  );
};

Dengue.layout = (page, props) => (
  <WindowProvider>
    <Layout
      stateSelector={
        <StateDropdown
          width="w-max xl:w-64"
          url={routes.DENGUE}
          currentState={props.params.state}
          hideOnScroll
        />
      }
    >
      <StateModal url={routes.DENGUE} state={props.params.state} />
      {page}
    </Layout>
  </WindowProvider>
);

export const getStaticProps: GetStaticProps = withi18n(["dashboard-dengue", "common"], async () => {
  const { data } = await get("/dashboards/dengue-mys.json", {}, "api_s3");

  return {
    notFound: false,
    props: {
      meta: {
        id: "dashboard-dengue",
        type: "dashboard",
        category: "healthcare",
        agency: "KKM",
      },
      last_updated: data.data_last_updated,
      next_update: data.data_next_update,
      params: { state: "mys" },
      keystats: data.keystats,
      timeseries: data.timeseries,
      districts: data.districts ?? [],
      map: data.map,
    },
  };
});

export default Dengue;
