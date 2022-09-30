/**
 * CovidNow Data Page <Index>
 */
import { Metadata } from "@components/index";
import CovidNowDashboard from "@dashboards/covidnow-data";
import { get } from "@lib/api";
import { Page } from "@lib/types";
import { InferGetStaticPropsType, GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const CovidNowDataIndex: Page = ({
  timeseries_chart,
  heatmap_chart,
  barmeter_chart,
  choropleth_malaysia,
  choropleth_world,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <Metadata title={"COVIDNOW in Data"} keywords={""} />

      <CovidNowDashboard
        timeseries_chart={timeseries_chart}
        heatmap_chart={heatmap_chart}
        barmeter_chart={barmeter_chart}
        choropleth_malaysia={choropleth_malaysia}
        choropleth_world={choropleth_world}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(locale!, ["common"]);

  const data2 = await get("/kkmnow", { dashboard: "covid_now" }); // fetch static data here

  const sortingArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const heatmap_chart = Object.values(data2.data.heatmap).sort((a: any, b: any) => {
    return sortingArr.indexOf(a.id) - sortingArr.indexOf(b.id);
  });

  return {
    props: {
      ...i18n,
      timeseries_chart: data2.data.timeseries,
      heatmap_chart: heatmap_chart,
      barmeter_chart: data2.data.bar_chart,
      choropleth_malaysia: data2.data.choropleth_malaysia,
      choropleth_world: data2.data.choropleth_world,
    },
  };
};

export default CovidNowDataIndex;
