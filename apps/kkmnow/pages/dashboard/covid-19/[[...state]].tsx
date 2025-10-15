import Layout from "@components/Layout";
import { Metadata, StateDropdown, StateModal } from "datagovmy-ui/components";
import COVID19Dashboard from "@dashboards/covid-19";
import { useTranslation } from "next-i18next";
import { get } from "datagovmy-ui/api";
import { withi18n } from "datagovmy-ui/decorators";
import { routes } from "@lib/routes";
import { Page } from "datagovmy-ui/types";
import { InferGetStaticPropsType, GetStaticProps, GetStaticPaths } from "next";
import { CountryAndStates, STATE_CODES } from "datagovmy-ui/constants";
import { WindowProvider } from "datagovmy-ui/contexts/window";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import { sortMsiaFirst } from "datagovmy-ui/helpers";

const COVID19: Page = ({
  meta,
  params,
  last_updated,
  next_update,
  snapshot_bar,
  snapshot_graphic,
  snapshot_table,
  timeseries,
  statistics,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-covid-19", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata
        title={[t("header"), "·", CountryAndStates[params.state]].join(" ")}
        description={t("description")}
        keywords={""}
      />
      <COVID19Dashboard
        params={params}
        last_updated={last_updated}
        next_update={next_update}
        snapshot_bar={snapshot_bar}
        snapshot_graphic={snapshot_graphic}
        snapshot_table={snapshot_table}
        timeseries={timeseries}
        statistics={statistics}
      />
    </AnalyticsProvider>
  );
};

COVID19.layout = (page, props) => (
  <WindowProvider>
    <Layout
      stateSelector={
        <StateDropdown
          width="w-max xl:w-64"
          url={routes.COVID_19}
          currentState={props.params.state ?? "mys"}
          hideOnScroll
        />
      }
    >
      <StateModal state={props.params.state} url={routes.COVID_19} />
      {page}
    </Layout>
  </WindowProvider>
);

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking", // can also be true or 'blocking'
  };
};

export const getStaticProps: GetStaticProps = withi18n(
  ["dashboard-covid-19", "common"],
  async ({ params }) => {
    const curr_state_code = params.state ? String(params.state) : "mys";

    // validate param
    if (!STATE_CODES.includes(curr_state_code)) {
      return {
        notFound: true,
      };
    }

    const { data } = await get(`/dashboards/covid-epid-${curr_state_code}.json`, {}, "api_s3");

    data.snapshot_table.data = sortMsiaFirst(data.snapshot_table.data, "state");

    return {
      notFound: false,
      props: {
        meta: {
          id: "dashboard-covid-19",
          type: "dashboard",
          category: "healthcare",
          agency: "KKM",
        },
        params: { state: curr_state_code },
        last_updated: data.data_last_updated,
        next_update: data.data_next_update,
        snapshot_bar: data.snapshot_bar,
        snapshot_graphic: data.snapshot_graphic,
        snapshot_table: data.snapshot_table,
        timeseries: data.timeseries,
        statistics: data.statistics,
      },
    };
  }
);

export default COVID19;
