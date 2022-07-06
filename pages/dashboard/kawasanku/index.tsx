import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import type { Page, ReactElement } from "@lib/types";
import { AREA_TYPES } from "@dashboards/kawasanku/lib/constants";

import KawasankuLayout from "@dashboards/kawasanku/components/Layout";
import JitterplotSection from "@dashboards/kawasanku/components/JitterplotSection";
import ChoroplethSection from "@dashboards/kawasanku/components/ChoroplethSection";
import DemographicSection from "@dashboards/kawasanku/components/DemographicSection";

const Kawasanku: Page = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  // TODO (@itschrislow): replace example data with real data from API
  let jitteplotData: any = {};

  Array(28)
    .fill(0)
    .forEach((_, i) => {
      jitteplotData[`metric_${i + 1}`] = Array(50)
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

  let pyramidChartData = Array(20)
    .fill(0)
    .map((_, i) => ({
      id: `${i * 5} - ${i * 5 + 5 - 1}`,
      male: Math.floor(Math.random() * -500000),
      female: Math.floor(Math.random() * 500000),
    }));

  pyramidChartData.push({
    id: `100+`,
    male: Math.floor(Math.random() * -500000),
    female: Math.floor(Math.random() * 500000),
  });

  let snapshotArr = [
    Array(2)
      .fill(0)
      .map((_, i) => ({
        id: `Key ${i + 1}`,
        value: (Math.random() * 100).toFixed(1),
      })),
    Array(3)
      .fill(0)
      .map((_, i) => ({
        id: `Key ${i + 1}`,
        value: (Math.random() * 100).toFixed(1),
      })),
    Array(2)
      .fill(0)
      .map((_, i) => ({
        id: `Key ${i + 1}`,
        value: (Math.random() * 100).toFixed(1),
      })),
    Array(4)
      .fill(0)
      .map((_, i) => ({
        id: `Key ${i + 1}`,
        value: (Math.random() * 100).toFixed(1),
      })),
    Array(6)
      .fill(0)
      .map((_, i) => ({
        id: `Key ${i + 1}`,
        value: (Math.random() * 100).toFixed(1),
      })),
    Array(4)
      .fill(0)
      .map((_, i) => ({
        id: `Key ${i + 1}`,
        value: (Math.random() * 100).toFixed(1),
      })),
  ];

  return (
    <div className="divide-y">
      <DemographicSection pyramidChartData={pyramidChartData} snapshotData={snapshotArr} />
      <JitterplotSection areaType={AREA_TYPES.State} data={jitteplotData} />
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
