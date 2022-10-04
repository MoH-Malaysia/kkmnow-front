/**
 * CovidNow Data Page <Index>
 */
import { Metadata } from "@components/index";
import CovidNowDashboard from "@dashboards/covidnow-data";
import { get } from "@lib/api";
import { sortMsiaFirst } from "@lib/helpers";
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
      <Metadata
        title={t("nav.megamenu.dashboards.covidnow_data")}
        description={t("covidnow.title_description")}
        keywords={""}
      />

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

  const { data } = await get("/kkmnow", { dashboard: "covid_now" }); // fetch static data here
  data.choropleth_malaysia = sortMsiaFirst(data.choropleth_malaysia, "state");

  const sortingArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let heatmap_chart = Object.values(data.heatmap).sort((a: any, b: any) => {
    return sortingArr.indexOf(a.id) - sortingArr.indexOf(b.id);
  });
  return {
    props: {
      ...i18n,
      last_updated: new Date().valueOf(),
      timeseries_chart: data.timeseries,
      heatmap_chart: heatmap_chart,
      barmeter_chart: data.bar_chart,
      choropleth_malaysia: data.choropleth_malaysia,
      choropleth_world: data.choropleth_world,
    },
    revalidate: 300,
  };
};

export default CovidNowDataIndex;
