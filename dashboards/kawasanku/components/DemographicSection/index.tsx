import dynamic from "next/dynamic";
import { BarDatum } from "@nivo/bar";
import { FunctionComponent } from "react";
import { useTranslation } from "next-i18next";

import { IPyramidChartData } from "@dashboards/kawasanku/lib/types";

import ChartTitle from "./ChartTitle";
import SectionHeading from "../SectionHeading";

const BarChart = dynamic(() => import("./BarChart"), { ssr: false });
const PyramidChart = dynamic(() => import("./PyramidChart"), { ssr: false });

type DemographicSectionProps = {
  snapshotData: BarDatum[][];
  pyramidChartData: BarDatum[] extends IPyramidChartData[] ? IPyramidChartData[] : BarDatum[];
};

const DemographicSection: FunctionComponent<DemographicSectionProps> = ({
  snapshotData,
  pyramidChartData,
}) => {
  const { t } = useTranslation("kawasanku");

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
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <BarChart
                key={i}
                title={t(`snapshot.metric_${i + 1}`)}
                data={snapshotData[i]}
                height={snapshotData[i].length * 40 - 10}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default DemographicSection;
