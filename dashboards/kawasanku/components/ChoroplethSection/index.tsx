import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";

import { IChoroplethData } from "@dashboards/kawasanku/lib/types";
import { getChoroplethColors } from "@dashboards/kawasanku/lib/helpers";
import { CHOROPLETH_METRICS, GEO_FILTER } from "@dashboards/kawasanku/lib/constants";

import { OptionType } from "@components/types";

import ChoroplethScale from "./Scale";
import Dropdown from "@components/Dropdown";
import SectionHeading from "../SectionHeading";

const ChoroplethChart = dynamic(() => import("./Chart"), {
  ssr: false,
});

const Choropleth = () => {
  const { t } = useTranslation("kawasanku");

  const [data, setData] = useState<IChoroplethData[]>([]);
  const [metric, setMetric] = useState<OptionType<string, CHOROPLETH_METRICS>>();
  const [geoFilter, setGeoFilter] = useState<GEO_FILTER.Parliament | GEO_FILTER.Dun>(
    GEO_FILTER.Parliament
  );

  const choroplethMetricOptons = Object.values(CHOROPLETH_METRICS).map(metric => ({
    label: t(`choropleth.${metric}`),
    value: metric,
  }));

  // TODO (@itschrislow): update useEffect hook when API is ready
  // useEffect(() => {
  //   if (metric && geoFilter) {
  //     getChoropleth({
  //       metric,
  //       geoFilter,
  //     })
  //       .then(data => setData(data))
  //       .catch(err => console.log(err));
  //   } else {
  //     setData([]);
  //   }
  // }, [metric, geoFilter]);

  return (
    <div className="py-6">
      <SectionHeading>{t("section3_title")}</SectionHeading>
      <div className="flex h-full w-full flex-col items-center gap-2 md:flex-row md:gap-7">
        {/* INDICATOR */}
        <div className="flex h-full w-full items-center gap-2 md:w-auto">
          <p className="text-sm">{t("indicator")}:</p>
          <div className="w-full md:w-[238px]">
            <Dropdown<string, CHOROPLETH_METRICS>
              placeholder={t("choropleth_metric_placeholder")}
              options={choroplethMetricOptons}
              selected={metric}
              onChange={setMetric}
            />
          </div>
        </div>
        {/* PARLIAMENT CHECKBOX */}
        <div className="relative flex w-full items-center md:w-auto">
          <div className="flex h-5 items-center">
            <input
              id="parliament"
              name="area"
              type="radio"
              checked={geoFilter === GEO_FILTER.Parliament}
              onChange={() => setGeoFilter(GEO_FILTER.Parliament)}
              className="h-5 w-5 cursor-pointer rounded-full border-outline text-dim focus:outline-none focus:ring-0 focus:ring-transparent"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="parliament" className="cursor-pointer">
              {t(GEO_FILTER.Parliament)}
            </label>
          </div>
        </div>
        {/* DUN CHECKBOX */}
        <div className="relative flex w-full items-center md:w-auto">
          <div className="flex h-5 items-center">
            <input
              id="dun"
              name="area"
              type="radio"
              checked={geoFilter === GEO_FILTER.Dun}
              onChange={() => setGeoFilter(GEO_FILTER.Dun)}
              className="h-5 w-5 cursor-pointer rounded-full border-outline text-dim focus:outline-none focus:ring-0 focus:ring-transparent"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="dun" className="cursor-pointer">
              {t(GEO_FILTER.Dun)}
            </label>
          </div>
        </div>
      </div>
      {/* CHOROPLETH CHART */}
      <ChoroplethChart metric={metric?.value} geoFilter={geoFilter} data={data} />
      {/* CHOROPLETH SCALE */}
      <div className="flex h-full w-full justify-end">
        <div className="w-full sm:w-1/3">
          <ChoroplethScale colorScale={metric ? getChoroplethColors(metric.value) : undefined} />
        </div>
      </div>
    </div>
  );
};

export default Choropleth;
