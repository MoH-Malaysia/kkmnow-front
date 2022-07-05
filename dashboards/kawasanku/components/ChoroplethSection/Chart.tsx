import { FunctionComponent } from "react";
import { ResponsiveChoropleth } from "@nivo/geo";

import { BREAKPOINTS } from "@lib/constants";
import { useWindowWidth } from "@hooks/useWindowWidth";

import { IChoroplethData } from "@dashboards/kawasanku/lib/types";
import { CHOROPLETH_METRICS, GEO_FILTER } from "@dashboards/kawasanku/lib/constants";
import { getChoroplethColors, getChoroplethBorderColor } from "@dashboards/kawasanku/lib/helpers";

import dunGeojsonMobile from "../../geojson/dun_mobile.json";
import dunGeojsonDesktop from "../../geojson/dun_desktop.json";
import parlimenGeojsonMobile from "../../geojson/parlimen_mobile.json";
import parlimenGeojsonDesktop from "../../geojson/parlimen_desktop.json";

type ChoroplethChartProps = {
  metric?: CHOROPLETH_METRICS;
  geoFilter?: GEO_FILTER.Parliament | GEO_FILTER.Dun;
  data: IChoroplethData[];
};

type ChoroplethConfigType = {
  colors: string[];
  projectionScale: number;
  projectionTranslation: [number, number];
  borderWidth: number;
  borderColor: string;
};

const ChoroplethChart: FunctionComponent<ChoroplethChartProps> = ({ metric, geoFilter, data }) => {
  const width = useWindowWidth();
  const isMobile = width < BREAKPOINTS.SM;
  const isTablet = width <= BREAKPOINTS.MD;

  const choroplethConfig: ChoroplethConfigType = {
    colors: metric ? getChoroplethColors(metric) : ["#FFF"],
    projectionScale: isMobile ? 1750 : 3000,
    projectionTranslation: [
      isMobile ? 0.5 : isTablet ? 0.52 : 0.67,
      isMobile ? 0.97 : isTablet ? 1.05 : 0.85,
    ],
    borderWidth: metric ? 0.1 : 0.25,
    borderColor: metric ? getChoroplethBorderColor(metric) : "#13293d",
  };

  const getChoroplethFeatures = () => {
    if (isTablet) {
      if (geoFilter === GEO_FILTER.Dun) return dunGeojsonMobile.features;
      else return parlimenGeojsonMobile.features;
    } else {
      if (geoFilter === GEO_FILTER.Dun) return dunGeojsonDesktop.features;
      else return parlimenGeojsonDesktop.features;
    }
  };

  return (
    <div className="h-[388px] sm:h-[588px]">
      <ResponsiveChoropleth
        data={data}
        features={getChoroplethFeatures()}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        colors={choroplethConfig.colors}
        domain={[0, 100]}
        unknownColor="#fff"
        valueFormat=".2s"
        projectionScale={choroplethConfig.projectionScale}
        projectionTranslation={choroplethConfig.projectionTranslation}
        projectionRotation={[-114, 0, 0]}
        borderWidth={choroplethConfig.borderWidth}
        borderColor={choroplethConfig.borderColor}
        tooltip={({ feature: { data } }) => {
          return data?.id ? <div className="nivo-tooltip">{data.id}</div> : <></>;
        }}
      />
    </div>
  );
};

export default ChoroplethChart;
