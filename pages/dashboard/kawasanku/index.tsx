import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import type { InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import type { Page, ReactElement } from "@lib/types";

import KawasankuLayout from "@dashboards/kawasanku/components/Layout";
import SectionHeading from "@dashboards/kawasanku/components/SectionHeading";
import ChoroplethSection from "@dashboards/kawasanku/components/ChoroplethSection";

const Kawasanku: Page = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation("kawasanku");

  return (
    <div className="divide-y">
      <div className="py-6">
        <SectionHeading>
          {t("section1_title1")} <span className="capitalize underline">{t("malaysia")}</span>{" "}
          {t("section1_title2")}
        </SectionHeading>
      </div>
      <div className="py-6">
        <SectionHeading>{t("section2_title1")}</SectionHeading>
      </div>
      <ChoroplethSection />
    </div>
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
