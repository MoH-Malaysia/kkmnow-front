/**
 * Organ Donation Page <Index>
 */
import { InferGetStaticPropsType, GetStaticProps } from "next";
import OrganDonationDashboard from "@dashboards/organ-donation";

const OrganDonationIndex = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <OrganDonationDashboard></OrganDonationDashboard>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ctx => {
  // const { data } = await post("") // fetch static data here

  return {
    props: {},
  };
};

export default OrganDonationIndex;
