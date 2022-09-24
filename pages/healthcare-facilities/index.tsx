/**
 * Healthcare Facilities Page
 */
import HealthcareFacilitiesDashboard from "@dashboards/healthcare-facilities";
import { get } from "@lib/api";
import { Page } from "@lib/types";
import { InferGetStaticPropsType, GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const HealthcareFacilitiesIndex: Page = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <HealthcareFacilitiesDashboard />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(locale!, ["common"]);
  //   const { data } = await get("/kkmnow", { dashboard: "blood_donation", state: "mys" }); // fetch static data here

  return {
    props: {
      ...i18n,
    },
  };
};

export default HealthcareFacilitiesIndex;
