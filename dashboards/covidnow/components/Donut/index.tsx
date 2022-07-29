import { FunctionComponent, ReactElement } from "react";
import { ResponsiveRadialBar } from "@nivo/radial-bar";
interface DonutProps {
  className?: string;
  data?: any;
  menu?: ReactElement;
  title?: string;
  animate?: boolean;
  innerRadius?: number;
  interactive?: boolean;
}

const Donut: FunctionComponent<DonutProps> = ({
  className = "",
  data = dummy,
  menu,
  title,
  animate = false,
  interactive = true,
  innerRadius = 0.7,
}) => {
  return (
    <div>
      <div className="grid grid-cols-2">
        <span className="text-base font-bold">{title ?? ""}</span>
        {menu && <div className="flex items-center justify-end gap-2">{menu}</div>}
      </div>
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
