/**
 * Healthcare Facilities Page <State>
 */
import HealthcareFacilitiesDashboard from "@dashboards/healthcare-facilities";
import { STATES } from "@lib/constants";
import { get } from "@lib/api";
import { Page } from "@lib/types";
import { InferGetStaticPropsType, GetStaticProps, GetStaticPaths } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const HealthcareFacilitiesState: Page = ({
  facility_table,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <HealthcareFacilitiesDashboard facility_table={facility_table} />
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async ctx => {
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
export default HealthcareFacilitiesState;
