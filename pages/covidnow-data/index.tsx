/**
 * CovidNow Data Page <Index>
 */
import { Metadata } from "@components/index";
import CovidNowDashboard from "@dashboards/covidnow-data";
import { get } from "@lib/api";
import { Page } from "@lib/types";
import { InferGetStaticPropsType, GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const CovidNowDataIndex: Page = ({
  last_updated,
  timeseries_chart,
  heatmap_chart,
  barmeter_chart,
  choropleth_malaysia,
  choropleth_world,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation();
  const final = heatmap_chart.map((item: any) => {
    return {
      ...item,
      id: t(`covidnow.days.${item.id}`),
    };
  });
  return (
    <>
      <Metadata title={t("nav.megamenu.dashboards.covidnow_data")} keywords={""} />

      <CovidNowDashboard
        last_updated={last_updated}
        timeseries_chart={timeseries_chart}
        heatmap_chart={final}
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
  let heatmap_chart = Object.values(data2.data.heatmap).sort((a: any, b: any) => {
    return sortingArr.indexOf(a.id) - sortingArr.indexOf(b.id);
  });
  return {
    props: {
      ...i18n,
      last_updated: new Date().valueOf(),
      timeseries_chart: data2.data.timeseries,
      heatmap_chart: heatmap_chart,
      barmeter_chart: data2.data.bar_chart,
      choropleth_malaysia: data2.data.choropleth_malaysia,
      choropleth_world: data2.data.choropleth_world,
    },
  };
};

export default CovidNowDataIndex;
