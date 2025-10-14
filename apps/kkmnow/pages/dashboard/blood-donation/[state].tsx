import { useTranslation } from "datagovmy-ui/hooks";
import { Page } from "datagovmy-ui/types";
import { InferGetStaticPropsType, GetStaticProps, GetStaticPaths } from "next";
import Layout from "@components/Layout";
import { Metadata, StateDropdown, StateModal } from "datagovmy-ui/components";
import { CountryAndStates, STATES } from "datagovmy-ui/constants";
import { withi18n } from "datagovmy-ui/decorators";
import { get } from "datagovmy-ui/api";
import { DateTime } from "luxon";
import { routes } from "@lib/routes";
import BloodDonationDashboard from "@dashboards/blood-donation";
import { WindowProvider } from "datagovmy-ui/contexts/window";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";

const BloodDonationState: Page = ({
  meta,
  last_updated,
  next_update,
  params,
  timeseries,
  barchart_age,
  barchart_time,
  barchart_variables,
  choropleth,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-blood-donation", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata
        title={CountryAndStates[params.state].concat(" - ", t("header"))}
        description={t("description")}
        keywords=""
      />
      <BloodDonationDashboard
        last_updated={last_updated}
        next_update={next_update}
        params={params}
        timeseries={timeseries}
        barchart_age={barchart_age}
        barchart_time={barchart_time}
        barchart_variables={barchart_variables}
        choropleth={choropleth}
      />
    </AnalyticsProvider>
  );
};

const wp_states = ["pjy", "pls", "lbn"];

BloodDonationState.layout = (page, props) => (
  <WindowProvider>
    <Layout
      stateSelector={
        <StateDropdown
          width="w-max xl:w-64"
          url={routes.BLOOD_DONATION}
          currentState={props.params.state}
          exclude={wp_states}
          hideOnScroll
        />
      }
    >
      <StateModal state={props.params.state} url={routes.BLOOD_DONATION} exclude={wp_states} />
      {page}
    </Layout>
  </WindowProvider>
);

// Build at runtime
export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = withi18n(
  ["dashboard-blood-donation", "common"],
  async ({ params }) => {
    const current_state = String(params.state);

    // validate param
    const notStateKey = !STATES.map(state => state.key).includes(current_state);
    const isWilayah = wp_states.includes(current_state);
    if (notStateKey || isWilayah) {
      return {
        notFound: true,
      };
    }

    const { data } = await get(`/dashboards-kkmnow/blood-donation-${current_state}.json`, {}, "api_s3");

    // transfrom:
    data.bar_chart_time.data.monthly.x = data.bar_chart_time.data.monthly.x.map((item: any) => {
      const period = DateTime.fromFormat(item, "yyyy-MM-dd");
      return period.monthShort !== "Jan" ? period.monthShort : period.year.toString();
    });

    return {
      notFound: false,
      props: {
        meta: {
          id: "dashboard-blood-donation",
          type: "dashboard",
          category: "healthcare",
          agency: "PDN",
        },
        last_updated: data.data_last_updated,
        next_update: data.data_next_update,
        params: params,
        timeseries: data.timeseries_all,
        barchart_age: data.bar_chart_age,
        barchart_time: data.bar_chart_time,
        barchart_variables: data.barchart_key_variables,
        choropleth: data.choropleth_malaysia,
      },
      revalidate: 60 * 60 * 24, // 1 day (in seconds)
    };
  }
);

export default BloodDonationState;
