import dynamic from "next/dynamic";
import { BarDatum } from "@nivo/bar";
import { FunctionComponent } from "react";
import { useTranslation } from "next-i18next";

import { IBarChartData } from "@lib/types";
import { IPyramidChartData } from "@dashboards/kawasanku/lib/types";

import ChartTitle from "./ChartTitle";
import SectionHeading from "../SectionHeading";

const BarChart = dynamic(() => import("./BarChart"), { ssr: false });
const PyramidChart = dynamic(() => import("./PyramidChart"), { ssr: false });

type DemographicSectionProps = {
  snapshotData: IBarChartData;
  pyramidChartData: BarDatum[] extends IPyramidChartData[] ? IPyramidChartData[] : BarDatum[];
};

const DemographicSection: FunctionComponent<DemographicSectionProps> = ({
  snapshotData,
  pyramidChartData,
}) => {
  const { t } = useTranslation("kawasanku");

  // TODO: define this is metadata file
  const snapshotTranslationPrefix = "snapshot";

  return (
    <div className="py-12 md:py-6">
      <SectionHeading>
        {t("section1_title1")} <span className="capitalize underline">{t("malaysia")}</span>{" "}
        {t("section1_title2")}
      </SectionHeading>
      <div className="flex w-full flex-col gap-12 lg:flex-row">
        {/* POPULATION PYRAMID CHART */}
        <div className="w-full lg:w-1/4">
          <ChartTitle>{t("pyramid.title")}</ChartTitle>
          <PyramidChart data={pyramidChartData} />
        </div>
        {/* SNAPSHOT BAR CHARTS */}
        <div className="grid w-full grid-cols-1 gap-12 md:grid-cols-3 lg:w-3/4">
          <BarChart
            title={t(`snapshot.${snapshotData.sex.id}`)}
            data={snapshotData.sex.data}
            height={snapshotData.sex.data.length * 40 - 10}
            translationPrefix={snapshotTranslationPrefix}
          />
          <BarChart
            title={t(`snapshot.${snapshotData.ethnicity.id}`)}
            data={snapshotData.ethnicity.data}
            height={snapshotData.ethnicity.data.length * 40 - 10}
            translationPrefix={snapshotTranslationPrefix}
          />
          <BarChart
            title={t(`snapshot.${snapshotData.nationality.id}`)}
            data={snapshotData.nationality.data}
            height={snapshotData.nationality.data.length * 40 - 10}
            translationPrefix={snapshotTranslationPrefix}
          />
          <BarChart
            title={t(`snapshot.${snapshotData.agegroup.id}`)}
            data={snapshotData.agegroup.data}
            height={snapshotData.agegroup.data.length * 40 - 10}
            translationPrefix={snapshotTranslationPrefix}
          />
          <BarChart
            title={t(`snapshot.${snapshotData.religion.id}`)}
            data={snapshotData.religion.data}
            height={snapshotData.religion.data.length * 40 - 10}
            translationPrefix={snapshotTranslationPrefix}
          />
          <BarChart
            title={t(`snapshot.${snapshotData.marital.id}`)}
            data={snapshotData.marital.data}
            height={snapshotData.marital.data.length * 40 - 10}
            translationPrefix={snapshotTranslationPrefix}
          />
        </div>
      </div>
    </div>
  );
};

export default DemographicSection;
