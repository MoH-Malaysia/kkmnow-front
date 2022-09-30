import { InferGetStaticPropsType, GetStaticProps, GetStaticPaths } from "next";
import { get } from "@lib/api";
import { Page } from "@lib/types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import PekaB40Dashboard from "@dashboards/peka-b40";
import { STATES } from "@lib/constants";
import Metadata from "@components/Metadata";

const PekaB40State: Page = ({
  timeseries_screenrate,
  heatmap_screenrate,
  bar_age,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <Metadata title={"Peka B40"} keywords={""} />
      <PekaB40Dashboard
        timeseries_screenrate={timeseries_screenrate}
        heatmap_screenrate={heatmap_screenrate}
        bar_age={bar_age}
      />
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = STATES.filter(item => !["kvy"].includes(item.key)).map(state => {
    return {
      params: {
        state: state.key,
      },
    };
  });
  return {
    paths: paths,
    fallback: false, // can also be true or 'blocking'
  };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const i18n = await serverSideTranslations(locale!, ["common"]);

  const { data } = await get("/kkmnow", { dashboard: "peka_b40", state: params?.state });

  return {
    props: {
      ...i18n,
      timeseries_screenrate: data.timeseries,
      heatmap_screenrate: data.heatmap_screenrate,
      bar_age: data.barchart_ages,
    },
  };
};

export default PekaB40State;
