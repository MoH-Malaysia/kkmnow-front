/**
 * Blood Donation Page <Index>
 */
import { Metadata } from "@components/index";
import BloodDonationDashboard from "@dashboards/blood-donation";
import { get } from "@lib/api";
import { Page } from "@lib/types";
import { InferGetStaticPropsType, GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const BloodDonationIndex: Page = ({
  timeseries_all,
  timeseries_bloodstock,
  timeseries_facility,
  heatmap_bloodstock,
  heatmap_donorrate,
  heatmap_retention,
  barchart_age,
  barchart_time,
  map_facility,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <Metadata title={"Blood Donation"} keywords={""} />
      <BloodDonationDashboard
        timeseries_all={timeseries_all}
        timeseries_bloodstock={timeseries_bloodstock}
        timeseries_facility={timeseries_facility}
        heatmap_bloodstock={heatmap_bloodstock}
        heatmap_donorrate={heatmap_donorrate}
        heatmap_retention={heatmap_retention}
        barchart_age={barchart_age}
        barchart_time={barchart_time}
        map_facility={map_facility}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(locale!, ["common"]);
  const { data } = await get("/kkmnow", { dashboard: "blood_donation", state: "mys" }); // fetch static data here

  // transfrom:
  Object.values(data.heatmap_retention).forEach((item: any) => {
    item.data = item.data.filter((_item: any) => _item.y !== null);
  });

  return {
    props: {
      ...i18n,
      timeseries_all: data.timeseries_all,
      timeseries_bloodstock: data.timeseries_bloodstock,
      timeseries_facility: data.timeseries_facility,
      heatmap_donorrate: data.heatmap_donorrate,
      heatmap_bloodstock: Object.values(data.heatmap_bloodstock),
      heatmap_retention: Object.values(data.heatmap_retention),
      barchart_age: data.barchart_age,
      barchart_time: data.barchart_time,
      map_facility: data.map_facility,
    },
  };
};

export default BloodDonationIndex;
