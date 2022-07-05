import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import type { InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import type { Page, ReactElement } from "@lib/types";
import { AREA_TYPES } from "@dashboards/kawasanku/lib/constants";

import KawasankuLayout from "@dashboards/kawasanku/components/Layout";
import SectionHeading from "@dashboards/kawasanku/components/SectionHeading";
import JitterplotSection from "@dashboards/kawasanku/components/JitterplotSection";
import ChoroplethSection from "@dashboards/kawasanku/components/ChoroplethSection";

const Kawasanku: Page = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation("kawasanku");

  // TODO (@itschrislow): replace example data with real data from API
  let data: any = {};

  Array(28)
    .fill(0)
    .forEach((_, i) => {
      data[`metric_${i + 1}`] = Array(50)
        .fill(0)
        .map(() => ({
          id: `Metric ${i + 1}`,
          data: [
            {
              x: (Math.random() < 0.5 ? -1 : 1) * Math.random(),
              y: Math.random() * 10,
            },
          ],
        }));
    });

  return (
    <div className="divide-y">
      <div className="py-6">
        <SectionHeading>
          {t("section1_title1")} <span className="capitalize underline">{t("malaysia")}</span>{" "}
          {t("section1_title2")}
        </SectionHeading>
      </div>
      <JitterplotSection areaType={AREA_TYPES.State} data={data} comparisons={[]} />
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
