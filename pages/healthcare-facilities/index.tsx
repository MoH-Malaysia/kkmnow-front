/**
 * Healthcare Facilities Page
 */
import HealthcareFacilitiesDashboard from "@dashboards/healthcare-facilities";
import { get } from "@lib/api";
import { Page } from "@lib/types";
import { InferGetStaticPropsType, GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const HealthcareFacilitiesIndex: Page = ({
  facility_table,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <HealthcareFacilitiesDashboard facility_table={facility_table} />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(locale!, ["common"]);
  const { data } = await get("/kkmnow", { dashboard: "facilities" }); // fetch static data here

  return {
    props: {
      ...i18n,
      facility_table: data.facility_table,
    },
  };
};

export default HealthcareFacilitiesIndex;
