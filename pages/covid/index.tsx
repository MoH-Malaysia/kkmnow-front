/**
 * Covid Page <Index>
 */
import CovidDashboard from "@dashboards/covid";
import { InferGetStaticPropsType, GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const CovidIndex = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <CovidDashboard></CovidDashboard>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(locale!, ["common"]);

  // const { data } = await post("") // fetch static data here

  return {
    props: { ...i18n },
  };
};

export default CovidIndex;
