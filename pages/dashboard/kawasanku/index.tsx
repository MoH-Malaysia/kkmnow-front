import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { get } from "@lib/api";
import type { Page, ReactElement } from "@lib/types";
import { DASHBOARDS, MALAYSIA } from "@lib/constants";
import { IKawasankuDashboard } from "@dashboards/kawasanku/lib/types";
import { AREA_TYPES } from "@dashboards/kawasanku/lib/constants";

import KawasankuLayout from "@dashboards/kawasanku/components/Layout";
import JitterplotSection from "@dashboards/kawasanku/components/JitterplotSection";
import ChoroplethSection from "@dashboards/kawasanku/components/ChoroplethSection";
import DemographicSection from "@dashboards/kawasanku/components/DemographicSection";

const Kawasanku: Page = ({
  pyramidChartData,
  snapshotData,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
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

  return (
    <div className="divide-y">
      <DemographicSection pyramidChartData={pyramidChartData} snapshotData={snapshotData} />
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

  const data = await get<IKawasankuDashboard>("DO", "/dashboard", {
    dashboard: DASHBOARDS.KAWASANKU,
    location: MALAYSIA.key,
  });

  const pyramidChartData = data.pyramid_chart.population_age;
  const snapshotData = data.bar_chart;

  return {
    props: {
      ...translation,
      pyramidChartData,
      snapshotData,
    },
  };
};

export default Kawasanku;
