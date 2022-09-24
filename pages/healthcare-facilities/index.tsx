/**
 * Healthcare Facilities Page
 */
import HealthcareFacilitiesDashboard from "@dashboards/healthcare-facilities";
import { get } from "@lib/api";
import { Page } from "@lib/types";
import { InferGetStaticPropsType, GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const HealthcareFacilitiesIndex: Page = ({
  facilities_list,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <HealthcareFacilitiesDashboard facilities_list={facilities_list} />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(locale!, ["common"]);
  //   const { data } = await get("/kkmnow", { dashboard: "blood_donation", state: "mys" }); // fetch static data here
  const data = {
    facilities: [
      {
        state: "jhr",
        district: "muar",
        sector: "Government",
      },
    ],
  };
  return {
    props: {
      ...i18n,
      facilities_list: data.facilities,
    },
  };
};

export default HealthcareFacilitiesIndex;
