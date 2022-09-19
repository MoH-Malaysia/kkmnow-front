/**
 * Covid Page <Index>
 */
import CovidDashboard from "@dashboards/covid";
import { InferGetStaticPropsType, GetStaticProps } from "next";

const CovidIndex = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <CovidDashboard></CovidDashboard>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ctx => {
  // const { data } = await post("") // fetch static data here

  return {
    props: {},
  };
};

export default CovidIndex;
