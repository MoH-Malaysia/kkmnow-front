import { ResponsiveChoropleth } from "@nivo/geo";
import { FunctionComponent, useState } from "react";

interface ChoroplethProps {
  className?: string;
  title?: string;
  data?: any;
}

// import dunGeojsonMobile from "../../geojson/dun_mobile.json";
// import { features as Malaysia } from "../../../kawasanku/geojson/malaysia.json";
import { features as ParliamentDesktop } from "../../../kawasanku/geojson/parlimen_desktop.json";
// import { features as ParliamentMobile } from "../../../kawasanku/geojson/parlimen_mobile.json";
// import { features as DunDesktop } from "../../../kawasanku/geojson/dun_desktop.json";
import { features as DunMobile } from "../../../kawasanku/geojson/dun_mobile.json";
// import dunGeojsonDesktop from "../../geojson/dun_desktop.json";
// import parlimenGeojsonMobile from "../../geojson/parlimen_mobile.json";
// import parlimenGeojsonDesktop from "../../geojson/parlimen_desktop.json";

const Choropleth: FunctionComponent<ChoroplethProps> = ({
  className = "w-full h-[450px]",
  title,
  data = dummyData,
}) => {
  const [feature, setState] = useState(ParliamentDesktop);
  const choroplethConfig = {
    colors: ["#FFF"],
    projectionScale: 2400,
    projectionTranslation: [0.55, 0.8] as [number, number],
    borderWidth: 0.25,
    borderColor: "#13293d",
  };
  return (
    <div className={className}>
      {title && <span className="text-base font-bold">{title}</span>}
      <ResponsiveChoropleth
        data={data}
        features={feature}
        margin={{ top: 0, right: 64, bottom: 0, left: 64 }}
        colors={choroplethConfig.colors}
        domain={[0, 100]}
        unknownColor="#fff"
        projectionScale={choroplethConfig.projectionScale}
        projectionTranslation={choroplethConfig.projectionTranslation}
        projectionRotation={[-114, 0, 0]}
        borderWidth={choroplethConfig.borderWidth}
        borderColor={choroplethConfig.borderColor}
        // tooltip={({ feature: { data } }) => {
        //   return data?.id ? <div className="nivo-tooltip">{data.id}</div> : <></>;
        // }}
      ></ResponsiveChoropleth>
    </div>
  );
};

export default Choropleth;

const dummyData = [
  {
    id: "MYS",
    value: 416502,
  },
];
