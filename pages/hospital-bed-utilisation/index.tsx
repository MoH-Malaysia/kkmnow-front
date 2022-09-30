import { Metadata } from "@components/index";
import HospitalBedUtilisationDashboard from "@dashboards/hospital-bed-utilisation";
import { get } from "@lib/api";
import { Page } from "@lib/types";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const HospitalBedUtilisationPage: Page = ({
  choropleth_bed,
  table_facility,
  timeseries_facility,
  timeseries_state,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <Metadata title={"Hospital Bed Utilisation"} keywords={""} />
      <HospitalBedUtilisationDashboard
        choropleth_bed={choropleth_bed}
        table_facility={table_facility}
        timeseries_facility={timeseries_facility}
        timeseries_state={timeseries_state}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(locale!, ["common"]);

  const { data } = await get("/kkmnow", { dashboard: "bed_util", state: "mys" });

  return {
    props: {
      ...i18n,
      choropleth_bed: data.table_state,
      table_facility: data.table_facility,
      timeseries_facility: data.timeseries_facility,
      timeseries_state: data.table_state,
    },
  };
};

export default HospitalBedUtilisationPage;
