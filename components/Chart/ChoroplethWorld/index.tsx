import { ResponsiveChoropleth } from "@nivo/geo";
import { FunctionComponent, ReactElement, useState } from "react";
import { ChartHeader } from "@components/index";
import {
  // CHOROPLETH_RED_SCALE,
  //   CHOROPLETH_GREEN_SCALE,
  CHOROPLETH_BLUE_SCALE,
  //   CHOROPLETH_RED_PURPLE_SCALE,
  //   CHOROPLETH_YELLOW_GREEN_BLUE_SCALE,
} from "@lib/constants";
import WorldDesktop from "@lib/geojson/world_desktop.json";
import { numFormat } from "@lib/helpers";

/**
 * Choropleth component
 */
interface ChoroplethProps {
  className?: string;
  menu?: ReactElement;
  title?: string;
  controls?: ReactElement;
  data?: any;
  xKey?: string;
  enableScale?: boolean;
  projectionScaleSetting?: number;
}

const ChoroplethWorld: FunctionComponent<ChoroplethProps> = ({
  className = "w-full h-[400px]",
  controls,
  menu,
  title,
  data = dummyData,
  enableScale = true,
  projectionScaleSetting = 125,
  xKey,
}) => {
  const [feature, setState] = useState(WorldDesktop.features);
  const config = {
    colors: CHOROPLETH_BLUE_SCALE,
    projectionScale: projectionScaleSetting,
    projectionTranslation: [0.5, 0.75] as [number, number],
    borderWidth: 0.25,
    borderColor: "#13293d",
  };
  return (
    <div>
      <ChartHeader title={title} menu={menu} controls={controls} />
      <div className={className}>
        <ResponsiveChoropleth
          data={data}
          features={feature}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          label={xKey}
          colors={CHOROPLETH_BLUE_SCALE}
          domain={[
            Math.min.apply(
              Math,
              data.map((item: any) => item.value)
            ),
            Math.max.apply(
              Math,
              data.map((item: any) => item.value)
            ),
          ]}
          unknownColor="#fff"
          projectionType="mercator"
          projectionScale={config.projectionScale}
          projectionTranslation={config.projectionTranslation}
          projectionRotation={[0, 0, 0]}
          borderWidth={config.borderWidth}
          borderColor={config.borderColor}
          tooltip={({ feature: { data, label } }) => {
            return data?.id ? (
              <div className="nivo-tooltip">
                {label}: {numFormat(data.value_real, "standard")}
              </div>
            ) : (
              <></>
            );
          }}
        />
      </div>
      {enableScale && <ChoroplethScale data={data} colors={config.colors}></ChoroplethScale>}
    </div>
  );
};

/**
 * Choropleth Scale Component
 */
interface ChoroplethScaleProps {
  colors: string[];
  data: any;
}
const ChoroplethScale: FunctionComponent<ChoroplethScaleProps> = ({ colors, data }) => {
  const [min, max] = [colors[0], colors[colors.length - 1]];

  return (
    <div>
      <div
        className="h-3 w-full border border-black lg:ml-auto lg:max-w-[280px]"
        style={{ backgroundImage: `linear-gradient(to right, ${min}, ${max})` }}
      ></div>
      <div className="flex w-full justify-between lg:ml-auto lg:max-w-[280px]">
        <small>
          {Math.min.apply(
            Math,
            data.map((item: any) => item.value_real)
          )}
        </small>
        <small>
          {Math.max.apply(
            Math,
            data.map((item: any) => item.value_real)
          )}
        </small>
      </div>
    </div>
  );
};

const dummyData = [
  {
    id: "MYS",
    value: 416502,
  },
  {
    id: "AGO",
    value: 416502,
  },
];

export default ChoroplethWorld;
