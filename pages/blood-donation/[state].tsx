/**
 * Blood Donation Page <State>
 */
import { Metadata } from "@components/index";
import BloodDonationDashboard from "@dashboards/blood-donation";
import { get } from "@lib/api";
import { STATES } from "@lib/constants";
import { Page } from "@lib/types";
import { DateTime } from "luxon";
import { InferGetStaticPropsType, GetStaticProps, GetStaticPaths } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const BloodDonationState: Page = ({
  timeseries_all,
  timeseries_bloodstock,
  timeseries_facility,
  heatmap_bloodstock,
  heatmap_donorrate,
  heatmap_retention,
  barchart_age,
  barchart_time,
  barchart_variables,
  map_facility,
  choropleth_malaysia_blood_donation,
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
        barchart_variables={barchart_variables}
        choropleth_malaysia_blood_donation={choropleth_malaysia_blood_donation}
      />
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async ctx => {
  const paths = STATES.filter(item => !["pjy", "pls", "lbn", "kvy"].includes(item.key)).map(
    state => {
      return {
        params: {
          state: state.key,
        },
      };
    }
  );
  return {
    paths: paths,
    fallback: false, // can also be true or 'blocking'
  };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const i18n = await serverSideTranslations(locale!, ["common"]);
  const { data } = await get("/kkmnow", { dashboard: "blood_donation", state: params?.state }); // fetch static data here

  // transfrom:
  Object.values(data.heatmap_retention).forEach((item: any) => {
    item.data = item.data.filter((_item: any) => _item.y !== null);
  });

  data.bar_chart_time.monthly.x = data.bar_chart_time.monthly.x.map((item: any) => {
    const period = DateTime.fromFormat(item, "yyyy-MM-dd");
    return period.monthShort !== "Jan" ? period.monthShort : period.year.toString();
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
      barchart_age: data.bar_chart_age,
      barchart_time: data.bar_chart_time,
      barchart_variables: data.barchart_key_variables,
      map_facility: data.map_facility,
      choropleth_malaysia_blood_donation: data.choropleth_malaysia,
    },
  };
};

export default BloodDonationState;
