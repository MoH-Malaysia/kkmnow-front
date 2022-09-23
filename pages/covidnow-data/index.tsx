/**
 * Organ Donation Page <Index>
 */
import { InferGetStaticPropsType, GetStaticProps } from "next";
import OrganDonationDashboard from "@dashboards/organ-donation";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const OrganDonationIndex = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <OrganDonationDashboard></OrganDonationDashboard>
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

export default OrganDonationIndex;
