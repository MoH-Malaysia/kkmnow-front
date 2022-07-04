import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import type { InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import type { Page, ReactElement } from "@lib/types";

import KawasankuLayout from "dashboards/kawasanku/Layout";
import SectionHeading from "dashboards/kawasanku/SectionHeading";

const Kawasanku: Page = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation("kawasanku");

  return (
    <>
      <SectionHeading>
        {t("section1_title1")} <span className="capitalize underline">{t("malaysia")}</span>{" "}
        {t("section1_title2")}
      </SectionHeading>
      <SectionHeading>{t("section2_title1")}</SectionHeading>
      <SectionHeading>{t("section3_title")}</SectionHeading>
    </>
  );
};

Kawasanku.layout = (page: ReactElement) => {
  return <KawasankuLayout>{page}</KawasankuLayout>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const translation = await serverSideTranslations(locale!, ["common", "kawasanku"]);

  return {
    props: {
      ...translation,
    },
  };
};

export default Kawasanku;
