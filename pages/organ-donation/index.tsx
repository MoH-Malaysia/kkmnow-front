/**
 * Organ Donation Page <Index>
 */
import { InferGetStaticPropsType, GetStaticProps } from "next";
import OrganDonationDashboard from "@dashboards/organ-donation";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Layout, Metadata, StateDropdown, StateModal } from "@components/index";
import { get } from "@lib/api";
import { DateTime } from "luxon";
import { useTranslation } from "next-i18next";
import { routes } from "@lib/routes";
import { ReactElement, JSXElementConstructor } from "react";

const OrganDonationIndex = ({
  last_updated,
  timeseries_pledge,
  bar_age,
  bar_time,
  bar_reasons,
  heatmap_donorrate,
  choropleth_malaysia_organ_donation,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation();
  let abs: any[] = [],
    capita: any[] = [],
    perc: any[] = [];
  heatmap_donorrate.data.abs.male.data.forEach((item: any, index: number) => {
    abs.push({
      id: item.x === "Overall" ? t("blood.overall") : item.x,
      data: [
        {
          x: t("blood.male"),
          y: item.y,
        },
        {
          x: t("blood.female"),
          y: heatmap_donorrate.data.abs.female.data[index].y,
        },
        {
          x: t("blood.overall"),
          y:
            heatmap_donorrate.data.abs.male.data[index].y +
            heatmap_donorrate.data.abs.female.data[index].y,
        },
      ],
    });
    capita.push({
      id: item.x === "Overall" ? t("blood.overall") : item.x,
      data: [
        {
          x: t("blood.male"),
          y: heatmap_donorrate.data.capita.male.data[index].y,
        },
        {
          x: t("blood.female"),
          y: heatmap_donorrate.data.capita.female.data[index].y,
        },
        {
          x: t("blood.overall"),
          y:
            heatmap_donorrate.data.capita.female.data[index].y +
            heatmap_donorrate.data.capita.male.data[index].y,
        },
      ],
    });
    perc.push({
      id: item.x === "Overall" ? t("blood.overall") : item.x,
      data: [
        {
          x: t("blood.male"),
          y: heatmap_donorrate.data.perc.male.data[index].y,
        },
        {
          x: t("blood.female"),
          y: heatmap_donorrate.data.perc.female.data[index].y,
        },
        {
          x: t("blood.overall"),
          y:
            heatmap_donorrate.data.perc.female.data[index].y +
            heatmap_donorrate.data.perc.male.data[index].y,
        },
      ],
    });
  });
  return (
    <>
      <Metadata
        title={t("nav.megamenu.dashboards.organ_donation")}
        description={t("organ.title_description")}
        keywords={""}
      />
      <OrganDonationDashboard
        last_updated={last_updated}
        timeseries_pledge={timeseries_pledge}
        bar_age={bar_age}
        bar_time={bar_time}
        bar_reasons={bar_reasons}
        heatmap_donorrate={{
          data_as_of: heatmap_donorrate.data.data_as_of,
          data: {
            abs,
            perc,
            capita,
          },
        }}
        choropleth_malaysia_organ_donation={choropleth_malaysia_organ_donation}
      />
    </>
  );
};

OrganDonationIndex.layout = (page: ReactElement<any, string | JSXElementConstructor<any>>) => (
  <Layout
    stateSelector={
      <StateDropdown
        url={routes.ORGAN_DONATION}
        currentState={"mys"}
        exclude={["kvy"]}
        hideOnScroll
      />
    }
  >
    <StateModal url={routes.ORGAN_DONATION} exclude={["kvy"]} />
    {page}
  </Layout>
);

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(locale!, ["common"]);

  const { data } = await get("/kkmnow", { dashboard: "organ_donation", state: "mys" });

  // transform:
  data.barchart_time.data.monthly.x = data.barchart_time.data.monthly.x.map((item: any) => {
    const period = DateTime.fromFormat(item, "yyyy-MM-dd");
    return period.monthShort !== "Jan" ? period.monthShort : period.year.toString();
  });

  return {
    props: {
      ...i18n,
      last_updated: new Date().valueOf(),
      timeseries_pledge: data.timeseries,
      bar_age: data.barchart_age,
      bar_time: data.barchart_time,
      bar_reasons: data.barchart_reasons,
      heatmap_donorrate: data.heatmap_pledgerrate,
      choropleth_malaysia_organ_donation: data.choropleth_malaysia,
    },
    revalidate: 300,
  };
};

export default OrganDonationIndex;
