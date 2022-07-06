import dynamic from "next/dynamic";
import { BarDatum } from "@nivo/bar";
import { FunctionComponent } from "react";
import { useTranslation } from "next-i18next";

import { IPyramidChartData } from "@dashboards/kawasanku/lib/types";

import ChartTitle from "./ChartTitle";
import SectionHeading from "../SectionHeading";

const PyramidChart = dynamic(() => import("./PyramidChart"), { ssr: false });

type DemographicSectionProps = {
  pyramidChartData: BarDatum extends IPyramidChartData[] ? IPyramidChartData[] : BarDatum[];
};

const DemographicSection: FunctionComponent<DemographicSectionProps> = ({ pyramidChartData }) => {
  const { t } = useTranslation("kawasanku");

  return (
    <div className="py-6">
      <SectionHeading>
        {t("section1_title1")} <span className="capitalize underline">{t("malaysia")}</span>{" "}
        {t("section1_title2")}
      </SectionHeading>
      <div className="flex w-full flex-col gap-4 lg:flex-row">
        {/* POPULATION PYRAMID CHART */}
        <div className="w-full lg:w-1/3">
          <ChartTitle>Population</ChartTitle>
          <PyramidChart data={pyramidChartData} />
        </div>
        <div className="w-full lg:w-2/3"></div>
      </div>
    </div>
  );
};

export default DemographicSection;
