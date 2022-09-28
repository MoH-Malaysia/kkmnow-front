import { Metadata } from "@components/index";
import HospitalBedUtilisationDashboard from "@dashboards/hospital-bed-utilisation";
import { Page } from "@lib/types";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const HospitalBedUtilisationPage: Page = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <Metadata title={"Hospital Bed Utilisation"} keywords={""} />
      <HospitalBedUtilisationDashboard />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(locale!, ["common"]);

  // const { data } = await  // your fetch function here

  return {
    props: {
      ...i18n,
    },
  };
};

export default HospitalBedUtilisationPage;
