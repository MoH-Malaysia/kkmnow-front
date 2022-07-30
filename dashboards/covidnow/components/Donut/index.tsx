import { FunctionComponent, ReactElement } from "react";
import { ResponsiveRadialBar } from "@nivo/radial-bar";
import { ChartHeader } from "@dashboards/covidnow/components";
interface DonutProps {
  className?: string;
  data?: any;
  menu?: ReactElement;
  title?: string;
  controls?: ReactElement;
  animate?: boolean;
  innerRadius?: number;
  interactive?: boolean;
}

const Donut: FunctionComponent<DonutProps> = ({
  className = "",
  data = dummy,
  menu,
  title,
  controls,
  animate = false,
  interactive = true,
  innerRadius = 0.7,
}) => {
  return (
    <div>
      <ChartHeader title={title} menu={menu} controls={controls} />
      <div className={className}>
        <ResponsiveRadialBar
          data={data}
          theme={{
            grid: {
              line: {
                strokeWidth: 1.5,
                strokeDasharray: "5 5",
              },
            },
          }}
          colors={["rgba(15, 23, 42, 1)", "rgba(241, 245, 249, 1)"]}
          endAngle={360}
          radialAxisStart={null}
          radialAxisEnd={null}
          circularAxisOuter={null}
          enableRadialGrid={false}
          innerRadius={innerRadius}
          animate={animate}
          isInteractive={interactive}
          padding={0.1}
        />
      </div>
    </div>
  );
};

const dummy = [
  {
    id: "Supermarket",
    data: [
      {
        x: "Vegetables",
        y: 233,
      },
      {
        x: "Fruits",
        y: 78,
      },
    ],
  },
];

export default Donut;
