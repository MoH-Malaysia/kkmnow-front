/**
 * Blood Donation Page <Index>
 */
import { Metadata } from "@components/index";
import BloodDonationDashboard from "@dashboards/blood-donation";
import { get } from "@lib/api";
import { Page } from "@lib/types";
import { InferGetStaticPropsType, GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { DateTime } from "luxon";
import { useTranslation } from "next-i18next";

const BloodDonationIndex: Page = ({
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
  const { t } = useTranslation("common");
  let abs: any[] = [],
    capita: any[] = [],
    perc: any[] = [];
  heatmap_donorrate.abs.male.data.forEach((item: any, index: number) => {
    if (item.x === "Overall") return;
    abs.push({
      id: item.x,
      data: [
        {
          x: t("blood.male"),
          y: item.y,
        },
        {
          x: t("blood.female"),
          y: heatmap_donorrate.abs.female.data[index].y,
        },
        {
          x: t("blood.overall"),
          y: heatmap_donorrate.abs.male.data[index].y + heatmap_donorrate.abs.female.data[index].y,
        },
      ],
    });
    capita.push({
      id: item.x,
      data: [
        {
          x: t("blood.male"),
          y: heatmap_donorrate.capita.male.data[index].y,
        },
        {
          x: t("blood.female"),
          y: heatmap_donorrate.capita.female.data[index].y,
        },
        {
          x: t("blood.overall"),
          y:
            heatmap_donorrate.capita.female.data[index].y +
            heatmap_donorrate.capita.male.data[index].y,
        },
      ],
    });
    perc.push({
      id: item.x,
      data: [
        {
          x: t("blood.male"),
          y: heatmap_donorrate.perc.male.data[index].y,
        },
        {
          x: t("blood.female"),
          y: heatmap_donorrate.perc.female.data[index].y,
        },
        {
          x: t("blood.overall"),
          y:
            heatmap_donorrate.perc.female.data[index].y + heatmap_donorrate.perc.male.data[index].y,
        },
      ],
    });
  });
  return (
    <>
      <Metadata title={t("nav.megamenu.dashboards.blood_donation")} keywords={""} />
      <BloodDonationDashboard
        timeseries_all={timeseries_all}
        timeseries_bloodstock={timeseries_bloodstock}
        timeseries_facility={timeseries_facility}
        heatmap_bloodstock={heatmap_bloodstock}
        heatmap_donorrate={{
          abs,
          perc,
          capita,
        }}
        heatmap_retention={heatmap_retention}
        barchart_age={barchart_age}
        barchart_time={barchart_time}
        barchart_variables={barchart_variables}
        map_facility={map_facility}
        choropleth_malaysia_blood_donation={choropleth_malaysia_blood_donation}
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

  data.bar_chart_time.monthly.x = data.bar_chart_time.monthly.x.map((item: any) => {
    const period = DateTime.fromFormat(item, "yyyy-MM-dd");
    return period.monthShort !== "Jan" ? period.monthShort : period.year.toString();
  });

  let abs: any[] = [];
  let capita: any[] = [];
  let perc: any[] = [];

  console.log(abs);

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

export default BloodDonationIndex;
