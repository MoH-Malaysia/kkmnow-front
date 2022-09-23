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
  // const { data } = await get("/kkmnow", { dashboard: "blood_donation", state: "mys" }); // fetch static data here
  const data2 = await get("/kkmnow", { dashboard: "covid_now" }); // fetch static data here
  // transfrom:
  Object.values(data2.data.heatmap_chart).forEach((item: any) => {
    item.data = item.data.filter((_item: any) => _item.y !== null);
  });
  // pending array sorting for monday to sunday
  console.log(data2);

  return {
    props: {
      ...i18n,
      timeseries_chart: data2.data.timeseries_chart,
      heatmap_chart: Object.values(data2.data.heatmap_chart),
      barmeter_chart: data2.data.bar_chart,
      // timeseries_all: data.timeseries_all,
      // timeseries_bloodstock: data.timeseries_bloodstock,
      // heatmap_donorrate: data.heatmap_donorrate,
      // heatmap_bloodstock: Object.values(data.heatmap_bloodstock),
      // heatmap_retention: Object.values(data.heatmap_retention),
      // barchart_age: data.barchart_age,
      // barchart_time: data.barchart_time,
    },
  };
};

export default BloodDonationIndex;
