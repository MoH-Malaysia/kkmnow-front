import { InferGetStaticPropsType, GetStaticProps } from "next";
import { get } from "@lib/api";
import { Page } from "@lib/types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import PekaB40Dashboard from "@dashboards/peka-b40";
import Metadata from "@components/Metadata";

const PekaB40: Page = ({
  timeseries_screenrate,
  heatmap_screenrate,
  bar_age,
  choropleth_malaysia_peka_b40,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <Metadata title={"Peka B40"} keywords={""} />
      <PekaB40Dashboard
        timeseries_screenrate={timeseries_screenrate}
        heatmap_screenrate={heatmap_screenrate}
        bar_age={bar_age}
        choropleth_malaysia_peka_b40={choropleth_malaysia_peka_b40}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(locale!, ["common"]);

  const { data } = await get("/kkmnow", { dashboard: "peka_b40", state: "mys" });
  console.log(data);
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
