/**
 * Blood Donation Page <State>
 */
import { Layout, Metadata, StateDropdown } from "@components/index";
import BloodDonationDashboard from "@dashboards/blood-donation";
import { get } from "@lib/api";
import { CountryAndStates, STATES } from "@lib/constants";
import { routes } from "@lib/routes";
import { Page } from "@lib/types";
import { DateTime } from "luxon";
import { InferGetStaticPropsType, GetStaticProps, GetStaticPaths } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";

const BloodDonationState: Page = ({
  last_updated,
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
  state,
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
      <Metadata
        title={CountryAndStates[state].concat(" - ", t("nav.megamenu.dashboards.blood_donation"))}
        keywords={""}
      />
      <BloodDonationDashboard
        last_updated={last_updated}
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
        map_facility={map_facility}
        barchart_variables={barchart_variables}
        choropleth_malaysia_blood_donation={choropleth_malaysia_blood_donation}
      />
    </>
  );
};

BloodDonationState.layout = page => (
  <Layout
    stateSelector={
      <StateDropdown
        url={routes.BLOOD_DONATION}
        currentState={(useRouter().query.state as string) ?? "mys"}
        exclude={["pjy", "pls", "lbn", "kvy"]}
        hideOnScroll
      />
    }
  >
    {page}
  </Layout>
);

export const getStaticPaths: GetStaticPaths = async ctx => {
  let paths: Array<any> = [];
  STATES.filter(item => !["pjy", "pls", "lbn", "kvy"].includes(item.key)).forEach(state => {
    paths = paths.concat([
      {
        params: {
          state: state.key,
        },
      },
      {
        params: {
          state: state.key,
        },
        locale: "ms-MY",
      },
    ]);
  });
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
      last_updated: new Date().valueOf(),
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
      state: params?.state,
      choropleth_malaysia_blood_donation: data.choropleth_malaysia,
    },
  };
};

export default BloodDonationState;
