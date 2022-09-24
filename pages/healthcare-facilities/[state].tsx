/**
 * Healthcare Facilities Page <State>
 */
import HealthcareFacilitiesDashboard from "@dashboards/healthcare-facilities";
import { STATES } from "@lib/constants";
import { Page } from "@lib/types";
import { InferGetStaticPropsType, GetStaticProps, GetStaticPaths } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const HealthcareFacilitiesState: Page = ({
  facilities_list,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <HealthcareFacilitiesDashboard facilities_list={facilities_list} />
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async ctx => {
  const paths = STATES.filter(item => !["pjy", "pls", "lbn", "kvy"].includes(item.key)).map(
    state => {
      return {
        params: {
          state: state.key,
        },
      };
    }
  );
  return {
    paths: paths,
    fallback: false, // can also be true or 'blocking'
  };
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(locale!, ["common"]);
  //   const { data } = await get("/kkmnow", { dashboard: "blood_donation", state: "mys" }); // fetch static data here
  const data = {
    facilities: [
      {
        state: "jhr",
        district: "Muar",
        sector: "Government",
        type: "Hospital",
        name: "Kelana Jaya Medical Centre",
        add: "No. 1 FAS Business Aveneue, Jalan SS7, 47301 Petaling Jaya, Selangor",
        phone: "03-7805 2111",
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
export default HealthcareFacilitiesState;
