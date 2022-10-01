/**
 * Covid Page <State>
 */
import { Metadata } from "@components/index";
import CovidDashboard from "@dashboards/covid";
import { get } from "@lib/api";
import { STATES } from "@lib/constants";
import { Page } from "@lib/types";
import { InferGetStaticPropsType, GetStaticProps, GetStaticPaths } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const CovidState: Page = ({
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
      <Metadata title={"COVID-19"} keywords={""} />
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

export const getStaticPaths: GetStaticPaths = async ctx => {
  const paths = STATES.filter(item => !["kvy"].includes(item.key)).map(state => {
    return {
      params: {
        state: state.key,
      },
    };
  });
  return {
    paths: paths,
    fallback: false, // can also be true or 'blocking'
  };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const i18n = await serverSideTranslations(locale!, ["common"]);

  const { data } = await get("/kkmnow", { dashboard: "covid_epid", state: params?.state }); // fetch static data here

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

export default CovidState;
