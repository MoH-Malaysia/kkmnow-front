import { ResponsiveChoropleth } from "@nivo/geo";
import { FunctionComponent, ReactElement, useState } from "react";
import { ChartHeader } from "@components/index";
import {
  CHOROPLETH_RED_SCALE,
  CHOROPLETH_GREEN_SCALE,
  CHOROPLETH_BLUE_SCALE,
  CHOROPLETH_RED_PURPLE_SCALE,
  CHOROPLETH_YELLOW_GREEN_BLUE_SCALE,
} from "@lib/constants";
import ParliamentDesktop from "@lib/geojson/parlimen_desktop.json";
import ParliamentMobile from "@lib/geojson/parlimen_mobile.json";
import DunDesktop from "@lib/geojson/dun_desktop.json";
import DunMobile from "@lib/geojson/dun_mobile.json";
import StateDesktop from "@lib/geojson/state_desktop.json";
import StateMobile from "@lib/geojson/state_mobile.json";
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
  unitY?: string;
  enableScale?: boolean;
  graphChoice?: any;
  colorScale?: any;
  borderWidth?: any;
  borderColor?: any;
  projectionTranslation?: any;
  projectionScaleSetting?: number;
}

const Choropleth: FunctionComponent<ChoroplethProps> = ({
  className = "w-full h-[400px]",
  controls,
  menu,
  title,
  data = dummyData,
  unitY,
  enableScale = true,
  graphChoice = "ParliamentDesktop",
  colorScale = "CHOROPLETH_RED_SCALE",
  borderWidth = 0.25,
  borderColor = "#13293d",
  projectionTranslation = [0.65, 0.9] as [number, number],
  projectionScaleSetting = 3500,
}) => {
  const graphChoices: any = {
    ParliamentDesktop: ParliamentDesktop,
    ParliamentMobile: ParliamentMobile,
    DunDesktop: DunDesktop,
    DunMobile: DunMobile,
    StateDesktop: StateDesktop,
    StateMobile: StateMobile,
  };

  const colorScales: any = {
    CHOROPLETH_RED_SCALE: CHOROPLETH_RED_SCALE,
    CHOROPLETH_GREEN_SCALE: CHOROPLETH_GREEN_SCALE,
    CHOROPLETH_BLUE_SCALE: CHOROPLETH_BLUE_SCALE,
    CHOROPLETH_RED_PURPLE_SCALE: CHOROPLETH_RED_PURPLE_SCALE,
    CHOROPLETH_YELLOW_GREEN_BLUE_SCALE: CHOROPLETH_YELLOW_GREEN_BLUE_SCALE,
  };

  const [feature, setState] = useState(graphChoices[graphChoice].features);
  const config = {
    colors: colorScales[colorScale],
    projectionScale: projectionScaleSetting,
    projectionTranslation: [0.65, 0.9] as [number, number],
    borderWidth: borderWidth,
    borderColor: borderColor,
  };
  return (
    <div>
      <ChartHeader title={title} menu={menu} controls={controls} />
      <div className={className}>
        <ResponsiveChoropleth
          data={data}
          features={feature}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          colors={config.colors}
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
          projectionTranslation={projectionTranslation}
          projectionRotation={[-114, 0, 0]}
          borderWidth={config.borderWidth}
          borderColor={config.borderColor}
          tooltip={({ feature: { data } }) => {
            return data?.id ? (
              <div className="nivo-tooltip">
                {data.id}:{" "}
                {data.value_real
                  ? numFormat(data.value_real, "standard")
                  : numFormat(data.value, "standard")}
                {unitY}
              </div>
            ) : (
              <></>
            );
          }}
        />
      </div>
      {enableScale && <ChoroplethScale colors={config.colors}></ChoroplethScale>}
    </div>
  );
};

/**
 * Choropleth Scale Component
 */
interface ChoroplethScaleProps {
  colors: string[];
}
const ChoroplethScale: FunctionComponent<ChoroplethScaleProps> = ({ colors }) => {
  const [min, max] = [colors[0], colors[colors.length - 1]];

  return (
    <div>
      <div
        className="h-3 w-full border border-black lg:ml-auto lg:max-w-[280px]"
        style={{ backgroundImage: `linear-gradient(to right, ${min}, ${max})` }}
      ></div>
      <div className="flex w-full justify-between lg:ml-auto lg:max-w-[280px]">
        <small>Minimum</small>
        <small>Maximum</small>
      </div>
    </div>
  );
};

const dummyData = [
  {
    id: "MYS",
    value: 416502,
  },
];

export default Choropleth;
