import { InferGetStaticPropsType, GetStaticProps } from "next";
import { get } from "@lib/api";
import { Page } from "@lib/types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import PekaB40Dashboard from "@dashboards/peka-b40";
import Metadata from "@components/Metadata";
import { useTranslation } from "next-i18next";

const PekaB40: Page = ({
  timeseries_screenrate,
  heatmap_screenrate,
  bar_age,
  choropleth_malaysia_peka_b40,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation();
  let abs: any[] = [],
    capita: any[] = [],
    perc: any[] = [];
  heatmap_screenrate.abs.male.data.forEach((item: any, index: number) => {
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
          y: heatmap_screenrate.abs.female.data[index].y,
        },
        {
          x: t("blood.overall"),
          y:
            heatmap_screenrate.abs.male.data[index].y + heatmap_screenrate.abs.female.data[index].y,
        },
      ],
    });
    capita.push({
      id: item.x,
      data: [
        {
          x: t("blood.male"),
          y: heatmap_screenrate.capita.male.data[index].y,
        },
        {
          x: t("blood.female"),
          y: heatmap_screenrate.capita.female.data[index].y,
        },
        {
          x: t("blood.overall"),
          y:
            heatmap_screenrate.capita.female.data[index].y +
            heatmap_screenrate.capita.male.data[index].y,
        },
      ],
    });
    perc.push({
      id: item.x,
      data: [
        {
          x: t("blood.male"),
          y: heatmap_screenrate.perc.male.data[index].y,
        },
        {
          x: t("blood.female"),
          y: heatmap_screenrate.perc.female.data[index].y,
        },
        {
          x: t("blood.overall"),
          y:
            heatmap_screenrate.perc.female.data[index].y +
            heatmap_screenrate.perc.male.data[index].y,
        },
      ],
    });
  });
  return (
    <>
      <Metadata title={t("nav.megamenu.dashboards.peka_b40")} keywords={""} />
      <PekaB40Dashboard
        timeseries_screenrate={timeseries_screenrate}
        heatmap_screenrate={{
          abs,
          perc,
          capita,
        }}
        bar_age={bar_age}
        choropleth_malaysia_peka_b40={choropleth_malaysia_peka_b40}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(locale!, ["common"]);

  const { data } = await get("/kkmnow", { dashboard: "peka_b40", state: "mys" });
  return {
    props: {
      ...i18n,
      timeseries_screenrate: data.timeseries,
      heatmap_screenrate: data.heatmap_screenrate,
      bar_age: data.barchart_ages,
      choropleth_malaysia_peka_b40: data.choropleth_malaysia,
    },
  };
};

export default PekaB40;
