/**
 * Covid Page <Index>
 */
import CovidDashboard from "@dashboards/covid";
import { get } from "@lib/api";
import { InferGetStaticPropsType, GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const CovidIndex = ({
  bar_chart,
  snapshot_bar,
  snapshot_graphic,
  snapshot_table,
  timeseries_admitted,
  timeseries_cases,
  timeseries_deaths,
  timeseries_icu,
  timeseries_tests,
  timeseries_vents,
  util_chart,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <CovidDashboard
        bar_chart={bar_chart}
        snapshot_bar={snapshot_bar}
        snapshot_graphic={snapshot_graphic}
        snapshot_table={snapshot_table}
        timeseries_admitted={timeseries_admitted}
        timeseries_cases={timeseries_cases}
        timeseries_deaths={timeseries_deaths}
        timeseries_icu={timeseries_icu}
        timeseries_tests={timeseries_tests}
        timeseries_vents={timeseries_vents}
        util_chart={util_chart}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(locale!, ["common"]);
  const { data } = await get("/kkmnow", { dashboard: "covid_epid", state: "mys" }); // fetch static data here

  return {
    props: {
      bar_chart: data.bar_chart,
      snapshot_bar: data.snapshot_bar,
      snapshot_graphic: data.snapshot_graphic,
      snapshot_table: data.snapshot_table,
      timeseries_admitted: data.timeseries_admitted,
      timeseries_cases: data.timeseries_cases,
      timeseries_deaths: data.timeseries_deaths,
      timeseries_icu: data.timeseries_icu,
      timeseries_tests: data.timeseries_tests,
      timeseries_vents: data.timeseries_vents,
      util_chart: data.util_chart,
      ...i18n,
    },
  };
};

export default CovidIndex;
