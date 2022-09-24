/**
 * Blood Donation Page <Index>
 */
import CovidNowDashboard from "@dashboards/covidnow-data";
import { get } from "@lib/api";
import { Page } from "@lib/types";
import { InferGetStaticPropsType, GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const BloodDonationIndex: Page = ({
  timeseries_chart,
  heatmap_chart,
  barmeter_chart,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <CovidNowDashboard
        timeseries_chart={timeseries_chart}
        heatmap_chart={heatmap_chart}
        barmeter_chart={barmeter_chart}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(locale!, ["common"]);

  const data2 = await get("/kkmnow", { dashboard: "covid_now" }); // fetch static data here

  // transfrom:
  Object.values(data2.data.heatmap_chart).forEach((item: any) => {
    item.data = item.data.filter((_item: any) => _item.y !== null);
  });
  // TODO: Toogle between table for choropleth map
  // TODO: pending array sorting for monday to sunday
  console.log(data2);

  return {
    props: {
      ...i18n,
      timeseries_chart: data2.data.timeseries_chart,
      heatmap_chart: Object.values(data2.data.heatmap_chart),
      barmeter_chart: data2.data.bar_chart,
    },
  };
};

export default BloodDonationIndex;
