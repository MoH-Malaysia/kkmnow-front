/**
 * Blood Donation Page <Index>
 */
import BloodDonationDashboard from "@dashboards/blood-donation";
import { Page } from "@lib/types";
import { InferGetStaticPropsType, GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const BloodDonationIndex: Page = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <BloodDonationDashboard></BloodDonationDashboard>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(locale!, ["common"]);

  // const { data } = await post("") // fetch static data here

  return {
    props: {
      ...i18n,
    },
  };
};

export default BloodDonationIndex;
