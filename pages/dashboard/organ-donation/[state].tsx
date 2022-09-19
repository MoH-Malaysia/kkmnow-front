/**
 * Organ Donation Page <State>
 */
import OrganDonationDashboard from "@dashboards/organ-donation";
import { STATES } from "@lib/constants";
import { Page } from "@lib/types";
import { InferGetStaticPropsType, GetStaticProps, GetStaticPaths } from "next";

const OrganDonationState: Page = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <OrganDonationDashboard></OrganDonationDashboard>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async ctx => {
  const paths = STATES.map(state => {
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

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // const { data } = await post("") // fetch static data here

  return {
    props: {},
  };
};

export default OrganDonationState;
