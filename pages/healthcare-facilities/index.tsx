/**
 * Healthcare Facilities Page
 */
import { Metadata } from "@components/index";
import HealthcareFacilitiesDashboard from "@dashboards/healthcare-facilities";
import { get } from "@lib/api";
import { Page } from "@lib/types";
import { InferGetStaticPropsType, GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const HealthcareFacilitiesIndex: Page = ({
  facility_table,
  state_district_mapping,
  facility_types,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <Metadata title={"Healthcare Facilities"} keywords={""} />
      <HealthcareFacilitiesDashboard
        facility_table={facility_table}
        state_district_mapping={state_district_mapping}
        facility_types={facility_types}
      />
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
      state_district_mapping: data.helpers.state_district_mapping,
      facility_types: data.helpers.facility_types,
    },
  };
};

export default HealthcareFacilitiesIndex;
