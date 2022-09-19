/**
 * Blood Donation Page <Index>
 */
import BloodDonationDashboard from "@dashboards/blood-donation";
import { InferGetStaticPropsType, GetStaticProps } from "next";

const BloodDonationIndex = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <BloodDonationDashboard></BloodDonationDashboard>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ctx => {
  // const { data } = await post("") // fetch static data here

  return {
    props: {},
  };
};

export default BloodDonationIndex;
